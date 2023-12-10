import type { MessageDescriptor } from "react-intl";
import type { Compiler, WebpackPluginInstance } from "webpack";
import { exec, execSync } from "child_process";
import fs from "fs";
import path from "path";

export class ExtractMessagesPlugin implements WebpackPluginInstance {
  private static readonly _defaultLocale = "en-US";
  private static readonly _supportedLocales: readonly string[] = [
    "en-US",
    "ro-RO"
  ];
  private readonly _extractedMessages = new Map<string, Omit<MessageDescriptor, "id">>();

  public apply(compiler: Compiler): void {
    compiler.hooks.environment.tap("compile-i18n", () => this._compileI18n());

    compiler.hooks.beforeCompile.tap("clear-extracted-messages", () => {
      this._extractedMessages.clear();
    });

    compiler.hooks.afterEmit.tapPromise("generate-extracted-messages-async", async () => {
      await Promise.all(
        ExtractMessagesPlugin
          ._supportedLocales
          .map(localeId => this._processMessagesAsync(ExtractMessagesPlugin._defaultLocale === localeId , path.resolve("i18n", `${localeId}.json`), localeId))
      );
      await this._compileI18nAsync();
    });
  }

  public add({ id: messageId, ...messageDescriptor }: MessageDescriptor) {
    this._extractedMessages.set(messageId!, messageDescriptor)
  }

  private _compileI18n(): void {
    execSync("npm run compile-i18n");
  }

  private _compileI18nAsync(): Promise<void> {
    return new Promise<void>(
      (resolve, reject) => {
        exec("npm run compile-i18n", (err, stdout, stderr) => {
          if (err) {
            reject(err);
            // eslint-disable-next-line no-console
            console.error(stderr);
          }
          else
            resolve();
        });
      }
    );
  }

  private async _processMessagesAsync(overwrite: boolean, messagesFilePath: string, locale: string): Promise<void> {
    const messages = await this._loadMessagesAsync(messagesFilePath);

    Object
      .getOwnPropertyNames(messages)
      .forEach(messageId => {
        if (!this._extractedMessages.has(messageId))
          delete messages[messageId];
      });

    if (overwrite)
      this._extractedMessages.forEach((messageDescriptor, messageId) => {
        messages[messageId] = messageDescriptor;
      });
    else
      this._extractedMessages.forEach((messageDescriptor, messageId) => {
        if (!(messageId in messages))
          messages[messageId] = messageDescriptor;
      });

    await this._saveMessagesAsync(messagesFilePath, locale, messages);
  }

  private _loadMessagesAsync(messagesFilePath: string): Promise<Record<string, Omit<MessageDescriptor, "id">>> {
    return new Promise<Record<string, Omit<MessageDescriptor, "id">>>(
      (resolve, reject) => {
        if (fs.existsSync(messagesFilePath))
          fs.readFile(messagesFilePath, (err, data) => {
            if (err)
              reject(err);
            else
              resolve(JSON.parse(data.toString()))
          });
        else
          resolve({});
      }
    );
  }

  private _saveMessagesAsync(messagesFilePath: string, locale: string, messages: Record<string, Omit<MessageDescriptor, "id">>): Promise<void> {
    const sortedMessages = Object
      .getOwnPropertyNames(messages)
      .sort((left, right) => (messages[left].defaultMessage as string).localeCompare(messages[right].defaultMessage as string, locale, { sensitivity: "base" }))
      .reduce(
        (result, messageId) => {
          result[messageId] = messages[messageId];
          return result;
        },
        {} as Record<string, Omit<MessageDescriptor, "id">>
      );

    return new Promise<void>((resolve, reject) => {
      fs.writeFile(messagesFilePath, JSON.stringify(sortedMessages, undefined, 2), err => {
        if (err)
          reject(err);
        else
          resolve();
      })
    });
  }
}