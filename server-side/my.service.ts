import { PapiClient, InstalledAddon } from '@pepperi-addons/papi-sdk'
import { Client } from '@pepperi-addons/debug-server';

class MyService {

    papiClient: PapiClient

    constructor(private client: Client) {
        this.papiClient = new PapiClient({
            baseURL: client.BaseURL,
            token: client.OAuthAccessToken
        });
    }

    addTableScheme(scheme, addonUUID, secretKey): Promise<any> {
        return this.papiClient.post('/addons/data/schemes', scheme,
        {
            "X-Pepperi-OwnerID": addonUUID,
            "X-Pepperi-SecretKey": secretKey
        }
        );
    }

    addDataToTable(rowData, tableName, addonUUID, secretKey): Promise<any> {
        return this.papiClient.post(`/addons/data/${addonUUID}/${tableName}`, rowData,
        {
            "X-Pepperi-OwnerID": addonUUID,
            "X-Pepperi-SecretKey": secretKey
        });
    }



    // getTransactionTypes(): Promise<InstalledAddon[]> {
    //     return this.papiClient.types.find({});
    // }

    // getListMenu(): Promise<InstalledAddon[]> {
    //     return this.papiClient.addons.data.addonUUID.find({});
    // }

}

export default MyService;
