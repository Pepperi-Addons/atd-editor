export type RemoteModuleOptions = {
    addonData?: object;
    componentName: string;
    exposedModule?: string;
    remoteEntry?: string;
    remoteName: string;
    update?: boolean;
    noModule?: boolean;
    title: string;
    visibleEndpoint?: string;
    multiSelection?: boolean | string ;
    confirmation?: boolean;
    type: string | string[];
    subType: string | string[];
    uuid: string;
    UUID?: string;
    addon?: object;
  }

  export interface ListSearch {
      type?: string;
      subType?: string;
      sortBy?: string;
      isAsc?: boolean;
      searchString?: string;
  }

  export enum ObjectType   {
    transactions = 2,        // Order
    contacts = 33,           // ContactPerson
    accounts = 35,           // DistributorStoreOrganizationsRelation
    activities = 99,         // GeneralActivity          
    transaction_lines = 10  // OrderPortfolioItem
}

export interface Relation {
  RelationName: string;
  AddonUUID: string;
  Name: string;
  Description: string;
  Type: "AddonAPI" | "NgComponent" | "Navigate";
  [key:string]:string | boolean | number;
}


export const relationTypesEnum = {
  "accounts": "Account",
  "transactions": "Transaction",
  "activities": "Activity"
}

export const productTypeListMenu = {
  TransactionTypeListMenu: [ 
    {
      Name: "EditTransactionType",
      AddonUUID: "04de9428-8658-4bf7-8171-b59f6327bbf1",
      RelationName: "TransactionTypeListMenu",
      Description: "Edit"
    }, 
    {
      Name: "DeleteTransactionType",
      AddonUUID: "04de9428-8658-4bf7-8171-b59f6327bbf1",
      RelationName: "TransactionTypeListMenu",
      Description: "Delete"
    }
  ],
  ActivityTypeListMenu: [ 
    {
      Name: "EditTransactionType",
      AddonUUID: "04de9428-8658-4bf7-8171-b59f6327bbf1",
      RelationName: "ActivityTypeListMenu",
      Description: "Edit"
    }, 
    {
      Name: "DeleteTransactionType",
      AddonUUID: "04de9428-8658-4bf7-8171-b59f6327bbf1",
      RelationName: "ActivityTypeListMenu",
      Description: "Delete"
    }
  ],
  AccountTypeListMenu: [ 
    {
      Name: "EditTransactionType",
      AddonUUID: "04de9428-8658-4bf7-8171-b59f6327bbf1",
      RelationName: "AccountTypeListMenu",
      Description: "Edit"
    }, 
    {
      Name: "DeleteTransactionType",
      AddonUUID: "04de9428-8658-4bf7-8171-b59f6327bbf1",
      RelationName: "AccountTypeListMenu",
      Description: "Delete"
    }
  ]
};

export const productObjectTypeTabs = {
  TransactionTypeListTabs: [
    {
      Name: "general",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "TransactionTypeListTabs",
      Description: "General"
    },
    {
      Name: "views",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "TransactionTypeListTabs",
      Description: "Views"
    },
    {
      Name: "actions",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "TransactionTypeListTabs",
      Description: "Actions"
    },
    {
      Name: "workflows",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "TransactionTypeListTabs",
      Description: "Workflows"
    },
    {
      Name: "programs",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "TransactionTypeListTabs",
      Description: "Programs"
    }, 
    {
      Name: "accounts",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "TransactionTypeListTabs",
      Description: "Accounts"
    },
    {
      Name: "epayment",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "TransactionTypeListTabs",
      Description: "Epayment"
    },
    { 
      Name: "settings",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "TransactionTypeListTabs",
      Description: "Settings"
    }, 
    {
      Name: "fields",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "TransactionTypeListTabs",
      Description: "Fields"
    }
  ],
  ActivityTypeListTabs: [
    {
      Name: "general",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "ActivityTypeListTabs",
      Description: "General"
    },
    {
      Name: "forms",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "ActivityTypeListTabs",
      Description: "Forms"
    },
    {
      Name: "accounts",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "ActivityTypeListTabs",
      Description: "Accounts"
    },
    {
      Name: "workflows",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "ActivityTypeListTabs",
      Description: "Workflows"
    },
    {
      Name: "programs",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "ActivityTypeListTabs",
      Description: "Programs"
    }, 
    {
      Name: "fields",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "ActivityTypeListTabs",
      Description: "Fields"
    },
  ],
  AccountTypeListTabs:[
    {
      Name: "general",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "AccountTypeListTabs",
      Description: "General"
    },
    {
      Name: "forms",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "AccountTypeListTabs",
      Description: "Forms"
    },
    {
      Name: "workflows",
      AddonUUID: "354c5123-a7d0-4f52-8fce-3cf1ebc95314",
      RelationName: "AccountTypeListTabs",
      Description: "Workflows"
    }
  ]
};