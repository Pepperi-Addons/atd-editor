import { SortService } from './../../services/sort.service';
import { productObjectTypeTabs, relationTypesEnum, RemoteModuleOptions } from './../../../../../model';
import { TranslateService } from '@ngx-translate/core';
import { PepDialogService, PepDialogData } from '@pepperi-addons/ngx-lib/dialog';
import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PepHttpService } from '@pepperi-addons/ngx-lib';

import { PepAddonLoaderComponent } from '@pepperi-addons/ngx-remote-loader';
import { MatTabGroup } from '@angular/material/tabs';




@Component({
  selector: 'addon-settings-tabs',
  templateUrl: './settings-tabs.component.html',
  styleUrls: ['./settings-tabs.component.scss']
})
export class SettingsTabsComponent implements OnInit {

    atd;
    type;
    tabs: Array<any>;
    workflowTab: RemoteModuleOptions & any= null;
    activeTab: RemoteModuleOptions;
    activeTabIndex = 0;
    data = {atd: null, tab: null, addon: null};
    @ViewChild('addonProxy', {static: false}) addonProxy: PepAddonLoaderComponent;
    @ViewChild("tabGroup", { static: false }) _Tabs: MatTabGroup;
    @Input() title = '';
    hostObject = {
        selectAll: false,
        dataRelativeURL: null,
        objectList: []
    }
    typesEnum = {
        'accounts': 'Account',
        'transactions': 'Orders',
        'activities': 'Activity',
        'transaction_lines': 'Lines',
        'contacts': 'Contact'
    }

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private http: PepHttpService,
      private dialogService: PepDialogService,
      private translate: TranslateService,
      private cd: ChangeDetectorRef,
      private sort: SortService
    ) {

    }

    async ngOnInit() {
      const params = this.route.snapshot.params;
      const addonBaseURL = this.route.snapshot.queryParams.addon_base_url;
      this.type =  params.type;

      this.initFromServer(params.addon_uuid, this.type, params.type_id).then((res: any) =>{
        const relationType = productObjectTypeTabs[`${relationTypesEnum[this.type]}TypeListTabs`];
        this.tabs = this.sort.divideEntries(res?.relations, relationType );
        this.activeTab = this.tabs.find((tab,index) => {
                this.activeTabIndex = index;
                tab.remoteEntry = addonBaseURL ? `${addonBaseURL+tab.remoteName}.js` : tab.remoteEntry;
                return tab.title.toLowerCase() === this.route.snapshot.params['tab_id'];
        });
        this.tabs.forEach(tab => tab.remoteName === 'settings_iframe' ? tab.path = this.getIframePath(tab.title.toLowerCase(), res?.ATD ) : null);

        if (this.type === 'accounts'){
            this.tabs = this.tabs.filter((tab, i) => {
                tab.index = i;
                if (tab?.title == 'Workflows') this.workflowTab = tab;
                else return tab;
            });
        }

        this.hostObject['options'] = this.activeTab;
        this.atd = res?.ATD;
        this.hostObject.objectList.push(res?.ATD?.UUID);
      });

    }

    getAtd() {
      return this.http.getPapiApiCall(`/meta_data/${this.route.snapshot.params.type}/types/${this.route.snapshot.params['type_id']}`).subscribe(atd => {
          this.tabs.forEach(tab => tab.remoteName === 'settings_iframe' ? tab.path = this.getIframePath(tab.title.toLowerCase(), atd ) : null);
          this.atd = atd;
          return atd;
      });
    }

    getIframePath(tabName, atd) {
        let URI = `Views/Agents/${this.typesEnum[this.type]}Types.aspx?objectUUID=${atd.InternalID}&tabName=${tabName.toUpperCase()}`;
        URI += `&name=${atd.ExternalID}&description=${atd.Description}&icon_name=${atd.Icon}`;
        return URI;
    }

    openErrorDialog(error){
        const title = this.translate.instant('MESSAGES.TITLE_NOTICE');
        const data = new PepDialogData({
            title,
            content: error?.fault?.faultstring || error
        });
        this.dialogService.openDefaultDialog(data);
    }

    onAddonChange(e){
        switch (e?.msgName){
            case 'general-save':
                this.getAtd();
                break;
            case 'account-types-config':
                if (e?.configuration?.workflowV2){
                    this.tabs.splice(this.workflowTab?.index, 0, this.workflowTab);
                }
                break;
            case 'content-loaded' :  //HOSTEVENTS, OUTPUT FROM REMOTE LOADER
                this._Tabs._tabs.toArray().forEach(tab =>  tab.disabled = false)                 
                break;
            //case 'done-loading' :  
            //    this._Tabs._tabs.toArray().forEach(tab =>  tab.disabled = false)                 
            //    break;
            default: break; 
        }

    }

    tabClick(e){
        const currentTabKey = this.activeTab?.title;
        //const selectedTab: RemoteModuleOptions = this.activeTab ? this.tabs.find(tab => tab?.title === e?.tab?.textLabel): this.tabs[this.tabs?.length-1];

        let selectedTab: RemoteModuleOptions = this.tabs[e.index];
        
        
        this.hostObject['options'] = selectedTab;

        if (selectedTab?.remoteName === 'settings_iframe'){
            const addonInstance = this.addonProxy['compRef']?.instance;
            const iframeWindow =  addonInstance?.settingsIframe?.nativeElement?.contentWindow;
            iframeWindow?.postMessage({msgName: 'tabClick', tabName: selectedTab.title.toLowerCase()}, '*');
        }
        if (selectedTab && selectedTab?.title !== currentTabKey){
            // this.cd.detectChanges();
            if (selectedTab.uuid === this.activeTab.uuid){
                //selectedTab.update = true;
            }

            if (this.activeTab?.remoteName !== selectedTab?.remoteName){

                if(selectedTab?.remoteName !== 'settings_iframe'){
                    //do not lock tabs
                    this._Tabs._tabs.toArray().forEach(tab =>  tab.disabled = false)
                }else{
                    this._Tabs._tabs.toArray().forEach(tab =>  tab.disabled = true)
                }

                this.activeTab = null;
                // this.cd.detectChanges();
                this.activeTab = selectedTab;
            }
            this.activeTabIndex = e.index;

            this.hostObject['options'] = selectedTab;

            this.router.navigate([`../${selectedTab.title.toLowerCase()}`],
            { relativeTo: this.route});
        }            
        
    }

    goBack(){
        this.router.navigate(['../../'],
            {
                // queryParams: {legacy_preload: false},
                relativeTo: this.route
            } );
    }

    initFromServer(addonUUID, type, typeID): Promise<any[]> {
        const body = {
                        RelationName: `${relationTypesEnum[type]}TypeListTabs`,
                        TypeID: typeID,
                        Type: type
                    };
        // debug locally
        // return this.http.postHttpCall('http://localhost:4500/api/relations', body)
        return this.http.postPapiApiCall(`/addons/api/${addonUUID}/api/relations`, body)
                    .toPromise();
    }

  
}
