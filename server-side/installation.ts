import { Client, Request } from '@pepperi-addons/debug-server';
import MyService from './my.service';

export async function install(client: Client, request: Request){
    try {
        const service = new MyService(client);
        await service.upsertRelations();
        return {success:true};

    } catch(e){
        return {success:false};
    }
}

export async function uninstall(client: Client, request: Request){
    return {success:true}
}

export async function upgrade(client: Client, request: Request){
    try {
        const service = new MyService(client);
        await service.upsertRelations();
        return {success:true};

    } catch(e){
        return {success:false};
    }
}

export async function downgrade(client: Client, request: Request){
    return {success:true}
}
