export type AddonOptions = {
  remoteEntry?: string;
  remoteName: string;
  exposedModule: string;
  useModule?: boolean;
  update?: boolean;
  componentName?: string;
  addonData?: object;
}
    
export type AddonKey = {​​​​​​  
    AddonUUID?:string;
    Editor?:string;
    VisibleFunction?:string;
    VisibleSelectionMode?:string;
    OpenType:"full"|"popup"|"none";
}

export const menuMetaData: AddonKey[] =[

        {
            AddonUUID: "04de9428-8658-4bf7-8171-b59f6327bbf1",
            Editor: "transaction_types/ATD_ID/general",
            VisibleFunction: "api/show_editor",	
            VisibleSelectionMode: "single",
            OpenType: "full",
        },
        {
            VisibleFunction: "api/show_editor",	
            VisibleSelectionMode: "single",
            OpenType: "none",
        }      
      
];
