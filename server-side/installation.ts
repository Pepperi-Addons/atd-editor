import { getTabsData, menuMetaData } from './metadata';
import { Client, Request } from '@pepperi-addons/debug-server';
import MyService from './my.service';
import { MenuDataView, MenuDataViewField} from '@pepperi-addons/papi-sdk';
// import { AddonUUID } from '../addon.config.json'
import { ParsedUrlQuery, stringify } from 'querystring';

export async function install(client: Client, request: Request){
    const menu = await addDataView(client, "AtdEditor_Transactions_Menu", menuMetaData);
    const tabs = await addDataView(client, "AtdEditor_Tabs", getTabsData());
    return menu && tabs ?  {success:true, menu, tabs} : {success:false, result: null};
}

export async function uninstall(client: Client, request: Request){
    return {success:true}
}

export async function upgrade(client: Client, request: Request){
    const menu = await addDataView(client, "AtdEditor_Transactions_Menu", menuMetaData);
    const tabs = await addDataView(client, "AtdEditor_Tabs", getTabsData());
    return menu && tabs ? {success:true, menu, tabs} : {success:false, result: null};
}

export async function downgrade(client: Client, request: Request){
    return {success:true}
}

async function addDataView(client: Client, contextName: string, data: object[]){
    const service = new MyService(client);
    const dataView: MenuDataView = {
        Type: "Menu",
        Context: {
            Profile: {
                Name: "Rep"
            },
            Name: contextName,
            ScreenSize: "Landscape"     
        },
        Fields: []
    };

    data.forEach( addon => {
        const menuItem: MenuDataViewField = {
            FieldID: `ADO?${stringify(addon)}`,
            Title: addon['Title']
        }
        dataView.Fields?.push(menuItem);
    });
    const result = await service.addDataView(dataView);
    return result;




    

}
