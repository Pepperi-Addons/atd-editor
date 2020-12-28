export const tabsSchema = {
	"Name": "tabs",
    "Type": "data",
    "Fields": {"AddonUUID": {"Type": "String"}, "Key": {"Type": "String"}, "Editor": {"Type": "String"}, "Title": {"Type": "String"}, "Type": {"Type": "String"}, "Index": {"Type": "Number"}}
}
export const tabsData = [
    // Editor Tabs
    {
        "Index": 0,
        "Title": "General",
        "AddonUUID": "04de9428-8658-4bf7-8171-b59f6327bbf1",
        "Editor": "transaction_types/ATD_ID/general",
        "Type": "tabs",
        "Key": "general"
    },
    {
        "Index": 1,
        "Title": "Views",
        "AddonUUID": "04de9428-8658-4bf7-8171-b59f6327bbf1",
        "Editor": "transaction_types/ATD_ID/views",
        "Type": "tabs",
        "Key": "views"
    },
    {
        "Index": 2,
        "Title": "Actions",
        "AddonUUID": "04de9428-8658-4bf7-8171-b59f6327bbf1",
        "Editor": "transaction_types/ATD_ID/actions",
        "Type": "tabs",
        "Key": "actions"
    },
    {
        "Index": 3,
        "Title": "Workflows",
        "AddonUUID": "04de9428-8658-4bf7-8171-b59f6327bbf1",
        "Editor": "transaction_types/ATD_ID/workflows",
        "Type": "tabs",
        "Key": "workflows"
    },
    {
        "Index": 4,
        "Title": "Programs",
        "AddonUUID": "04de9428-8658-4bf7-8171-b59f6327bbf1",
        "Editor": "transaction_types/ATD_ID/programs",
        "Type": "tabs",
        "Key": "programs"
    },
    {
        "Index": 5,
        "Title": "Accounts",
        "AddonUUID": "04de9428-8658-4bf7-8171-b59f6327bbf1",
        "Editor": "transaction_types/ATD_ID/accounts",
        "Type": "tabs",
        "Key": "accounts"
    },
    {
        "Index": 6,
        "Title": "ePayment",
        "AddonUUID": "04de9428-8658-4bf7-8171-b59f6327bbf1",
        "Editor": "transaction_types/ATD_ID/epayment",
        "Type": "tabs",
        "Key": "epayment"
    },
    {
        "Index": 7,
        "Title": "Settings",
        "AddonUUID": "04de9428-8658-4bf7-8171-b59f6327bbf1",
        "Editor": "transaction_types/ATD_ID/settings",
        "Type": "tabs",
        "Key": "settings"
    },
    {
        "Editor": "transaction_types/ATD_ID/accounts",
        "Key": "accounts"
    },
    {

        "Editor": "transaction_types/ATD_ID/actions",
        "Key": "actions"
    },
    {
        "Index": 8,
        "Title": "Fields",
        "AddonUUID": "04de9428-8658-4bf7-8171-b59f6327bbf1",
        "Editor": "transaction_types/ATD_ID/fields",
        "Type": "tabs",
        "Key": "fields"
    },



    // List Menu
    {
        "Title": "Edit",
        "AddonUUID": "04de9428-8658-4bf7-8171-b59f6327bbf1",
        "Editor": "transaction_types/ATD_ID/general",
        "Type": "menu",
        "Key": "1"
    },
    {
        "Title": "Import",
        "AddonUUID": "e9029d7f-af32-4b0e-a513-8d9ced6f8186",
        "Editor": "import-atd",
        "Type": "menu",
        "Key": "2"
    },
    {
        "Title": "Export",
        "AddonUUID": "e9029d7f-af32-4b0e-a513-8d9ced6f8186",
        "Editor": "export-atd",
        "Type": "menu",
        "Key": "3"
    },
    {
        "Title": "Delete",
        "AddonUUID": "",
        "Editor": "",
        "Type": "menu",
        "Key": "4"
    }


]
