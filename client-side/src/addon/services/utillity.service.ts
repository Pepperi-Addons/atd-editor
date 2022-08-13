import { Injectable } from '@angular/core';
import { PepRemoteLoaderOptions } from '@pepperi-addons/ngx-lib/remote-loader';
import { Relation } from '@pepperi-addons/papi-sdk';
import { NavigationService } from './navigation.service';

const toSnakeCase = str => 
    str &&
    str.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map(x => x.toLowerCase())
    .join('_');

@Injectable({
    providedIn: 'root'
})
export class UtillityService {

    constructor(
        private navigationService: NavigationService,
    ) {

    }

    divideEntries(existingEntries, jsonEntriesArr, property = 'Key'){
        const topArray = existingEntries.filter(entry => jsonEntriesArr.some((relation: Relation) => (`${relation.Name}_${relation.AddonUUID}_${relation.RelationName}`=== entry.key)));
        const bottomArray = existingEntries.filter(entry => !jsonEntriesArr.some((relation: Relation) => (`${relation.Name}_${relation.AddonUUID}_${relation.RelationName}`=== entry.key)));
        const sortedArray = topArray.map(entry =>{ return  {...entry, index: jsonEntriesArr.findIndex(e => e.Description === entry.title)}});
        sortedArray.sort((x,y) => x.index - y.index);
        return [...sortedArray,...bottomArray];
    }

    private createRelationEntry(field: Relation, entryAddon) {
        const remoteEntryByType = (type, remoteName = 'remoteEntry') => {
            switch (type){
                case "NgComponent":
                    if (field?.AddonRelativeURL){
                        return entryAddon?.PublicBaseURL +  field?.AddonRelativeURL + '.js';
                    }
                    else {
                        return entryAddon?.PublicBaseURL +  remoteName + '.js';
                    }
                default:
                    return field?.AddonRelativeURL;
            }
        } 
        const remoteName = field?.AddonRelativeURL ? field.AddonRelativeURL : field?.Type === "NgComponent" ? toSnakeCase(field.ModuleName.toString().replace('Module','')) : '';
        const menuEntry: any = {  
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
            runsInBackground: field?.RunsInBackground,
            relation: field,
            elementsModule: field?.ElementsModule ?? '',
            elementName: field?.ElementName ?? '',
        }
        return menuEntry;
    }

    getRemoteEntry(tab: any) {
        // For devBlocks gets the remote entry from the query params.
        const devBlocks = this.navigationService.devBlocks;
        if (devBlocks.has(tab?.relation?.ModuleName)) {
            return devBlocks.get(tab?.relation?.ModuleName);
        } else if (devBlocks.has(tab?.relation?.ComponentName)) {
            return devBlocks.get(tab?.relation?.ComponentName);
        } else {
            return tab?.remoteEntry;
        }
    }
    
    getRelationsData(res: any): any {
        const relationsEntries = [];
        let relationEntry = null;

        res?.relationsEntries?.forEach((re)=> {
            relationEntry = this.createRelationEntry(re.relation, re.entryAddon);
            relationsEntries.push(relationEntry);
        });

        return {
            relationsEntries,
            atd: res.atd,
            multiAccount: res.multiAccount
        };
    }

    // getRemoteLoaderOptions(tab: any, type: 'script' | 'module' | 'manifest' = 'module'): PepRemoteLoaderOptions {
    //     const exposedModule = tab.elementsModule?.length > 0 ? `./${tab.elementsModule}` : tab.exposedModule;
    //     const remoteEntry = this.getRemoteEntry(tab);
    //     const res = {
    //         type: type,
    //         remoteEntry: remoteEntry,
    //         remoteName: tab.remoteName,
    //         exposedModule: exposedModule,
    //         addonId: tab.addonId,
    //     }
        
    //     // If it's web components
    //     if (tab.elementsModule?.length > 0) {
    //         res['elementName'] = tab.elementName
    //     } else { // For load the component from the module.
    //         res['componentName'] = tab.componentName; 
    //     }

    //     return res;
    // }
}
