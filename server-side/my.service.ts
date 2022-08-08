import { RemoteModuleOptions } from '../model';
import { PapiClient, InstalledAddon, Relation  } from '@pepperi-addons/papi-sdk';
import { Client } from '@pepperi-addons/debug-server';
import fetch from "node-fetch";
class MyService {

    papiClient: PapiClient
    bundleFileName;

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ActionUUID
        });

        this.bundleFileName = `settings_editor`;
    }

    addTableScheme(scheme): Promise<any> {
        return this.papiClient.post('/addons/data/schemes', scheme);
    }

    addDataToTable(rowData, tableName, addonUUID): Promise<any> {
        return this.papiClient.post(`/addons/data/${addonUUID}/${tableName}`, rowData);
    }

    getTableData(tableName, uuid, options = {}): Promise<any> {
        return this.papiClient.addons.data.uuid(uuid).table(tableName).find(options);
    }

    getInstalledAddon(uuid: string): Promise<InstalledAddon> {
        return this.papiClient.addons.installedAddons.addonUUID(uuid).get();
    }

    upsertDataView(dataView: any) {
        return this.papiClient.metaData.dataViews.upsert(dataView);
    }

    getDataView(dataViewName: string): Promise<any[]> {
        return this.papiClient.metaData.dataViews.find({ where: 'Context.Name='+dataViewName });
    }

    getRelations(relationName: string): Promise<any> {
        return this.papiClient.get(`/addons/data/relations?where=RelationName=${relationName}`);
    }

    createRelation(relation): Promise<any> {
        return this.papiClient.post('/addons/data/relations', relation);
    }

    async getDataViewByProfile(dataViewName: string, webAPIBaseURL: string, accessToken: string): Promise<any[]> {
        const url = `${webAPIBaseURL}/Service1.svc/v1/UIControl/${dataViewName}`;
        return await (await fetch(url, {
            method: "GET",
            headers: {
                "PepperiSessionToken": accessToken,
                "Content-Type":"application/json"
            }
        })).json();
        
        // return this.papiClient.metaData.dataViews.find({ where: 'Context.Name='+dataViewName });
    }
    isItemVisible(addon: RemoteModuleOptions): Promise<any> {
        if (addon?.uuid && addon?.visibleEndpoint){
            return this.papiClient.addons.api.uuid(addon?.uuid).get(addon.visibleEndpoint);
        }
        else {
            return  Promise.resolve(true);
        }
    }

    deleteObject(objectType: string, objectId: string){
        const body = {
            InternalID: objectId,
            Hidden: true
        }
        // return this.papiClient.metaData.type(objectType).types.fields.delete()
        return this.papiClient.post(`/meta_data/${objectType}/types`, body);
    }

    private upsertRelation(relation): Promise<any> {
        return this.papiClient.post('/addons/data/relations', relation);
    }

    upsertSettingsRelation() {
        let addonBlockRelation: Relation = {
            RelationName: "SettingsBlock",
            GroupName: 'Sales Activites',
            SlugName: 'transactions',
            Name: 'Transactions',
            Description: 'Transaction Types',
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: this.bundleFileName,
            ComponentName: `TTComponent`,
            ModuleName: `TTModule`,
            ElementsModule: 'WebComponents',
            ElementName: `transactions-element-${this.client.AddonUUID}`,
        }; 
        
        this.upsertRelation(addonBlockRelation);

        addonBlockRelation = {
            RelationName: "SettingsBlock",
            GroupName: 'Sales Activites',
            SlugName: 'activities',
            Name: 'Activities',
            Description: 'Activity Types',
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: this.bundleFileName,
            ComponentName: `TTComponent`,
            ModuleName: `TTModule`,
            ElementsModule: 'WebComponents',
            ElementName: `activities-element-${this.client.AddonUUID}`,
        }; 
        
        this.upsertRelation(addonBlockRelation);

        addonBlockRelation = {
            RelationName: "SettingsBlock",
            GroupName: 'Accounts',
            SlugName: 'accounts',
            Name: 'Accounts',
            Description: 'Views & Forms',
            Type: "NgComponent",
            SubType: "NG14",
            AddonUUID: this.client.AddonUUID,
            AddonRelativeURL: this.bundleFileName,
            ComponentName: `TTComponent`,
            ModuleName: `TTModule`,
            ElementsModule: 'WebComponents',
            ElementName: `accounts-element-${this.client.AddonUUID}`,
        }; 
        
        this.upsertRelation(addonBlockRelation);
    }


}

export default MyService;
