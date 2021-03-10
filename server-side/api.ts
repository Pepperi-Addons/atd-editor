import MyService from './my.service'
import { Client, Request } from '@pepperi-addons/debug-server'
import { MenuDataView, MenuDataViewField, InstalledAddon, Addon } from '@pepperi-addons/papi-sdk';
import url from 'url';
import { ParsedUrlQuery } from 'querystring';
import { AddonKey, AddonOptions } from './metadata';


export async function lookup(client: Client, request: Request) {
    
    const service = new MyService(client);
    const promises: Promise<any>[] = [];
    const dataView = await service.getDataView(request.body['DataViewName']);
    const table: (AddonKey & AddonOptions | ParsedUrlQuery)[] = [];
    dataView[0].Fields?.forEach( field => table.push(url.parse(field.FieldID, true).query));   
    const uuids = [...new Set(table.filter( row => row['AddonUUID']).map(obj => obj['AddonUUID'] ))];
    uuids.forEach( (uuid: any) => promises.push(service.getInstalledAddon(uuid))); 
    const addons = await Promise.all(promises).then(res =>  res);
    table.forEach( (row: AddonKey & AddonOptions | ParsedUrlQuery)=> {
        if (row?.remoteName){
            const addon = addons.find( addon => addon?.Addon?.UUID === row?.AddonUUID);
            // row.remoteEntry = `${addon?.PublicBaseURL + row?.remoteName}.js`;
            // row.remoteEntry = `http://localhost:3010/${row?.remoteName}.js`;
           
           
        }
    });
    const newRow: AddonKey & AddonOptions = {
        OpenType: "none",
        PreMessage: { title: "Test", message: "Test Message"},
        Editor: `api/sync_func`,
        Sync: true,
        remoteName: "",
        exposedModule: "",
        AddonUUID: client?.AddonUUID,
        VisibleSelectionMode: "all"
    }
    table.push(newRow);
  
    return table;
};


export async function sync_func(client: Client, request: Request) {
    return true;
}