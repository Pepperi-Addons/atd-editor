import { Injectable } from '@angular/core';
import { Relation } from '@pepperi-addons/papi-sdk';
@Injectable({
  providedIn: 'root'
})
export class SortService {

  constructor() {

   }


   divideEntries(existingEntries, jsonEntriesArr, property = 'Key'){
        const topArray = existingEntries.filter(entry => jsonEntriesArr.some((relation: Relation) => (`${relation.Name}_${relation.AddonUUID}_${relation.RelationName}`=== entry.key)));
        const bottomArray = existingEntries.filter(entry => !jsonEntriesArr.some((relation: Relation) => (`${relation.Name}_${relation.AddonUUID}_${relation.RelationName}`=== entry.key)));
        const sortedArray = topArray.map(entry =>{ return  {...entry, index: jsonEntriesArr.findIndex(e => e.Description === entry.title)}});
        sortedArray.sort((x,y) => x.index - y.index);
        return [...sortedArray,...bottomArray];
   }
}
