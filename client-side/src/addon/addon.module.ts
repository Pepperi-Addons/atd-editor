import { BackofficeIframeModule } from './components/atd-editor/backoffice-iframe/backoffice-iframe.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AddonRoutingModule } from './addon-routing.module';
import { AddonComponent } from './addon.component';
import { TransactionTypesComponent } from './components/transaction-types/transaction-types.component';
import { PepUIModule } from './modules/pepperi.module';
import { MaterialModule } from './modules/material.module';
import { AtdEditorComponent } from './components/atd-editor/atd-editor.component';
import { AddTypeDialogComponent } from './components/transaction-types/add-type-dialog/add-type-dialog.component';
import { PepperiTableComponent } from './components/pepperi-table/pepperi-table.component';
import { SubAddonLoaderComponent } from './components/sub-addon-loader/sub-addon-loader.component';
import { EmptyRouteComponent } from './components/empty-route/empty-route.component';

@NgModule({
    declarations: [
        AddonComponent,
        TransactionTypesComponent,
        AtdEditorComponent,
        AddTypeDialogComponent,
        PepperiTableComponent,
        SubAddonLoaderComponent,
        EmptyRouteComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AddonRoutingModule,
        PepUIModule,
        MaterialModule,
        BackofficeIframeModule
    ],
    providers: [],
    bootstrap: [AddonComponent]
})
export class AddonModule {
}




