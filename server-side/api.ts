import { SubAddon } from './metadata';
import MyService from './my.service'
import { Client, Request } from '@pepperi-addons/debug-server'
import { MenuDataView, MenuDataViewField } from '@pepperi-addons/papi-sdk';
import url from 'url';
import { ParsedUrlQuery } from 'querystring';


export async function lookup(client: Client, request: Request) {
    const service = new MyService(client)
    // const table = await service.getTableData(request.body.TableName, client.AddonUUID, { where: `Type=${request.body['Type']}`});
    const dataView = await service.getDataView(request.body['DataViewName']);
    const table: (ParsedUrlQuery | SubAddon)[] = [];
    dataView[0].Fields?.forEach( field => table.push(url.parse(field.FieldID, true).query));   
    const promises:Promise<any>[] = [];
    const uuids = [...new Set(table.filter( row => row['UUID']).map(obj => obj['UUID'] ))];
    uuids.forEach( (uuid: any )=> promises.push(service.getInstalledAddon(uuid))); 
    const addons = await Promise.all(promises).then(res =>  res);
    table.forEach( row => {
        if (row?.remoteName){
            const addon = addons.find( addon => addon?.Addon?.UUID === row?.UUID);
            row.remoteEntry = `${addon?.PublicBaseURL + row?.remoteName}.js`;
        }
    });
    return table;
};


