import { PepperiTableComponent } from './pepperi-table/pepperi-table.component';
import { AddTypeDialogComponent } from './add-type-dialog/add-type-dialog.component';
import { Component, ComponentRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PepHttpService } from '@pepperi-addons/ngx-lib';
import { PepDialogService, PepDialogActionButton, PepDialogData } from '@pepperi-addons/ngx-lib/dialog';
import { PepMenuItem, IPepMenuItemClickEvent } from '@pepperi-addons/ngx-lib/menu';
import { MatDialog } from '@angular/material/dialog';

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

    @ViewChild('dialogTemplate', { read: TemplateRef }) dialogTemplate: TemplateRef<any>;
    @ViewChild(PepperiTableComponent) table: PepperiTableComponent;

    // List variables
    menuItems: Promise<any>;
    totalRows = 0;
    displayedColumns;
    transactionTypes;
    searchString = '';
    searchAutoCompleteValues;
    addonUUID;
    showListActions = false;
    dialogRef;
    dialogAddon;
    viewContainer: ViewContainerRef;
    compRef: ComponentRef<any>;

    constructor(
        private translate: TranslateService,
        private http: PepHttpService,
        private dialogService: PepDialogService,
        private dialog: MatDialog,
        private router: Router,
        private route: ActivatedRoute

    ) {
        this.addonUUID = route.snapshot.params.addon_uuid;
    }

    ngOnInit() {
        const addonUUID = this.route.snapshot.params.addon_uuid;
        this.menuItems = this.lookup(addonUUID);
        this.loadlist();

    }


    // List functions
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

    loadlist(change = { sortBy: 'Name', isAsc: true, searchString: ''}) {
        let url = `/types?fields=Name,Description,UUID,InternalID&order_by=${change.sortBy} ${change.isAsc ? 'asc' : 'desc'}&where=Type=2`;
        const search = change?.searchString;
        if (search){
            url = url + (` AND (Name like '%${search}%' OR Description like '%${search}%')`);
            this.showListActions = false;
        }
        this.http.getPapiApiCall(encodeURI(url)).subscribe(
            (transactionTypes) => {
                this.displayedColumns = ['Name', 'Description'];
                this.transactionTypes = transactionTypes;
                this.totalRows = transactionTypes.length;
            },
            (error) => {},
            () => {}
        );
    }

    onMenuItemClicked(e: IPepMenuItemClickEvent): void{
        const selectedRow = this.table.getSelectedItemsData().rows[0];
        const rowData = this.table.getItemDataByID(selectedRow);
        const atdInfo = rowData && rowData.Fields[0] && rowData.Fields[0].AdditionalValue ? rowData.Fields[0].AdditionalValue : null;

        switch (e?.source?.key['Action']){
                    case 'delete':
                        this.deleteATD(atdInfo);
                        break;
                    case 'navigate':
                          const path = e.source.key['Editor'].replace('ATD_ID', atdInfo['InternalID'])
                          this.router.navigate([`settings/${e.source.key['UUID']}/${path}`]);
                        break;

        }
    }

    openAddonInDialog(plugin): void {
        const config = this.dialogService.getDialogConfig(
        {},
          'regular'
        );
        this.dialogAddon = plugin;
        this.dialogRef = this.dialogService
          .openDialog(this.dialogTemplate, { addon: plugin}, config)
            .afterOpened().subscribe((res) => {});
    }

    closeDialog(){
    // this.dialogRef.close(data);

        this.dialog.closeAll();
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

    async lookup(addonUUID): Promise<any[]> {
        const apiNames: Array<PepMenuItem> = [];
        const body = {
            // TableName: "addons_menus",
            // Type: "menu"
            DataViewName: "AtdEditor_Transactions_Menu"
         };
        // debug locally
        //  const addons = await this.http.postHttpCall('http://localhost:4500/api/lookup', body).toPromise().then(tabs => tabs.sort((x,y) => x['Index'] - y['Index']));
         const addons = await this.http.postPapiApiCall(`/addons/api/${addonUUID}/api/lookup`, body).toPromise().then(tabs => tabs.sort((x,y) => x['Index'] - y['Index']));
         addons.forEach(addon => {
             if (addon.Type === "menu"){
                apiNames.push(new PepMenuItem({ key: addon, text: addon.Title}));
             }
         });

        return apiNames;
    }

}
