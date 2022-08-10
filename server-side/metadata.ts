import { Relation } from "@pepperi-addons/papi-sdk";

export type PepDataObjectType = | 'transactions' | 'activities' | 'accounts';
export type PepDataObjectSubType = | 'types' | 'meta_data' | 'data';

import config from '../addon.config.json';

export const typeListMenuRelations: Relation[]  =[

    {
        RelationName: "",
        Name:"EditTransactionType",
        Description:"Edit",
        Type: "Navigation",
        SubType: "Settings",
        AddonUUID: config.AddonUUID,
        AddonRelativeURL: "TYPE/SUB_TYPE/TYPE_ID/general",
        VisibilityRelativeURL: "api/sync_func",	
        AllowsMultipleSelection: false,
        Index: 0
    },
    {
        RelationName: "",
        Name:"DeleteTransactionType",
        Description:"Delete",
        Type: "AddonAPI",
        AddonUUID: config.AddonUUID,
        AddonRelativeURL: "api/delete_object",
        VisibilityRelativeURL: "api/sync_func",	
        AllowsMultipleSelection: false,
        Confirmation: true,
        Index: 1
    }      
  
];

export function tabsData(tabsKeys: string[]):Relation[] {
    const tabs: Relation[] = tabsKeys.map((key, index) =>{
        return  {
            Name: key,
            AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
            RelationName: "",
            Type: "NgComponent",
            Description: `Views/Agents/${key}Types.aspx`,
            SubType: "NG11",
            AddonRelativeURL: 'settings_iframe',
            ComponentName: 'SettingsIframeComponent',
            ModuleName: 'SettingsIframeModule'
        }});
    return tabs;
  }
  
  


export const typeListMenuRelationNames = [
    "TransactionTypeListMenu",
    "ActivityTypeListMenu",
    "AccountTypeListMenu"
];

// export const typeListTabsRelationNames = [
//     "TransactionTypeListTabs",
//     "ActivityTypeListTabs",
//     "AccountTypeListTabs"
// ];