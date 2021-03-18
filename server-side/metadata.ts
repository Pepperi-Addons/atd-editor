import { AddonField } from "@pepperi-addons/papi-sdk";
  

export type PepDataObjectType = | 'transactions' | 'activities' | 'accounts';
export type PepDataObjectSubType = | 'types' | 'meta_data' | 'data';
export type MenuAddonField = {
    Title: string;
    FieldID: AddonField;
}
export const menuDataView: MenuAddonField[]  =[

        {
            Title: "Edit",
            FieldID: {
                Type: "Navigation",
                SubType: "Settings",
                AddonUUID: "04de9428-8658-4bf7-8171-b59f6327bbf1",
                RelativeURL: "TYPE/SUB_TYPE/TYPE_ID/general",
                VisibleEndpoint: "api/sync_func",	
                MultiSelection: false
            }   
        },
        {
            Title: "Delete",
            FieldID: {
                Type: "BackgroundJob",
                SubType: "None",
                AddonUUID: "04de9428-8658-4bf7-8171-b59f6327bbf1",
                RelativeURL: "api/delete_object",
                VisibleEndpoint: "api/sync_func",	
                Confirmation: true
            }           
        }      
      
];
