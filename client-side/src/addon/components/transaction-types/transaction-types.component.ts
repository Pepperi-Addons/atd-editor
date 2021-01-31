import { PepperiTableComponent } from './pepperi-table/pepperi-table.component';
import { AddTypeDialogComponent } from './add-type-dialog/add-type-dialog.component';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PepHttpService } from '@pepperi-addons/ngx-lib';
import { PepDialogService, PepDialogActionButton, PepDialogData } from '@pepperi-addons/ngx-lib/dialog';
import { PepMenuItem, IPepMenuItemClickEvent } from '@pepperi-addons/ngx-lib/menu';
export enum AddonType {
    System = 1,
    Public = 2,
    Distributor = 3,
    Dev = 4
}

@Component({
    selector: 'addon-pepperi-list-exmaple',
    templateUrl: './transaction-types.component.html',
    styleUrls: ['./transaction-types.component.scss']
})
export class TransactionTypesComponent implements OnInit {

    @ViewChild(PepperiTableComponent) table: PepperiTableComponent;
    menuItems: Promise<any>;
    totalRows = 0;
    displayedColumns;
    transactionTypes;
    searchString = '';
    searchAutoCompleteValues;
    addonUUID;
    showListActions = false;
    constructor(
        private translate: TranslateService,
        private http: PepHttpService,
        private dialogService: PepDialogService,
        private router: Router,
        private route: ActivatedRoute

    ) {
        this.addonUUID = route.snapshot.params.addon_uuid;
    }

    ngOnInit() {
        // this.http.postHttpCall('http://localhost:4404/installation/install', { AddonUUID: this.addonUUID}).subscribe(res =>{
        //     debugger;
        // })
        this.menuItems = this.getMenuItems();
        this.loadlist();

    }

    customizeDataRowField(object: any, key: any, dataRowField: any) {

        switch (key) {
            case 'Description':
                dataRowField.ColumnWidth = 65;
                break;
            case 'ExternalID':
            case 'Name':
                dataRowField.AdditionalValue = object;
                dataRowField.ColumnWidth = 35;
                break;
            default:
                dataRowField.FormattedValue = object[key] ? object[key].toString() : '';
                break;
        }

        return dataRowField;
    }

    onSortingChanged(e){
        e.searchString = '';
        this.loadlist(e);
    }

    selectedRowsChanged(selectedRowsCount) {
            this.showListActions = selectedRowsCount > 0;
    }

    getMenuItems() {
        const apiNames: Array<PepMenuItem> = [];
        return this.http.getPapiApiCall(`/addons/data/${this.route.snapshot.params.addon_uuid}/tabs?where=Type=menu`)
            .toPromise().then(menuItems => { menuItems.forEach( item => {
                const path = item?.AddonUUID && item?.Editor ? `${item.AddonUUID}/${item.Editor}` : '';
                apiNames.push(new PepMenuItem({ key: path, text: item.Title}));
                });
                return apiNames;
        });
    }

    loadlist(change = { sortBy: 'Name', isAsc: true, searchString: ''}) {
        let url = `/types?fields=Name,Description,UUID,InternalID&order_by=${change.sortBy} ${change.isAsc ? 'asc' : 'desc'}&where=Type=2`;
        const search = change?.searchString;
        if (search){
            url = url + (` AND (Name like '%${search}%' OR Description like '%${search}%')`);
            this.showListActions = false;
        }

        // this.http.postHttpCall('http://localhost:4401/api/transaction_types', {}).subscribe(res => res);
        // this.http.postPapiApiCall(`${this.addon_uuid}`, {}).subscribe(res => res);
        this.http.getPapiApiCall(encodeURI(url)).subscribe(
            (transactionTypes) => {
                this.displayedColumns = ['Name', 'Description'];
                this.transactionTypes = transactionTypes;
                this.totalRows = transactionTypes.length;
            },
            (error) => {
                // console.log(error);
            },
            () => {
            }
    );
    }

    onMenuItemClicked(e: IPepMenuItemClickEvent): void{
        const selectedRow = this.table.getSelectedItemsData().rows[0];
        const rowData = this.table.getItemDataByID(selectedRow);
        const atdInfo = rowData && rowData.Fields[0] && rowData.Fields[0].AdditionalValue ? rowData.Fields[0].AdditionalValue : null;

        switch (e.source.key) {
            case '':
                switch (e.source.text){
                    case 'Delete':
                        this.deleteATD(atdInfo);
                        break;
                }
                break;
            default:
                const path = e.source.key.replace('ATD_ID', atdInfo['InternalID'])
                this.router.navigate([`/settings/${path}`]);
                break;



        }
    }

    addNewATD(){
        const dialogRef = this.dialogService.openDialog(
            AddTypeDialogComponent,
            { value: 'value', type: 'type', showAAComplient: 'showAAComplient' });
        dialogRef.afterClosed().subscribe(atd => this.createATD(atd));
    }

    createATD(atd){
        if (atd) {
            const body = {
                ExternalID: atd.data.name,
                Description: atd.data.description
            };
            this.http.postPapiApiCall('/meta_data/transactions/types', body)
                        .subscribe(res => {
                            this.router.navigate([`/settings/${this.route.snapshot.params.addon_uuid}/transaction_types/${res.InternalID}/general`]);
                            // this.loadlist();
                        });
        }
    }

    deleteATD(atdInfo){
        const msg = this.translate.instant('Delete_Validate');
        const title = this.translate.instant('Delete');
        const actionButtons = [
            new PepDialogActionButton(this.translate.instant('Yes'),'main strong', () => this.setHidden(atdInfo.InternalID) ),
            new PepDialogActionButton(this.translate.instant('No'),'main weak')
        ];
        const dialogData = new PepDialogData({ title, content: msg, type: 'custom', actionButtons });
        this.dialogService.openDefaultDialog(dialogData)
            .afterClosed().subscribe(res => {
               if (typeof res === 'function') {
                res();
               }
            });
    }

    setHidden(atdID){
        const body = {
            InternalID: atdID,
            Hidden: true
        }
        return this.http.postPapiApiCall('/meta_data/transactions/types', body)
                    .subscribe(res => this.loadlist(),
                    error => {
                        const title = this.translate.instant('MESSAGES.TITLE_NOTICE');
                        const data = new PepDialogData({
                            title,
                            content: error
                        });
                        this.dialogService.openDefaultDialog(data);
                    });
    }

    onSearchChanged(e){
        const value = e?.target?.value || e?.value;
        this.loadlist({sortBy: 'Name', isAsc: true, searchString: value });


    }

}
