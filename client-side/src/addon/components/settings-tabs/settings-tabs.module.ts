import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule, TranslateStore } from '@ngx-translate/core';

import { PepNgxLibModule } from '@pepperi-addons/ngx-lib';
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

import { NavigationService } from '../../services/navigation.service';
import { PepRemoteLoaderModule } from '@pepperi-addons/ngx-lib/remote-loader';
import { SettingsTabsComponent } from './settings-tabs.component';

@NgModule({
    declarations: [
        SettingsTabsComponent,
    ],
    imports: [
        CommonModule,
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
        TranslateModule.forChild(),
    ],
    exports: [
        SettingsTabsComponent
    ]
})
export class SettingsTabsModule { }
