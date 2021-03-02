import { ParsedUrlQuery } from "querystring";

export interface SubAddon {
    remoteName?: string;
    remoteEntry?: string;
    useModule?: boolean;
    exposedModule?: string;
    componentName?: string;
    UUID?: string;
    Editor?: string;
    Index?: number;
    Key?:  string;
    Title: string;
    Type?: string;
    top?: string;
    Action?: string;
}
export const addonsMetaDataScheme = {
	"Name": "addons_menus",
    "Type": "data",
    "Fields": {
        "UUID": {"Type": "String"},
         "Key": {"Type": "String"}, 
         "Editor": {"Type": "String"}, 
         "Title": {"Type": "String"}, 
         "Type": {"Type": "String"}, 
         "Index": {"Type": "Number"}
        }
}

export function getTabsData():SubAddon[] {
    const arr: SubAddon[] = [];
    const keys = ['general', 'views', 'actions', 'workflows', 'programs', 'accounts','epayment', 'settings', 'fields'];
    keys.forEach((Key, Index) =>{
        const options: SubAddon =   {
            remoteName: 'settings_iframe',
            useModule: true,
            exposedModule: './SettingsIframeModule',
            componentName: 'SettingsIframeComponent',
            UUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
            Editor: `transaction_types/ATD_ID/${Key}`,
            Index: Index,
            Key:  Key,
            Title: `${Key.slice(0,1).toUpperCase() + Key.slice(1)}`,
            Type: "tabs",
            top: "230"
        }
        arr.push(options);
    });
    return arr;
}


export const menuMetaData =[

        {
            Title: "Edit",
            UUID: "04de9428-8658-4bf7-8171-b59f6327bbf1",
            Editor: "transaction_types/ATD_ID/general",
            Type: "menu",
            Key: "1",
            Action: "navigate"
        },
        {
            remoteName: 'import_export_atd',
            useModule: true,
            exposedModule: './ImportAtdModule',
            componentName: 'ImportAtdComponent',
            UUID: "e9029d7f-af32-4b0e-a513-8d9ced6f8186",
            Editor: 'import-atd',
            Key:   "2",
            Title: 'Import',
            Type: "menu",
            Action: "navigate"
        },
        {
            remoteName: 'import_export_atd',
            useModule: true,
            exposedModule: './ExportAtdModule',
            componentName: 'ExportAtdComponent',
            UUID: "e9029d7f-af32-4b0e-a513-8d9ced6f8186",
            Editor: 'export-atd',
            Key:   "3",
            Title: 'Export',
            Type: "menu",
            Action: "navigate"
        },
        {
            Title: "Delete",
            UUID: "",
            Editor: "",
            Type: "menu",
            Key: "4",
            Action: "delete"
        }


    
];
