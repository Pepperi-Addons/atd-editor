import { DoBootstrap, Injector, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { createCustomElement } from '@angular/elements';

import { AppRoutingModule } from './app.routes';
import { AppComponent } from './app.component';
import { TypesListComponent, TypesListModule } from './components/types-list';

import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService } from '@pepperi-addons/ngx-lib';
import { SettingsModule } from './components/settings';
import { HttpClientModule } from '@angular/common/http';

import { config } from './addon.config';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        SettingsModule,
        TypesListModule,
        AppRoutingModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: (addonService: PepAddonService) => 
                    PepAddonService.createMultiTranslateLoader(config.AddonUUID, addonService, ['ngx-lib']),
                deps: [PepAddonService]
            }
        }),
    ],
    providers: [
        TranslateStore
    ],
    bootstrap: [
        // AddonComponent
    ]
})
export class AppModule implements DoBootstrap {
    constructor(
        private injector: Injector,
        translate: TranslateService,
        private pepAddonService: PepAddonService
    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }

    ngDoBootstrap() {
        customElements.define(`transactions-element-${config.AddonUUID}`, createCustomElement(TypesListComponent, {injector: this.injector}));
        customElements.define(`activities-element-${config.AddonUUID}`, createCustomElement(TypesListComponent, {injector: this.injector}));
        customElements.define(`accounts-element-${config.AddonUUID}`, createCustomElement(TypesListComponent, {injector: this.injector}));
    }
}




