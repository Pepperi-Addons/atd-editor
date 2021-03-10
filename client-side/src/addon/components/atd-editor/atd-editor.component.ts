import { TranslateService } from '@ngx-translate/core';
import { PepDialogService, PepDialogData } from '@pepperi-addons/ngx-lib/dialog';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PepHttpService } from '@pepperi-addons/ngx-lib';


@Component({
  selector: 'addon-atd-editor',
  templateUrl: './atd-editor.component.html',
  styleUrls: ['./atd-editor.component.scss']
})
export class AtdEditorComponent implements OnInit {

    atd;
    tabs: Array<any>;
    activeTab;
    data = {atd: null, tab: null, addon: null};

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private http: PepHttpService,
      private dialogService: PepDialogService,
      private translate: TranslateService,
      private cd: ChangeDetectorRef
    ) {

    }

    async ngOnInit() {
      console.log('atd_editor ' + performance.now()/1000);
      const addonUUID = this.route.snapshot.params.addon_uuid;
      this.lookup(addonUUID).then(res =>{
           this.tabs = res;
           this.activeTab = this.tabs.find(tab => tab.Key === this.route.snapshot.params['tab_id']);
           this.getAtd();
           this.cd.detectChanges();
          });

    }

    getAtd() {
      return this.http.getPapiApiCall(`/meta_data/transactions/types/${this.route.snapshot.params['type_id']}`).subscribe(atd => {
          this.tabs.forEach(tab => tab.remoteName === 'settings_iframe' ? tab.path = this.getIframePath(tab.Key, atd ) : null);
          this.atd = atd;
          return atd;
      });
    }

    getIframePath(tabName, atd) {
    let URI = `Views/Agents/OrdersTypes.aspx?tranUUID=${atd.InternalID}&tabName=${tabName.toUpperCase()}`
    if (tabName === 'general'){
      URI += `&name=${atd.ExternalID}&description=${atd.Description}&icon_name=${atd.Icon}`;
    }
    return URI;
    }

    openErrorDialog(error){
    const title = this.translate.instant('MESSAGES.TITLE_NOTICE');
    const data = new PepDialogData({
        title,
        content: error?.fault?.faultstring
    });
    this.dialogService.openDefaultDialog(data);
    }

    getAddon(tab) {
        return this.http.getPapiApiCall(`/addons/installed_addons/${tab.AddonUUID}`);
    }

    tabClick(e){
        const currentTabKey = this.activeTab.Key;
        const selectedTab = this.tabs.find(tab => tab.Index === e.index.toString());
        if (selectedTab && selectedTab.Key !== currentTabKey){
            // this.cd.detectChanges();
            selectedTab.update = true;
            this.activeTab = selectedTab;
            this.router.navigate([`../${selectedTab.Key}`],
            { relativeTo: this.route});
        }
    }

    goBack(){
    this.router.navigate(['../../'], { relativeTo: this.route  } );
    }

    lookup(addonUUID): Promise<any[]> {
        const body = { DataViewName: "AtdEditor_Tabs" };
        // debug locally
        return this.http.postHttpCall('http://localhost:4500/api/lookup', body)
        // return this.http.postPapiApiCall(`/addons/api/${addonUUID}/api/lookup`, body)
                    .toPromise().then(tabs => tabs.filter(tab => tab.Type === "tabs").sort((x,y) => x['Index'] - y['Index']));
    }


}
