Finance tracker, under development, trying to make it awesome :)

This is a reimplementation of [Littlefinger](https://github.com/Andrei15193/Littlefinger) using [ReactJS](https://react.dev/) + [React MVVM](https://www.npmjs.com/package/react-model-view-viewmodel) and [dotnet](https://dotnet.microsoft.com/) with [GraphQL](https://graphql.org/) for the public API layer.

BillPath is an older atempt of mine of writing a finance tracking tool developed while I was doing my master's degree as homework. I like the name and probably using "Littlefinger" is cool, but it may end up in some IP conflicts or whatever (me dreaming that the app will be a complete success and everyone will be using it haha).

[Littlefinger](https://github.com/Andrei15193/Littlefinger) was developed as a fun project as a multi-page appliation to (re-)explore the way we once used to write web apps. We can work around a large number of issues and we can basically get the same features as a single-page application, there's more back and forth between the client and server, but we can pretty much do everything.

Having the initial project written in [TypeScript](https://www.typescriptlang.org/), well, JavaScript is not exactly accurate when it comes to working with numbers, it's unreliable and a library for handling this is more or less required. We can work around JavaScript's shortcomings when it comes to dealing with decimals, we have options.

I've used [Bootstrap](https://getbootstrap.com/) for the UI on most of my projects, but I want to try [FluentUI](https://developer.microsoft.com/fluentui), we are using it on the project at my workplace as it looks quite nice, it comes with a large number of controls and also the nice styling. From what I gather we can use it with [MAUI](https://dotnet.microsoft.com/apps/maui) as well, might get a mobile or desktop app as well.

## Roadmap

**Preview Version** ![taking off](./assets/taking-off.png)  
\- Project setup ![done](./assets/done.png)  
\- Automated deployment ![done](./assets/done.png)  
\- Expense tracking ![planned](./assets/planned.png)  
\- Expense templates ![planned](./assets/planned.png)  
\- Expense tag management ![planned](./assets/planned.png)  
\- Expense shop management ![planned](./assets/planned.png)  
\- Currency management ![planned](./assets/planned.png)  
\- Dashboard ![planned](./assets/planned.png)

![taking off](./assets/taking-off.png) = taking off
| ![in flight](./assets/in-flight.png) = in flight
| ![landing](./assets/landing.png) = landing  
![planned](./assets/planned.png) = planned
| ![in-progress](./assets/in-progress.png) = in progress
| ![done](./assets/done.png) = done
| ![cancelled](./assets/cancelled.png) = cancelled

## Preview Version

First, I will be implementing this as a static website and cover the expense tracking. This is a preview version to get started with [FluentUI](https://developer.microsoft.com/fluentui) and explore the UI, all data will be stored using local storage and have some data options such as "clear data", or maybe even a data browser.

This is only an initial implementation, all the object and type definitions should be easy to migrate to use [GraphQL](https://graphql.org/), authentication is not handled as everything is local, however I will build the application with authorization in mind. Authentication will be implemented using [Entra ID (Azure Active Directory B2C)](https://learn.microsoft.com/azure/active-directory-b2c/) and probably authorization as well (getting claims and all that).

The preview will be hosted on [GitHub Pages](https://pages.github.com/) and deployed through [GitHub Actions](https://docs.github.com/actions) as this will be a static website. It may feature backup and restore options so the app alone can be used directly without any authentication. Being able to create backups and then restore them allows for a manual backup option. Once a week you can create a backup and whenever you change the browser you can restore that backup and you will have all of your expenses there.

## Internationalization (i18n)

Working on this I've learned something quite interesting and very useful when it comes to translations. I've came across something similar a while ago on a different project, but handing translations like this makes it really easy.

Instead of the usual approach to translations where we define our translation files with explicit keys for each translation label, we can leverage the FormatJS tooling to extract and generate translation keys for us.

This makes development easier because we can provide default messages and descriptions for context, and have them removed in the resulting bundle so they only reference the generated ID.

Wherever we use phrases that need to be translated we provide the default message in English, we clearly see what would be shown and thether there are any arguments we need to pass.

Through the tooling that they provide we can even tap into the extracted messages and fill our translation files with the missing ones, and remove the extra ones. They will show up nicely in the diff editor of the commit and we will know what needs to be translated for each particular language.

The default language will contain the default messages and we do not need to make any changes to that.

What I also like about this is that we can configure ESlint rules so we can enforce default messages and descriptions, as well as ensure there are no string literals in JSX as we can easily forget about it and commit the changes.

This is a change in the usuall approach I have about this, but I really like and the tooling to keep everything up to date is great. One of the best things is removal of translation keys that are no longer used, it's always a gamble when we manually manage them as sometimes we get translation keys from the API and we do not know whether we can safely remove them or not so we just keep them around.

Something to keep in mind is that Webpack uses caches when runnign the dev server and probably when having a watch build, for good reason. The side effect of this is that not all files will go through the loaders as their compilation result is cached thus **not all** messages will be caught in a rebuild.

I've worked around this by tracking extracted messges by file. When a compilation starts then messages for any file may be cleared, but the clear only happens for changed files as the loader provides both the file name and extracted message. If a file has been previously processed, i.e.: initial compilation, and it does not change, then the loader will not call the plugin callback for that file thus all already extracted messages remain the same.

## Cost Tracking

As part of the project, I want to keep track of monthly costs and maybe show them on the dashboard along side latest commits, last month's hosting cost for release environment and development costs and so on. It may be useful if I want to setup donations so it is clear how much of the donations are covering the hosting and other associated costs.

The monthly goal would be to be able to cover the hosting costs, also showing total costs thus far and how much donations have covered this to know how much I've paid for the app and how much was covered by other people, if at all :D

Money is always a sensitive topic, this is not intended to make people uneasy or put banners in their face saying something like "HEY! YOU ARE USING THIS APP FOR FREE, DONATE!!1!". The service is provided for free.

If I end up needing to cover costs for hosting and so on I will get some subscription plan, like BillPath Premium or something like that, and get some features behind a paywall and if you need them you pay for them. Just like any other company.

I really don't like it when I get "bullied" or guilt tripped for not donating for an open-source project. I get it, people want to work on their own projects and also get paid for it, however we live in the real world where we do not always get to always do what we want and the world to just support us.

I've always seen open-source as being free work, if you get something back from donations, great, however I do not think it is fair to have the expectation that people will donate. If the intent of an open-source project is to get money for their work, put up a license, sell the product under commercial laws and not expect donations to magically pop up and cover your efforts.

This applies to this project as well, it is open-source and is licensed that any changes to it must also be open-source. I think it is only fair to maintain all development on this project and other changes that spring from it as open-source.

Going forward, I won't be showing the total cost of hosting, development and other things on the dashboard. I will be storing the billing information for each invoice, but this is mostly for me to know how much I've been spending on this.

It depends if I opt for donations, in which case it makes sense. As a donor you should know how much your donation is helping, if at all, and whether there are some costs that need to be covered. The donations route is for keeping the project going, not making me rich. To be fair, I wouldn't refuse any extra cash haha

If I go down the license and BillPath Premium route, then the paid features will be similar to what you get from a company. 24-hour or 48-hour resposne time for assistence, uptime guarantees also known as Service-Level Agreement (SLA) and all the other goodies. The purpose is to offer a service for an amount of money that ensures the continuation of the project, both maintainance and development of new features, and make a modest profit.

The routes are obviously different at their core and it depends on what I am willing to sign myself up for. With donations I can just flip a switch and turn off the app, it's open-source so anyone can host the app and continue. With licensing and subscriptions I need to provide a service regardless of how I feel about the project, turning off the app will take some time and needs to be clearly covered in the terms of service.

## Resources

* Icons used from https://icons8.com/
* Color palette from https://www.colorcombos.com  
  https://www.colorcombos.com/color-schemes/5821/ColorCombo5821.html  
  \- #C5AAF5  
  \- #A3CBF1  
  \- #79BFA1  
  \- #F5A352  
  \- #FB7374 (accent)  
  \- #423C40