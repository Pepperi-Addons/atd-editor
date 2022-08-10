import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsTabsComponent } from '../settings-tabs/settings-tabs.component';
import { TypesListComponent } from '../types-list/types-list.component';
import { SettingsComponent } from './settings.component';

// Important for single spa
@Component({
    selector: 'app-empty-route',
    template: '<div>Route is not exist settings.</div>',
})
export class EmptyRouteComponent {}

const routes: Routes = [{
    path: ':settingsSectionName/:addon_uuid/:type',
    component: SettingsComponent,
    children: [
        {
            path: '',
            loadChildren: () => import('../types-list/types-list.module').then(m => m.TypesListModule),
            // component: TypesListComponent
        },
        {
            path: ':type_id/:tab_id',
            // loadChildren: () => import('../settings-tabs/settings-tabs.module').then(m => m.SettingsTabsModule),
            component: SettingsTabsComponent
        },
        { path: '**', component: EmptyRouteComponent }
    ]
}];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class SettingsRoutingModule { }



