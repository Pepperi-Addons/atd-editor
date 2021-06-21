import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AddonRoutingModule } from './addon-routing.module';
import { AddonComponent } from './addon.component';
import { TypesListComponent } from './components/types-list/types-list.component';
import { PepUIModule } from './modules/pepperi.module';
import { MaterialModule } from './modules/material.module';
import { SettingsTabsComponent } from './components/settings-tabs/settings-tabs.component';
import { AddTypeDialogComponent } from './components/types-list/add-type-dialog/add-type-dialog.component';
import { PepperiTableComponent } from './components/types-list/pepperi-table/pepperi-table.component';
import { EmptyRouteComponent } from './components/empty-route/empty-route.component';
import { PepRemoteLoaderModule } from '@pepperi-addons/ngx-remote-loader';

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
        AddonRoutingModule,
        PepUIModule,
        MaterialModule,
        PepRemoteLoaderModule,
        CommonModule

    ],
    providers: [],
    bootstrap: [AddonComponent]
})
export class AddonModule {
}




