import { PapiClient, InstalledAddon, DataView } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';

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

    upsertDataView(dataView: DataView): Promise<DataView> {
        return this.papiClient.metaData.dataViews.upsert(dataView);
    }

    getDataView(dataViewName: string): Promise<DataView[]> {
        return this.papiClient.metaData.dataViews.find({ where: 'Context.Name='+dataViewName });
    }


}

export default MyService;
