import { Compiler, Component, Input, OnInit, Output, ElementRef, OnDestroy, HostListener, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router,  } from '@angular/router';
import { Location  } from '@angular/common';
import { Subscription, SubscriptionLike } from 'rxjs';
import { PepHttpService} from '@pepperi-addons/ngx-lib';

@Component({
  selector: 'atd-editor-backoffice-iframe',
  templateUrl: './backoffice-iframe.component.html',
  styleUrls: ['./backoffice-iframe.component.scss']
})
export class BackofficeIframeComponent implements OnInit {

    iframeCookieVersionSrc;
    iframeSRC;

    @Input() atd;

    @Output() atdChange: EventEmitter<any> = new EventEmitter();

    @HostListener('window:message', ['$event']) onPostMessage(event) {
      if (event?.data?.msgName === 'general-save' || event?.data[0]?.msgName === 'general-save'){
          this.atdChange.emit(event.data);
      }
    }

    constructor(
      public http: PepHttpService
      , public route: ActivatedRoute

      ) {}

    async ngOnInit() {
        const newStudioURL = await this.http.getPapiApiCall('/configuration_fields?key=NewStudioUrl').toPromise();
        this.setCookieIframeSrc(newStudioURL).then( success => this.setIframeSrc(newStudioURL));
    }

    async setCookieIframeSrc(newStudioURL){
        return this.http
            .getPapiApiCall('/addons/installed_addons/354c5123-a7d0-4f52-8fce-3cf1ebc95314')
                .toPromise().then(legacySettingsAddon =>
                    this.iframeCookieVersionSrc =  newStudioURL.Value +  `/cookieVersion.html?ver=${legacySettingsAddon.Version}`);
    }

    setIframeSrc(newStudioURL){
        const tabName = this.route.snapshot.params.tab_id;
        let tempSrc = newStudioURL.Value + '/' + this.getIframePath(tabName, this.atd);
        const signToadd = tempSrc.indexOf('?') > -1 ? '&' : '?';
        tempSrc += signToadd + 'webAppIframe=true';
        this.iframeSRC = decodeURI(tempSrc);
    }

    getIframePath(tabName, atd) {
      let URI = `Views/Agents/OrdersTypes.aspx?tranUUID=${atd.InternalID}&tabName=${tabName.toUpperCase()}`
      if (tabName === 'general'){
        URI += `&name=${atd.ExternalID}&description=${atd.Description}&icon_name=${atd.Icon}`;
      }
      return URI;
    }

}
