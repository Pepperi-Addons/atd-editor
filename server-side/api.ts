

import MyService from './my.service'
import { Client, Request } from '@pepperi-addons/debug-server'
import { MenuDataViewField, AddonField, InstalledAddon} from '@pepperi-addons/papi-sdk';
import url from 'url';
import { RemoteModuleOptions } from '../model';
import jwtDecode from "jwt-decode";
import fetch from "node-fetch";

export async function ui_control(client: Client, request: Request): Promise<RemoteModuleOptions[]> {
    const service = new MyService(client);
    // const webAPIBaseURL = await getWebAPIBaseURL(client); 
    // const accessToken = await getAccessToken(client, webAPIBaseURL);
    // const dataView = await service.getDataViewByProfile(request.body['DataViewName'], webAPIBaseURL, accessToken);
    const dataView = await service.getDataView(request.body['DataViewName']);
    const addonsFields: AddonField[] = [];
    dataView[0]?.Fields?.forEach( (field: MenuDataViewField) => {
        const url_parts = url.parse(field.FieldID, true);
        const query: object = url_parts.query;
        const menuField = query as AddonField;
        addonsFields.push(menuField);
    }); 

    const addonsUuids = [...new Set(addonsFields.filter( row => row.AddonUUID).map(obj => obj.AddonUUID))];
    const addonsPromises: Promise<any>[] = [];
    addonsUuids.forEach( (uuid: any) => addonsPromises.push(service.getInstalledAddon(uuid))); 
    const addons: InstalledAddon[] = await Promise.all(addonsPromises).then(res => res);
    const menuEntries: RemoteModuleOptions[] = [];
    addonsFields.forEach( (field: AddonField, index: number)=> {
        const entryAddon: InstalledAddon & any = addons.find( (addon: InstalledAddon) => addon?.Addon?.UUID === field?.AddonUUID);
        const remoteEntryByType = (type, remoteName = 'remoteEntry') => {
            switch (type){
                case "Component":
                    return entryAddon?.PublicBaseURL + remoteName + '.js';
                    break;
                default:
                    return field?.RelativeURL;
                    break;
            }
        } 
        const remoteName = field?.Type === "Component" ? toSnakeCase(field.ModuleName.replace('Module','')) : '';
        const menuEntry: RemoteModuleOptions & any = {  
            type: field.Type,
            subType: field.SubType, 
            remoteName: remoteName,
            remoteEntry: remoteEntryByType(field?.Type, remoteName),
            componentName: field?.Type === "Component" ? field?.ComponentName : "",
            exposedModule:  field?.Type === "Component" ? "./" + field?.ModuleName : "",
            confirmation: field?.Confirmation,
            multiSelection: field?.MultiSelection,
            visibleEndpoint: field?.VisibleEndpoint,
            
            title: dataView[0]?.Fields[index]?.Title,
            
            noModule: field?.Type === "Component" && !(field?.ModuleName) ? true : false,
            update: false,
            addonData: { top: 230},
            uuid: field?.AddonUUID,
            UUID: field?.AddonUUID,
            top: 230
        }
        menuEntries.push(menuEntry);
    });
    return menuEntries;
};

export async function filter_entries(client: Client, request: Request) {
    const service = new MyService(client);
    const addons: RemoteModuleOptions[] = request.body['addons'];
    const promises: Promise<boolean>[] = [];
    addons.filter(addon => addon.visibleEndpoint).forEach(addon => promises.push(service.isItemVisible(addon).then(res => res).catch(e => false)));
    // const visible = await Promise.all(promises);
    const visible = [true, true];
    return addons.filter((addon,i) => visible[i]);
}

export async function sync_func(client: Client, request: Request) {
    return true;
}

export async function delete_object(client: Client, request: Request) {
    const service = new MyService(client);
    return service.deleteObject(request.body.objectType, request.body.objectId);
}


async function getWebAPIBaseURL(client) {
    // get WebAPI base url, this implementation is temporary, DI-17467
    const service = new MyService(client);
    const environment = jwtDecode(client.OAuthAccessToken)["pepperi.datacenter"];

    const webappAddon = await service.papiClient.addons.installedAddons.addonUUID("00000000-0000-0000-1234-000000000b2b").get();
    const webappVersion = webappAddon.Version?.split(".");
    const versionMain = webappVersion? webappVersion[0] :"";
    const versionMinor = webappVersion? webappVersion[1] :"";
    const versionPatch = webappVersion? webappVersion[2] :"";
    let baseURL='';
    if (environment=="sandbox"){
        baseURL = `https://webapi.sandbox.pepperi.com/V${versionMain}_${versionMinor}/WebApp_${versionPatch}`;
    }
    else{
        baseURL = `https://webapi.pepperi.com/V${versionMain}_${versionMinor}/WebApp_${versionPatch}`;
    }
    return baseURL;
}

async function getAccessToken(client, webAPIBaseURL) {
    const URL = webAPIBaseURL+ "/Service1.svc/v1/CreateSession";
    const Body = {"accessToken": client.OAuthAccessToken, "culture": "en-US"};
    let accessToken = (await (await fetch(URL, {
        method: "POST",
        body: JSON.stringify(Body),
        headers:{"Content-Type":"application/json"}
    })).json())["AccessToken"];

    while (accessToken==null){
        accessToken = (await (await fetch(URL, {
            method: "POST",
            body: JSON.stringify(Body),
            headers:{"Content-Type":"application/json"}
        })).json())["AccessToken"];
    }

    return accessToken;
}

const toSnakeCase = str => 
    str &&
    str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('_');

