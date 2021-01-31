import { TranslateService } from '@ngx-translate/core';
import { PepDialogService, PepDialogData } from '@pepperi-addons/ngx-lib/dialog';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PepHttpService } from '@pepperi-addons/ngx-lib';
import { AtdEditorTabs } from './atd-editor.model';
import { Location } from '@angular/common';
import { ModuleOptions } from '@pepperi-addons/ngx-remote-loader';
import { stringify } from '@angular/compiler/src/util';
import { singleSpaPropsSubject } from 'src/single-spa/single-spa-props';

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
    private translate: TranslateService
    ) {

   }

  async ngOnInit() {
    console.log('atd_editor ' + performance.now()/1000);
    this.tabs = await this.lookup();
    singleSpaPropsSubject.subscribe(props =>{
        this.getAtd(props['addon']);
        // this.tabs = await this.getTabs();
        this.activeTab = this.tabs.find(tab => tab.Key === this.route.snapshot.params['tab_id']);
    });

  }

  getAtd(addon = null) {
    return this.http.getPapiApiCall(`/meta_data/transactions/types/${this.route.snapshot.params['type_id']}`).subscribe(
        (atd) => {this.data = {
            atd: atd,
            tab: this.route.snapshot.params['tab_id'],
            addon: addon
        }},
        (error) => this.openErrorDialog(error),
        () => {});
  }

  openErrorDialog(error){
    const title = this.translate.instant('MESSAGES.TITLE_NOTICE');
    const data = new PepDialogData({
        title,
        content: error?.fault?.faultstring
    });
    this.dialogService.openDefaultDialog(data);
  }

  getTabs() {
    return this.http.getPapiApiCall(`/addons/data/${this.route.snapshot.params.addon_uuid}/tabs?where=Type=tabs`)
            .toPromise().then(tabs => tabs.sort((x,y) => x.Index - y.Index));
  }

  getAddon(tab) {
      return this.http.getPapiApiCall(`/addons/installed_addons/${tab.UUID}`);
  }

  tabClick(e){
        const currentTabKey = this.activeTab.Key;
        const selectedTab = this.tabs.find(tab => tab.Index === e.index);
        if (selectedTab.Key !== currentTabKey){
            this.router.navigate([`../${selectedTab.Key}`],
            { relativeTo: this.route});
        }
  }

  goBack(){
    this.router.navigate(['../../'], { relativeTo: this.route  } );
  }

  lookup(): Promise<ModuleOptions[]> {
    return Promise.resolve([
        {
            remoteEntry: 'http://localhost:4404/settings-iframe.umd.js',
            exposedModule: 'SettingsIframeModule',
            componentName: 'SettingsIframeComponent',
            AddonUUID: "04de9428-8658-4bf7-8171-b59f6327bbf1",
            Editor: "transaction_types/ATD_ID/general",
            Index: 0,
            Key: "general",
            Title: "General",
            Type: "tabs"
        },
            {
                remoteEntry: 'http://localhost:4404/settings-iframe.umd.js',
                exposedModule: 'SettingsIframeModule',
                componentName: 'SettingsIframeComponent',
                AddonUUID: "04de9428-8658-4bf7-8171-b59f6327bbf1",
                Editor: "transaction_types/ATD_ID/views",
                Index: 1,
                Key: "views",
                Title: "Views",
                Type: "tabs"
            },
            {
                remoteEntry: 'http://localhost:4404/settings-iframe.umd.js',
                exposedModule: 'SettingsIframeModule',
                componentName: 'SettingsIframeComponent',
                AddonUUID: "04de9428-8658-4bf7-8171-b59f6327bbf1",
                Editor: "transaction_types/ATD_ID/accounts",
                Index: 2,
                Key: "accounts",
                Title: "Accounts",
                Type: "tabs"
            }
    ] as ModuleOptions[] &  any[] ).then(tabs => tabs.sort((x,y) => x['Index'] - y['Index']));
}

}
