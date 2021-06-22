import { RemoteModuleOptions } from '../model';
import { PapiClient, InstalledAddon, AddonField  } from '@pepperi-addons/papi-sdk';
import { Client } from '@pepperi-addons/debug-server';
import fetch from "node-fetch";
class MyService {

    papiClient: PapiClient

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken,
            addonUUID: client.AddonUUID,
            addonSecretKey: client.AddonSecretKey,
            actionUUID: client.ExecutionUUID
        });
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

    // getAddonRelations(dataViewName: string): Promise<any[]> {
    //     return this.papiClient.addons.data.relations.find({ where: 'Context.Name='+dataViewName });
    // }

    async getDataViewByProfile(dataViewName: string, webAPIBaseURL: string, accessToken: string): Promise<any[]> {
        const url = `${webAPIBaseURL}/Service1.svc/v1/UIControl/${dataViewName}`;
        return await (await fetch(url, {
            method: "GET",
            headers: {
                "PepperiSessionToken": accessToken,
                "Content-Type":"application/json"
            }
        })).json();
        
        return this.papiClient.metaData.dataViews.find({ where: 'Context.Name='+dataViewName });
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


}

export default MyService;
