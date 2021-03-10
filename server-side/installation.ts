import { menuMetaData } from './metadata';
import { Client, Request } from '@pepperi-addons/debug-server';
import MyService from './my.service';
import { MenuDataView, MenuDataViewField} from '@pepperi-addons/papi-sdk';
// import { AddonUUID } from '../addon.config.json'
import { ParsedUrlQuery, stringify } from 'querystring';

export async function install(client: Client, request: Request){
    const menu = await upsertDataView(client, "AtdEditor_Transactions_Menu", menuMetaData);
    return {success:true, menu};

}

export async function uninstall(client: Client, request: Request){
    return {success:true}
}

export async function upgrade(client: Client, request: Request){
    const menu = await upsertDataView(client, "AtdEditor_Transactions_Menu", menuMetaData);
    return {success:true, menu};
}

export async function downgrade(client: Client, request: Request){
    return {success:true}
}

async function upsertDataView(client: Client, contextName: string, addons: object[]){
    const service = new MyService(client);
    const existingDataViews = await service.getDataView(contextName);
    if (existingDataViews?.length > 0){
        existingDataViews.forEach( dataView => prepareDataview(addons, dataView));    
        const promises: Promise<any>[] = [];
        existingDataViews.forEach(dataView => promises.push(service.upsertDataView(dataView)));
        const result = await Promise.all(promises);
        return result;
    } else {
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
        prepareDataview(addons, dataView);
        const result = await service.upsertDataView(dataView);
        return result;
    }
}

function prepareDataview(addons, dataView){
    addons.forEach( addon => {
        const menuItem: MenuDataViewField = {
            FieldID: `ADO?${stringify(addon)}`,
            Title: addon['Title']
        }
        if (dataView.Fields?.findIndex( field => field.FieldID !== menuItem.FieldID) > 1){
            dataView.Fields?.push(menuItem);
        }
    });
    return dataView;
}