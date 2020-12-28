import { Injectable, NgModuleFactory } from '@angular/core';
import * as angularCommon from '@angular/common';
import * as angularCore from '@angular/core';

declare const System;
@Injectable({
  providedIn: 'root'
})
export class SubAddonLoaderService {

  constructor() { }


  load<T>(path): Promise<NgModuleFactory<T>> {
    return System.import(path).then(module => module.LazyCModule);
  }

  setModules(){
    // const config = { map :{
    //     // angular bundles
    //     '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
    //     '@angular/common': 'npm:@angular/common/bundles/common.umd.js'
    // }};

    // System.config(config);
    // System.register('@angular/core');
    // System.register('@angular/common');
  }
}


