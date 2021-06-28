import { typeListMenuRelations, typeListMenuRelationNames, typeListTabsRelationNames, Relation } from './metadata';
import { Client, Request } from '@pepperi-addons/debug-server';
import MyService from './my.service';
import { stringify } from 'querystring';

export async function install(client: Client, request: Request){
    try {
        const promises: Promise<any>[] = [];
        typeListMenuRelationNames.forEach( relationName =>  promises.push(addRelations(client, typeListMenuRelations, relationName)));
        await Promise.all(promises);
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
        typeListMenuRelationNames.forEach( relationName =>  addRelations(client, typeListMenuRelations, relationName));
        return {success:true};

    } catch(e){
        return {success:false};

    }
}

export async function downgrade(client: Client, request: Request){
    return {success:true}
}

async function addRelations(client: Client, relations: Relation[], relationName){
    const service = new MyService(client);
    const existingRelations: Relation[] = await service.getRelations(relationName);
    const promises: Promise<any>[] = [];
    // if (existingRelations?.length > 0){
    //     const updatedRelations: Relation[] = [];
    //     existingRelations.forEach( existingRelation =>{
    //         const updatedRelation = relations.filter((relation, i) => relation.Key === existingRelation.Key)[0];
    //         updatedRelations.push(updatedRelation ?? existingRelation);
    //     });    
    //     const promises: Promise<any>[] = [];
    //     updatedRelations.forEach(relation => promises.push(service.createRelation(relation)));
    //     const result = await Promise.all(promises);
    //     return result;
    // } else {
        relations.forEach(relation =>{ 
            relation.RelationName = relationName;
            const key = `${relation.Name}_${relation.AddonUUID}_${relation.RelationName}`;
            relation.Key = key;
            promises.push(service.createRelation(relation));
        });
        const result = await Promise.all(promises);
        return result;
    // }
}

    




