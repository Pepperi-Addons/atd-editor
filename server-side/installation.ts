import { tabsSchema, tabsData } from './metadata';
import { Client, Request } from '@pepperi-addons/debug-server';
import MyService from './my.service';
import { AddonUUID } from '../addon.config.json'
export async function install(client: Client, request: Request){
    const service = new MyService(client);
    const schema = await service.addTableScheme(tabsSchema, AddonUUID, client.EncryptedAddonUUID);
    const tabPromises: Promise<any>[] = [];
    tabsData.forEach(tab => tabPromises.push(service.addDataToTable(tab, schema.Name, AddonUUID, client.EncryptedAddonUUID)));
    const result = await Promise.all(tabPromises).then(res => {
        return res;
    });
    return {success:true}
}

export async function uninstall(client: Client, request: Request){
    return {success:true}
}

export async function upgrade(client: Client, request: Request){
    return {success:true}
}

export async function downgrade(client: Client, request: Request){
    return {success:true}
}
