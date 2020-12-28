import { TranslateService } from '@ngx-translate/core';
import { PepDialogService, PepDialogData } from '@pepperi-addons/ngx-lib/dialog';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PepHttpService } from '@pepperi-addons/ngx-lib';
import { AtdEditorTabs } from './atd-editor.model';
import { Location } from '@angular/common';


@Component({
  selector: 'addon-atd-editor',
  templateUrl: './atd-editor.component.html',
  styleUrls: ['./atd-editor.component.scss']
})
export class AtdEditorComponent implements OnInit {

  atd;
  tabs: Array<any>;
  activeTab;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: PepHttpService,
    private dialogService: PepDialogService,
    private translate: TranslateService

    ) {

   }

  async ngOnInit() {
    this.getAtd();
    this.tabs = await this.getTabs();
    this.activeTab = this.tabs.find(tab => tab.Key === this.route.snapshot.params['tab_id']);
  }

  getAtd() {
    return this.http.getPapiApiCall(`/meta_data/transactions/types/${this.route.snapshot.params['type_id']}`).subscribe(
        (atd) => this.atd = atd,
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

  tabClick(e){
        const currentTabKey = this.activeTab.Key;
        const selectedTab = this.tabs.find(tab => tab.Index === e.index);
        if (selectedTab.Key !== currentTabKey){
            this.router.navigate([`../${selectedTab.Key}`],
            { relativeTo: this.route });
        }
  }

  goBack(){
    this.router.navigate(['../../'], { relativeTo: this.route  } );
  }

}
