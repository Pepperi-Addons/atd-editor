# Object type editor (ATD Editor)

## High Level
- The ATD editor addon hosts other addons within it's UI, in its menus and tabs. The addons in the menu are then called for action, and their UI is displayed within the tabs.

- This addon give the ability to configure Transactions/Activities/Accounts Types.

 - Transaction Types: allow you to create sales transactions (ex. Invoice, Return, Quote, Future Order). For each type you can customize every aspect of the process - the Cart, the Order PDF, header/footer of Order PDF, how items are summarized, as well as email notifications, file export, and integration Workflow triggered by an order status change, sharing settings and more.

 - Activities Types: allow you to add your own customized Activity forms. Create an Activity type, select an icon for it, create a form and add the fields required. Activities can then be added to the Sales Teams Activities and Menu.

 - Account Types: allow you to categorize your Accounts by type such as Customers, Van customers, Warehouses, etc. and segment by user profile. Define the name of the Account type and which fields should be displayed on its information form. The Account types can then be added to lists per user profile.
---

## Releases
| Version | Description | Migration |
|-------- |------------ |---------- |
| 1.0.135  | Display list of Transaction/Activitie/Account Types and add ability to configure each of them  |

---

## Deployment
After a Pull Request is merged into a release branch, avilable version will be published.

---

## Debugging
#### Client side: 
To debug your addon with developer toolbar (chrome or any other browser dev tool).
- Open terminal --> change to client-side --> Start your addon with npm start.
- Go to Settings --> Sales Activities --> Transaction Types or 
Open your browser at: https://app.pepperi.com/settings_block/04de9428-8658-4bf7-8171-b59f6327bbf1/transactions?dev=true.

- Open the browser inspector to make sure that the editor file is served locally
#### Server side: 
To debug your addon with `Visual Studio Code`, set the RUN mode to 'Launch API Server', press `F5` or `Run->Start Debugging`.
You can then checkout your *API* at http://localhost:4401/api/foo. Be sure to supply a JWT for it to work.
#### CPI side:
There is no CPI side.

---

## Testing

There are no tests included within the ATD editor addon itself, and all tests are handled by the QA team.

---

## Dependencies

| Addon | Usage |
|-------- |------------ |
| [scripts](https://bitbucket.org/pepperiatlasian/webapp/src/master/) | version 2.0.4 or higher |
---

## APIs

The API is hosted on the [Pepperi API Design Center](https://apidesign.pepperi.com/).

- [Relations](https://apidesign.pepperi.com/addon-relations/addons-link-table#atd-editor-addon): returns a list of addons that should be added to the list of tabs, those that have a relation to ATD editor.
- [Relation Types](https://apidesign.pepperi.com/addon-relations/addons-link-table/addon-ui-within-another-addon): return list filtered by type.

---

## Limitations
There is no limits.

---

## Architecture
see: [Architecture](./architecture.md)

---

## Known issues

- [provide any information regarding known issues (bugs, qwerks etc.) in the addon] 

---

## Future Ideas & Plans

- [provide any knowledge regarding meaningful future plans for the addons (features, refactors etc.)]

## Usage
- Install the addon & all his dependencies.
- Navigate to Settings --> Sales Activities --> Transaction/Activity Types (and olso to Accounts --> Views & Forms).


## UI
- The addon acts as a host. Displays content from other addons or legacy pages. The ui comes from the guestsץ

