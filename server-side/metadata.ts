export interface Relation {
    RelationName: string;
    AddonUUID: string;
    Name: string;
    Description: string;
    Type: "AddonAPI" | "NgComponent" | "Navigate";
    [key:string]:string | boolean | number;
}

export type PepDataObjectType = | 'transactions' | 'activities' | 'accounts';
export type PepDataObjectSubType = | 'types' | 'meta_data' | 'data';

export const typeListMenuRelations: Relation[]  =[

        {
            RelationName: "",
            Name:"EditTransactionType",
            Description:"Edit",
            Type: "Navigate",
            SubType: "Settings",
            AddonUUID: "04de9428-8658-4bf7-8171-b59f6327bbf1",
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
            AddonUUID: "04de9428-8658-4bf7-8171-b59f6327bbf1",
            AddonRelativeURL: "api/delete_object",
            VisibilityRelativeURL: "api/sync_func",	
            AllowsMultipleSelection: false,
            Confirmation: true,
            Index: 1
        }      
      
];

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