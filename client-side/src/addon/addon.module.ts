import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';

import { AddonRoutingModule } from './addon-routing.module';
import { AddonComponent } from './addon.component';
import { TypesListComponent } from './components/types-list/types-list.component';
import { PepUIModule } from './modules/pepperi.module';
import { MaterialModule } from './modules/material.module';
import { SettingsTabsComponent } from './components/settings-tabs/settings-tabs.component';
import { AddTypeDialogComponent } from './components/types-list/add-type-dialog/add-type-dialog.component';
import { PepperiTableComponent } from './components/types-list/pepperi-table/pepperi-table.component';
import { EmptyRouteComponent } from './components/empty-route/empty-route.component';
import { PepRemoteLoaderModule } from '@pepperi-addons/ngx-lib/remote-loader';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';

const addonUUID = '04de9428-8658-4bf7-8171-b59f6327bbf1';
@NgModule({
    declarations: [
        AddonComponent,
        TypesListComponent,
        SettingsTabsComponent,
        AddTypeDialogComponent,
        PepperiTableComponent,
        EmptyRouteComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        AddonRoutingModule,
        PepUIModule,
        MaterialModule,
        PepRemoteLoaderModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(addonUUID, addonService, ['ngx-lib']),
                deps: [PepAddonService]
            }, isolate: false
        }),
    ],
    providers: [
        TranslateStore
    ],
    bootstrap: [
        // AddonComponent
    ]
})
export class AddonModule implements DoBootstrap {
    constructor(
        private injector: Injector,
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }

    ngDoBootstrap() {
        customElements.define(`transactions-element-${addonUUID}`, createCustomElement(TypesListComponent, {injector: this.injector}));
        customElements.define(`activities-element-${addonUUID}`, createCustomElement(TypesListComponent, {injector: this.injector}));
        customElements.define(`accounts-element-${addonUUID}`, createCustomElement(TypesListComponent, {injector: this.injector}));
    }
}




