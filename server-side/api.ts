import MyService from './my.service'
import { Client, Request } from '@pepperi-addons/debug-server'
import { ATDMetaData, InstalledAddon, Relation} from '@pepperi-addons/papi-sdk';
import { RemoteModuleOptions } from '../model';

export async function relations(client: Client, request: Request): Promise<any> {
    const service = new MyService(client);
    const addonsFields: Relation[] = await service.getRelations(request.body['RelationName']);
    let ATD: ATDMetaData | null = null;
    let multiAccount;
    if (request.body['Type'] && request.body['TypeID']){
        ATD = await service.getATD(request.body['Type'], request.body['TypeID']);
    }
    if (request.body['Flag']){
        multiAccount = await service.checkFlag(request.body['Flag']);
    }
    const addonsUuids = [...new Set(addonsFields.filter( row => row.AddonUUID).map(obj => obj.AddonUUID))];
    const addonsPromises: Promise<any>[] = [];
    addonsUuids.forEach( (uuid: any) => addonsPromises.push(service.getInstalledAddon(uuid))); 
    const addons: InstalledAddon[] = await Promise.all(addonsPromises).then(res => res);
    const menuEntries: RemoteModuleOptions[] = [];
    addonsFields.forEach( (field: Relation)=> {
        const entryAddon: InstalledAddon & any = addons.find( (addon: InstalledAddon) => addon?.Addon?.UUID === field?.AddonUUID);
        const menuEntry = createRelationEntry(field, entryAddon, ATD);
        menuEntries.push(menuEntry);
    });
    return { relations: menuEntries, ATD, multiAccount};
};


function createRelationEntry(field: Relation, entryAddon, ATD: ATDMetaData | null){
    const remoteEntryByType = (type, remoteName = 'remoteEntry') => {
        switch (type){
            case "NgComponent":
                if (field?.AddonRelativeURL){
                    return entryAddon?.PublicBaseURL +  field?.AddonRelativeURL + '.js';
                }
                else {
                    return entryAddon?.PublicBaseURL +  remoteName + '.js';
                }
                break;
            default:
                return field?.AddonRelativeURL;
                break;
        }
    } 
    const remoteName = field?.AddonRelativeURL ? field.AddonRelativeURL : field?.Type === "NgComponent" ? toSnakeCase(field.ModuleName.toString().replace('Module','')) : '';
    const menuEntry: RemoteModuleOptions & any = {  
        type: field.Type,
        subType: field.SubType, 
        remoteName: remoteName,
        remoteEntry: remoteEntryByType(field?.Type, remoteName),
        componentName: field?.Type === "NgComponent" ? field?.ComponentName : "",
        exposedModule:  field?.Type === "NgComponent" ? "./" + field?.ModuleName : "",
        confirmation: field?.Confirmation,
        title: field?.Description?.split(' ').map(w => w[0].toUpperCase() + w.substr(1).toLowerCase()).join(' '),
        noModule: field?.Type === "NgComponent" && !(field?.ModuleName) ? true : false,
        update: false,
        addon: entryAddon,
        addonId: entryAddon?.Addon?.UUID,
        addonData: { },
        uuid: field?.AddonUUID,
        key: `${field.Name}_${field.AddonUUID}_${field.RelationName}`,
        // Additional parameters for Type List relation
        multiSelection: field?.AllowsMultipleSelection,
        visibleEndpoint: field?.VisibilityRelativeURL,
        runsInBackground: field?.RunsInBackground
    }
    return menuEntry;
}

export async function filter_entries(client: Client, request: Request) {
    const service = new MyService(client);
    const addons: any[] = request.body['addons'];
    const promises: Promise<boolean>[] = [];
    addons.forEach(addon => promises.push(service.isItemVisible(addon).then(res => res).catch(e => false)));
    const visible = await Promise.all(promises);
    return addons.filter((addon,i) => visible[i]);
}

export async function sync_func(client: Client, request: Request) {
    return true;
}

export async function delete_object(client: Client, request: Request) {
    const service = new MyService(client);
    let ans;
    try {
        ans = await service.deleteObject(request.body.ObjectType, request.body.ObjectId);
        return {success: true, status:ans};
    }catch(e){
        const error: any = e;
        ans = JSON.parse(error?.message?.split(':').splice(3).join(':'));
        return {success: false, ...ans};
    }
}

const toSnakeCase = str => 
    str &&
    str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('_');


    // async function getWebAPIBaseURL(client) {
    //     // get WebAPI base url, this implementation is temporary, DI-17467
    //     const service = new MyService(client);
    //     const environment = jwtDecode(client.OAuthAccessToken)["pepperi.datacenter"];
    
    //     const webappAddon = await service.papiClient.addons.installedAddons.addonUUID("00000000-0000-0000-1234-000000000b2b").get();
    //     const webappVersion = webappAddon.Version?.split(".");
    //     const versionMain = webappVersion? webappVersion[0] :"";
    //     const versionMinor = webappVersion? webappVersion[1] :"";
    //     const versionPatch = webappVersion? webappVersion[2] :"";
    //     let baseURL='';
    //     if (environment=="sandbox"){
    //         baseURL = `https://webapi.sandbox.pepperi.com/V${versionMain}_${versionMinor}/WebApp_${versionPatch}`;
    //     }
    //     else{
    //         baseURL = `https://webapi.pepperi.com/V${versionMain}_${versionMinor}/WebApp_${versionPatch}`;
    //     }
    //     return baseURL;
    // }
    
    // async function getAccessToken(client, webAPIBaseURL) {
    //     const URL = webAPIBaseURL+ "/Service1.svc/v1/CreateSession";
    //     const Body = {"accessToken": client.OAuthAccessToken, "culture": "en-US"};
    //     let accessToken = (await (await fetch(URL, {
    //         method: "POST",
    //         body: JSON.stringify(Body),
    //         headers:{"Content-Type":"application/json"}
    //     })).json())["AccessToken"];
    
    //     while (accessToken==null){
    //         accessToken = (await (await fetch(URL, {
    //             method: "POST",
    //             body: JSON.stringify(Body),
    //             headers:{"Content-Type":"application/json"}
    //         })).json())["AccessToken"];
    //     }
    
    //     return accessToken;
    // }

