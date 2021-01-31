import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransactionTypesComponent } from './components/transaction-types/transaction-types.component';
import { EmptyRouteComponent } from './components/empty-route/empty-route.component';
import { AtdEditorComponent } from './components/atd-editor/atd-editor.component';

const routes: Routes = [{
    path: 'settings/:addon_uuid',

    children: [
        {
            path: 'transaction_types/:type_id/:tab_id',
            component: AtdEditorComponent
        },
        {
            path: 'transaction_types',
            component: TransactionTypesComponent
        }
    ]
    },
    {
        path: '**',
        component: EmptyRouteComponent
    }

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AddonRoutingModule { }
