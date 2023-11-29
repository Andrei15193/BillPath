Finance tracker, under development, trying to make it awesome :)

This is a reimplementation of [Littlefinger](https://github.com/Andrei15193/Littlefinger) using [ReactJS](https://react.dev/) + [React MVVM](https://www.npmjs.com/package/react-model-view-viewmodel) and [dotnet](https://dotnet.microsoft.com/) with [GraphQL](https://graphql.org/) for the public API layer.

BillPath is an older atempt of mine of writing a finance tracking tool developed while I was doing my master's degree as homework. I like the name and probably using "Littlefinger" is cool, but it may end up in some IP conflicts or whatever (me dreaming that the app will be a complete success and everyone will be using it haha).

[Littlefinger](https://github.com/Andrei15193/Littlefinger) was developed as a fun project as a multi-page appliation to (re-)explore the way we once used to write web apps. We can work around a large number of issues and we can basically get the same features as a single-page application, there's more back and forth between the client and server, but we can pretty much do everything.

Having the initial project written in [TypeScript](https://www.typescriptlang.org/), well, JavaScript is not exactly accurate when it comes to working with numbers, it's unreliable and a library for handling this is more or less required. We can work around JavaScript's shortcomings when it comes to dealing with decimals, we have options.

I've used [Bootstrap](https://getbootstrap.com/) for the UI on most of my projects, but I want to try [FluentUI](https://developer.microsoft.com/fluentui), we are using it on the project at my workplace as it looks quite nice, it comes with a large number of controls and also the nice styling. From what I gather we can use it with [MAUI](https://dotnet.microsoft.com/apps/maui) as well, might get a mobile or desktop app as well.

## Preview Version

First, I will be implementing this as a static website and cover the expense tracking. This is a preview version to get started with [FluentUI](https://developer.microsoft.com/fluentui) and explore the UI, all data will be stored using local storage and have some data options such as "clear data", or maybe even a data browser.

This is only an initial implementation, all the object and type definitions should be easy to migrate to use [GraphQL](https://graphql.org/), authentication is not handled as everything is local, however I will build the application with authorization in mind. Authentication will be implemented using [Entra ID (Azure Active Directory B2C)](https://learn.microsoft.com/azure/active-directory-b2c/) and probably authorization as well (getting claims and all that).

The preview will be hosted on [GitHub Pages](https://pages.github.com/) and deployed through [GitHub Actions](https://docs.github.com/actions) as this will be a static website. It may feature backup and restore options so the app alone can be used directly without any authentication. Being able to create backups and then restore them allows for a manual backup option. Once a week you can create a backup and whenever you change the browser you can restore that backup and you will have all of your expenses there.
