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
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

import { NavigationService } from '../../services/navigation.service';
import { PepRemoteLoaderModule } from '@pepperi-addons/ngx-lib/remote-loader';
import { TypesListComponent } from './types-list.component';
// import { AddTypeDialogComponent } from './add-type-dialog/add-type-dialog.component';
import { PepperiTableComponent } from './pepperi-table/pepperi-table.component';
import { RouterModule, Routes } from '@angular/router';
import { UtillityService } from 'src/addon/services/utillity.service';

const routes: Routes = [
    {
        path: '',
        component: TypesListComponent
    }
];

@NgModule({
    declarations: [
        TypesListComponent,
        // AddTypeDialogComponent,
        PepperiTableComponent,
    ],
    imports: [
        CommonModule,
        MatDialogModule,
        MatIconModule,
        MatButtonModule,
        MatExpansionModule,
        MatTabsModule,
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
        PepRemoteLoaderModule,
        TranslateModule.forChild(),
        RouterModule.forChild(routes),
    ],
    exports: [
        TypesListComponent
    ],
    providers: [
        UtillityService,
        NavigationService
    ]
})
export class TypesListModule { }
