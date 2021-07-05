import { SortService } from './../../services/sort.service';
import { ListSearch, ObjectType, productTypeListMenu, relationTypesEnum, RemoteModuleOptions } from './../../../../../model';
import { PepperiTableComponent } from './pepperi-table/pepperi-table.component';
import { AddTypeDialogComponent } from './add-type-dialog/add-type-dialog.component';
import { Component, ComponentRef, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PepHttpService, PepSessionService } from '@pepperi-addons/ngx-lib';
import { PepDialogService, PepDialogData } from '@pepperi-addons/ngx-lib/dialog';
import { PepMenuItem, IPepMenuItemClickEvent } from '@pepperi-addons/ngx-lib/menu';
import { PepListActionsComponent } from '@pepperi-addons/ngx-lib/list';
import { PapiClient } from '@pepperi-addons/papi-sdk';

@Component({
    selector: 'addon-pepperi-list-exmaple',
    templateUrl: './types-list.component.html',
    styleUrls: ['./types-list.component.scss']
})
export class TypesListComponent implements OnInit {

    @ViewChild('dialogTemplate', { read: TemplateRef }) dialogTemplate: TemplateRef<any>;
    @ViewChild('listActions') listActions: PepListActionsComponent;
    @ViewChild(PepperiTableComponent) table: PepperiTableComponent;

    totalRows = 0;
    type;
    searchString = '';
    showListActions = false;
    menuItems: Promise<PepMenuItem[]>;


    displayedColumns;
    transactionTypes;
    searchAutoCompleteValues;
    addonUUID;

    dialogRef;
    dialogAddon;
    viewContainer: ViewContainerRef;
    compRef: ComponentRef<any>;
    selectedRows = 0;
    papi: PapiClient;

    @Input() subType;
    titlePipe = new TitleCasePipe();
    addonBaseURL = '';



    constructor(
        public translate: TranslateService,
        private http: PepHttpService,
        private dialogService: PepDialogService,
        private session: PepSessionService,
        private router: Router,
        private route: ActivatedRoute,
        private sort: SortService

    ) {
        this.addonUUID = route.snapshot.params.addon_uuid;
        this.papi = new PapiClient({
            baseURL: this.session.getPapiBaseUrl(),
            token: this.session.getIdpToken()
        });
    }

    async ngOnInit() {
        this.route.params.subscribe( params => {
            this.type = params.type;
            this.subType = params.sub_type;
            const addonUUID = params.addon_uuid;
            this.menuItems = this.getMenu(addonUUID);
            this.loadlist();
        })

        this.route.queryParams.subscribe( queryParams => {
            this.addonBaseURL = queryParams?.addon_base_url;
        })


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
            this.selectedRows = selectedRowsCount;
    }

    buildUrlByParams(params){
        let url = '';
        let type = ObjectType[this.type];
        url = `/types?fields=Name,Description,UUID,InternalID&order_by=${params.sortBy} ${params.isAsc ? 'asc' : 'desc'}&where=Type=${type} AND Hidden=0`;
        return url;
    }

    loadlist(change: ListSearch = { sortBy: 'Name', isAsc: true, searchString: '', type: this.type, subType: this.subType}) {
        let url = this.buildUrlByParams(change);
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
            (error) => this.openErrorDialog(error),
            () => {}
        );
    }

    async onMenuClicked(){
        const actions = this.listActions.actions;
        const filteredActionsBySelectionMode = actions.filter( action  =>{
            const addon: RemoteModuleOptions = JSON.parse(action.key);
            return this.selectedRows > 1 ? addon.multiSelection === 'true' : true;
        });

        // const filteredActionsByApi = await this.http.postHttpCall(`http://localhost:4500/api/filter_entries`, { addons:filteredActionsBySelectionMode}).toPromise();
        const filteredActionsByApi = await this.http.postPapiApiCall(`/addons/api/${this.addonUUID}/api/filter_entries`, { addons:filteredActionsBySelectionMode}).toPromise();
        this.listActions.actions = filteredActionsByApi;
    }

    onMenuItemClicked(e: IPepMenuItemClickEvent): void{
        const remoteModule: RemoteModuleOptions = JSON.parse(e?.source?.key);
        const selectedRows = this.table?.getSelectedItemsData()?.rows;
        const rowData = this.table?.getItemDataByID(selectedRows[0]);
        const atdInfo = rowData?.Fields[0]?.AdditionalValue ? rowData.Fields[0].AdditionalValue : null;
        // Generic
        remoteModule.addonData = { atd: atdInfo, selectedRows };

        switch (remoteModule.type){
                    case 'AddonAPI':
                        if (remoteModule.remoteEntry) {
                           this.runAddonApiEntry(remoteModule);
                        }
                        break;
                    case 'Navigate':
                          const path = remoteModule.remoteEntry
                                .replace('TYPE', this.type)
                                .replace('SUB_TYPE', this.subType)
                                .replace('TYPE_ID', atdInfo['InternalID']);
                          this.router.navigate([`settings/${remoteModule.uuid}/${path}`]);
                        break;
                    case 'NgComponent':
                        if (remoteModule.uuid){
                            this.openAddonInDialog(remoteModule);
                        }
                        break;

        }
    }

    openAddonInDialog(remoteModule: RemoteModuleOptions): void {
        remoteModule.exposedModule = this.addonBaseURL ? './AddonModule' : remoteModule.exposedModule;
        remoteModule.componentName = this.addonBaseURL ? 'AddonComponent' : remoteModule.componentName;
        remoteModule.remoteName = this.addonBaseURL ? 'addon' : remoteModule.remoteName;
        remoteModule.remoteEntry = this.addonBaseURL ? `${this.addonBaseURL+remoteModule.remoteName}.js` : remoteModule.remoteEntry;
        remoteModule.title = this.addonBaseURL ? 'Sub Addon' : remoteModule.title;
        const config = this.dialogService.getDialogConfig({}, 'inline');
        this.dialogAddon = remoteModule;
        this.dialogRef = this.dialogService
          .openDialog(this.dialogTemplate, {addon: remoteModule}, config)
            .afterOpened().subscribe((res) => {});
    }

    runAddonApiEntry(remoteModule: RemoteModuleOptions){
        const dialogData: PepDialogData = {
            content: this.translate.instant('Confirmation_Message',{title: remoteModule.title}),
            title: remoteModule.title,
            actionsType: "cancel-continue",
            actionButtons: null,
            showClose: true,
            showFooter: true,
            showHeader: true
        }
        if (remoteModule?.confirmation){

            const dialogRef = this.dialogService.openDefaultDialog(dialogData);
             dialogRef.afterClosed().subscribe(async confirmed =>{
                 if (confirmed){

                     this.postAddonApi(remoteModule, dialogData);
                 }
            });
        }
        else {
            this.postAddonApi(remoteModule, dialogData);
        }

    }

    async postAddonApi(remoteModule: RemoteModuleOptions, dialogData){
        remoteModule.addonData['objectType'] = this.type;
        remoteModule.addonData['objectId'] = remoteModule.addonData['atd'].InternalID;
        //  const success = await this.http.postHttpCall(`http://localhost:4500/${remoteModule.remoteEntry}`, remoteModule.addonData).toPromise();
        const success = await this.http.postPapiApiCall(`/addons/api/${this.addonUUID}/${remoteModule.remoteEntry}`, remoteModule.addonData).toPromise();
        dialogData.content = this.translate.instant(success ?  "AddonApi_Dialog_Success" : "AddonApi_Dialog_Failure",{ taskName: remoteModule.title});
        dialogData.type = "close";
        this.dialogService.openDefaultDialog(dialogData).afterClosed().subscribe(async () => this.loadlist());
    }

    closeDialog(e = null){
        this.dialogService['dialog'].closeAll();
    }

    onAddonChange(e){
        if (e.closeDialog){
            this.closeDialog();
        }
    }

    addObject(){
        const dialogRef = this.dialogService.openDialog(
            AddTypeDialogComponent,
            { value: 'value', type: this.translate.instant(this.type), showAAComplient: 'showAAComplient' });
        dialogRef.afterClosed().subscribe(atd => this.createObject(atd));
    }

    createObject(atd){
        if (atd) {
            const body = {
                ExternalID: atd.data.name,
                Description: atd.data.description
            };
            this.http.postPapiApiCall(`/meta_data/${this.type}/types`, body)
                        .subscribe(res => {
                            this.router.navigate([`/settings/${this.addonUUID}/${this.type}/types/${res.InternalID}/general`]);
                        }, err => this.openErrorDialog(err));
        }
    }

    onSearchChanged(e){
        const value = e?.target?.value || e?.value;
        this.loadlist({sortBy: 'Name', isAsc: true, searchString: value, type: this.type, subType: this.subType });
    }

    async getMenu(addonUUID): Promise<PepMenuItem[]> {
        const apiNames: Array<PepMenuItem> = [];
        const body = { RelationName: `${relationTypesEnum[this.type]}TypeListMenu`};
        // debug locally
         const menuEntries = await this.http.postHttpCall('http://localhost:4500/api/relations', body).toPromise();
        // const menuEntries = await this.http.postPapiApiCall(`/addons/api/${addonUUID}/api/relations`, body).toPromise();
        const dividedEntries = this.sort.divideEntries(menuEntries?.relations, productTypeListMenu[`${relationTypesEnum[this.type]}TypeListMenu`]);
        dividedEntries.forEach(menuEntry => apiNames.push(new PepMenuItem({ key: JSON.stringify(menuEntry), text: menuEntry.title})));
        return apiNames;
    }

    openErrorDialog(error){
        const title = this.translate.instant('MESSAGES.TITLE_NOTICE');
        const data = new PepDialogData({
            title,
            content: error?.fault?.faultstring || error
        });
        this.dialogService.openDefaultDialog(data);
    }

}
