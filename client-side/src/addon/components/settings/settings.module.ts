import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { PepAddonService, PepNgxLibModule } from '@pepperi-addons/ngx-lib';

import { SettingsTabsComponent } from '../settings-tabs/settings-tabs.component';
import { AddTypeDialogComponent } from '../types-list/add-type-dialog/add-type-dialog.component';
import { PepperiTableComponent } from '../types-list/pepperi-table/pepperi-table.component';

import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings.routes';
import { PepRemoteLoaderModule } from '@pepperi-addons/ngx-lib/remote-loader';
import { PepTopBarModule } from '@pepperi-addons/ngx-lib/top-bar';
import { PepPageLayoutModule } from '@pepperi-addons/ngx-lib/page-layout';
import { PepDialogModule } from '@pepperi-addons/ngx-lib/dialog';
import { PepIconModule } from '@pepperi-addons/ngx-lib/icon';
import { PepListModule } from '@pepperi-addons/ngx-lib/list';
import { PepSearchModule } from '@pepperi-addons/ngx-lib/search';
import { PepTextareaModule } from '@pepperi-addons/ngx-lib/textarea';
import { PepTextboxModule } from '@pepperi-addons/ngx-lib/textbox';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { TypesListModule } from '../types-list/types-list.module';
// import { NavigationService } from 'src/addon/services/navigation.service';
import { SettingsTabsModule } from '../settings-tabs/settings-tabs.module';

@NgModule({
    declarations: [
        SettingsComponent,
    ],
    imports: [
        CommonModule,
        PepNgxLibModule,
        PepNgxLibModule,
        PepTopBarModule,
        //// When not using module as sub-addon please remark this for not loading twice resources
        PepPageLayoutModule,
        PepDialogModule,
        PepListModule,
        PepSearchModule,
        PepTextareaModule,
        PepTextboxModule,
        PepIconModule,
        MatIconModule,
        MatButtonModule,
        MatExpansionModule,
        MatDialogModule,
        MatTabsModule,
        PepRemoteLoaderModule,
        SettingsRoutingModule,
        TypesListModule,
        SettingsTabsModule,
        TranslateModule.forChild(),
    ],
    providers: [
        TranslateStore,
        // NavigationService,
    ]
})
export class SettingsModule {
    constructor(
        translate: TranslateService,
        private pepAddonService: PepAddonService

    ) {
        this.pepAddonService.setDefaultTranslateLang(translate);
    }
}
