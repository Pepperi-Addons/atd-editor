import { SortService } from './../../services/sort.service';
import { ListSearch, ObjectType, productTypeListMenu, relationTypesEnum, RemoteModuleOptions } from './../../../../../model';
import { PepperiTableComponent } from './pepperi-table/pepperi-table.component';
import { AddTypeDialogComponent } from './add-type-dialog/add-type-dialog.component';
import { Component, ComponentRef, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PepHttpService, PepSessionService } from '@pepperi-addons/ngx-lib';
import { PepDialogService, PepDialogData } from '@pepperi-addons/ngx-lib/dialog';
import { PepMenuItem, IPepMenuItemClickEvent } from '@pepperi-addons/ngx-lib/menu';
import { PepListActionsComponent } from '@pepperi-addons/ngx-lib/list';
import { PapiClient } from '@pepperi-addons/papi-sdk';
import { IPepFormFieldClickEvent } from '@pepperi-addons/ngx-lib/form';
import { NavigationService } from '../../services/navigation.service';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'addon-types-list',
    templateUrl: './types-list.component.html',
    styleUrls: ['./types-list.component.scss']
})
export class TypesListComponent implements OnInit {

    @ViewChild('dialogTemplate', { read: TemplateRef }) dialogTemplate: TemplateRef<any>;
    @ViewChild('listActions') listActions: PepListActionsComponent;
    @ViewChild(PepperiTableComponent) table: PepperiTableComponent;

    totalRows = 0;
    searchString = '';
    showListActions = false;
    menuItems: Promise<PepMenuItem[]>;

    displayedColumns;
    transactionTypes;
    searchAutoCompleteValues;
    
    type;
    settingsSectionName;
    addonUUID;

    dialogRef;
    dialogAddon;
    legacySettingsAddon;
    viewContainer: ViewContainerRef;
    compRef: ComponentRef<any>;
    selectedRows = 0;
    papi: PapiClient;

    // @Input() subType;

    titlePipe = new TitleCasePipe();
    addonBaseURL = '';
    editEntry: any;



    constructor(
        public translate: TranslateService,
        private http: PepHttpService,
        private dialogService: PepDialogService,
        // private session: PepSessionService,
        private router: Router,
        private route: ActivatedRoute,
        private sort: SortService,
        private navigationService: NavigationService

    ) {
        this.addonUUID = this.navigationService.addonUUID;
        
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            const route: ActivatedRoute = this.navigationService.getCurrentRoute(this.route);

            route.params.subscribe( params => {
                this.type = params.type;
                // this.subType = params.sub_type;
                // const addonUUID = params.addon_uuid;
                this.settingsSectionName = params.settingsSectionName;

                this.menuItems = this.getMenu();
                this.loadlist();
            })
    
            route.queryParams.subscribe(queryParams => {
                this.addonBaseURL = queryParams?.addon_base_url
            });
        });
    }

    ngOnInit() {
// debugger;
//         this.route.params.subscribe( params => {
//             this.type = params.type;
//             // this.subType = params.sub_type;
//             // const addonUUID = params.addon_uuid;
//             this.menuItems = this.getMenu();
//             this.loadlist();
//         })

//         this.route.queryParams.subscribe( queryParams => this.addonBaseURL = queryParams?.addon_base_url);
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
        url = `/types?fields=Name,Description,UUID,InternalID&order_by=${params.sortBy} ${params.isAsc ? 'asc' : 'desc'}&where=Type=${type} AND Hidden=0 AND Name!='PrivateUserAccount'`;
        return url;
    }

    loadlist(change: ListSearch = { sortBy: 'Name', isAsc: true, searchString: '', type: this.type}) {
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

        const baseUrl = this.navigationService.getBaseUrl();
        const filteredActionsByApi = await this.http.postHttpCall(`${baseUrl}/filter_entries`, { addons:filteredActionsBySelectionMode}).toPromise();
        this.listActions.actions = filteredActionsByApi;
    }

    onMenuItemClicked(e: IPepMenuItemClickEvent): void{
        // TODO: remove all code unrelated to apiDesign
        const remoteModule: RemoteModuleOptions & any = JSON.parse(e?.source?.key);
        const SelectedRows = this.table?.getSelectedItemsData()?.rows;
        const rowData = this.table?.getItemDataByID(SelectedRows[0]);
        const atdInfo = rowData?.Fields[0]?.AdditionalValue ? rowData.Fields[0].AdditionalValue : null;
        // Generic
        remoteModule.activityTypeDefinition = atdInfo;
        remoteModule.addonData = { SelectedRows };
        // According to apiDesign
        remoteModule.hostObject = {
            selectAll: false,
            dataRelativeURL: null,
            objectList: [atdInfo['UUID']]
        };

        switch (remoteModule.type){
                    case 'AddonAPI':
                        if (remoteModule.remoteEntry) {
                           this.runAddonApiEntry(remoteModule);
                        }
                        break;
                    case 'Navigation':
                    case 'Navigate': // TODO: Remove Navigate keep Navigation
                        // TODO: Implement with navigation event (to webapp). !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
                        // const path = remoteModule.remoteEntry
                        //     .replace('TYPE', this.route.snapshot.params.type)
                        //     .replace('SUB_TYPE', this.route.snapshot.params.sub_type)
                        //     .replace('TYPE_ID', atdInfo['InternalID']);
                        // this.router.navigate([`settings/${remoteModule.uuid}/${path}`]); 
                        
                        const queryParams = {
                            select_all: remoteModule.hostObject.selectAll,
                            data_relative_url: remoteModule.hostObject.dataRelativeURL,
                            object_list: remoteModule.hostObject.objectList
                        }

                        const path = remoteModule.remoteEntry
                            .replace('TYPE', this.type)
                            .replace('SUB_TYPE/', '') // Old code not needed.
                            .replace('TYPE_ID', atdInfo['InternalID']);

                        this.router.navigate([`${this.settingsSectionName}/${this.addonUUID}/${path}`], { queryParams}); 

                        break;
                    case 'NgComponent':
                        if (remoteModule.uuid){
                            this.openAddonInDialog(remoteModule);
                        }
                        break;

        }
    }

    openAddonInDialog(remoteModule: RemoteModuleOptions): void {
        debugger;
        remoteModule.remoteEntry = this.addonBaseURL ? `${this.addonBaseURL+remoteModule.remoteName}.js` : remoteModule.remoteEntry;
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

    async postAddonApi(remoteModule: RemoteModuleOptions & any, dialogData){
        // Needed to delete Object due to PAPI TYPES resoruce limiitations
        remoteModule.addonData['ObjectType'] = this.type;
        remoteModule.addonData['ObjectId'] = remoteModule?.activityTypeDefinition?.InternalID;
        // Accourding to ApiDesign
        remoteModule.addonData['SelectAll'] = remoteModule.hostObject.selectAll;
        remoteModule.addonData['DataRelativeURL'] =  remoteModule.hostObject.dataRelativeURL;
        remoteModule.addonData['ObjectList'] =  remoteModule.hostObject.objectList;

        //const response = await this.http.postHttpCall(`http://localhost:4500/${remoteModule.remoteEntry}`, remoteModule.addonData).toPromise();
        const baseUrl = this.navigationService.getBaseUrl(remoteModule.remoteEntry);
        const response = await this.http.postHttpCall(`${baseUrl}`, remoteModule.addonData).toPromise();
        const error = response?.fault?.faultstring;
        dialogData.content = this.translate.instant(response.success ?  "AddonApi_Dialog_Success" : "AddonApi_Dialog_Failure",{ taskName: remoteModule.title, error});
        dialogData.actionsType = "close";
        this.dialogService.openDefaultDialog(dialogData).afterClosed().subscribe(async () => this.loadlist());
    }

    closeDialog(e = null){
        this.dialogService['dialog'].closeAll();
    }

    onAddonChange(e){
        switch(e?.action){
            case "close-dialog":
                this.closeDialog();
                break;
            default:
                break;
        }
    }

    addObject(){
        const dialogRef = this.dialogService.openDialog(
            AddTypeDialogComponent,
            { value: 'value', type: this.translate.instant(this.type), showAAComplient: 'showAAComplient' });
        dialogRef.afterClosed().subscribe(atd => this.createObject(atd));
    }

    onCustomizeFieldClick(customizeFieldClickedData: IPepFormFieldClickEvent) {

        const self = this;
        const items = this.table.getLisItems();

        const rowData = items.filter( item => item.UID === customizeFieldClickedData.id );
        let internalID = rowData ? rowData[0].Fields[0].AdditionalValue['InternalID'] : '';
        
        let path = self.editEntry[0].remoteEntry;
            path = path.replace('TYPE', self.route.snapshot.params.type)
                        .replace('SUB_TYPE', self.route.snapshot.params.sub_type)
                        .replace('TYPE_ID', internalID);
       
        self.router.navigate([`${this.settingsSectionName}/${self.addonUUID}/${path}`]);
    }

    createObject(atd){
        if (atd) {
            const body = {
                ExternalID: atd.data.name,
                Description: atd.data.description
            };
            this.http.postPapiApiCall(`/meta_data/${this.type}/types`, body)
                        .subscribe(res => {
                            this.router.navigate([`/${this.settingsSectionName}/${this.addonUUID}/${this.type}/${res.InternalID}/general`]);
                        }, err => this.openErrorDialog(err));
        }
    }

    onSearchChanged(e){
        const value = e?.target?.value || e?.value;
        this.loadlist({sortBy: 'Name', isAsc: true, searchString: value, type: this.type });
    }

    async getMenu(): Promise<PepMenuItem[]> {
        const apiNames: Array<PepMenuItem> = [];
        const body = {
            RelationName: `${relationTypesEnum[this.type]}TypeListMenu`,
            Flag: '/company/flags/EnableAccountTypesOption'
        };
        // debug locally
        //const menuEntries = await this.http.postHttpCall('http://localhost:4500/api/relations', body).toPromise();
        const baseUrl = this.navigationService.getBaseUrl();
        const menuEntries = await this.http.postHttpCall(`${baseUrl}/relations`, body).toPromise();
        
         // HACK DUE TO MULTI TYPES IN WSIM PLEASE REMOVE WHEN ALL DISTRIBUTORS ARE MIGRATED TO MULTI ACCOUNT TYPES
        if (this.type == 'accounts' && !menuEntries.multiAccount){
            this.router.navigateByUrl(`${this.settingsSectionName}/354c5123-a7d0-4f52-8fce-3cf1ebc95314/editor?view=accounts_forms`);
         };
        this.editEntry = menuEntries?.relations.filter(entry => entry.type.toLowerCase() === 'navigate') || '' ;
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
