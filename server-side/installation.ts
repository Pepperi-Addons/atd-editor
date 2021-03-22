import { MenuAddonField, menuDataView } from './metadata';
import { Client, Request } from '@pepperi-addons/debug-server';
import MyService from './my.service';
import { MenuDataView, MenuDataViewField} from '@pepperi-addons/papi-sdk';
import { stringify } from 'querystring';

export async function install(client: Client, request: Request){
    const activitiesMenu = await addDataView(client, "SettingsEditorTransactionsMenu", menuDataView);
    const transactionsMenu = await addDataView(client, "SettingsEditorActivitiesMenu", menuDataView);
    const accountsMenu = await addDataView(client, "SettingsEditorAccountsMenu", menuDataView);
    return {success:true, activitiesMenu, transactionsMenu, accountsMenu};
}

export async function uninstall(client: Client, request: Request){
    return {success:true}
}

export async function upgrade(client: Client, request: Request){
    const activitiesMenu = await addDataView(client, "SettingsEditorTransactionsMenu", menuDataView);
    const transactionsMenu = await addDataView(client, "SettingsEditorActivitiesMenu", menuDataView);
    const accountsMenu = await addDataView(client, "SettingsEditorAccountsMenu", menuDataView);
    return {success:true, activitiesMenu, transactionsMenu, accountsMenu};
}

export async function downgrade(client: Client, request: Request){
    return {success:true}
}

async function addDataView(client: Client, contextName: string, addons: MenuAddonField[]){
    const service = new MyService(client);
    const existingDataViews: DataView[] = await service.getDataView(contextName);
    if (existingDataViews?.length > 0){
        const preparedDataViews: MenuDataView[] = [];
        existingDataViews.forEach( dataView => preparedDataViews.push(updateDataViewFields(addons, dataView)));    
        const promises: Promise<any>[] = [];
        preparedDataViews.forEach(dataView => promises.push(service.upsertDataView(dataView)));
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
        const dataViewAfter = updateDataViewFields(addons, dataView);
        const result = await service.upsertDataView(dataViewAfter);
        return result;
    }
}


    function updateDataViewFields(fields: (MenuDataViewField & any)[], dataView: MenuDataView & any): MenuDataView{
        fields.forEach( (menuField: MenuDataViewField & any) => {
            const fieldId = `ADO?${stringify(menuField.FieldID)}`
            const existingFieldIndex = dataView?.Fields?.findIndex( field => field.Title === menuField.Title);
            if (existingFieldIndex > -1){
                if (dataView.Fields[existingFieldIndex].FieldID !== fieldId) {
                    dataView.Fields[existingFieldIndex] = {Title: menuField.Title, FieldID: fieldId};
                }
            }
            else {
                dataView?.Fields?.push({Title: menuField.Title, FieldID: fieldId});
            }
        });
        // uncomment to empty array of fields
        // dataView.Fields = [];
        return dataView;
    }

