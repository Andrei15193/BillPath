import type { JestConfigWithTsJest } from "ts-jest";
import fs  from "fs";

export default {
  verbose: true,
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testEnvironmentOptions: {
    html: fs.readFileSync("index.html").toString(),
    url: "http://localhost:8000",
    contentType: "text/html"
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        astTransformers: {
          before: [
            {
              path: "@formatjs/ts-transformer/ts-jest-integration",
              options: {
                overrideIdFn: "[sha512:contenthash:base64:6]"
              }
            }
          ]
        }
      }
    ]
  },
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/_config/tests/fileMock.ts",
    "\\.(css|less)$": "<rootDir>/_config/tests/styleMock.ts"
  },
  setupFilesAfterEnv: [
    "<rootDir>/_config/tests/setupTests.ts"
  ],
  testPathIgnorePatterns: [
    "/node_modules/"
  ],
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**"
  ],
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  }
} as JestConfigWithTsJest ;