import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { PepSessionService } from '@pepperi-addons/ngx-lib';

import { filter } from 'rxjs/operators';
import { config } from '../addon.config';

@Injectable({ providedIn: 'root' })
export class NavigationService {
    private history: string[] = []

    private _addonUUID = '';
    get addonUUID(): string {
        return this._addonUUID;
    }

    private _devServer = false;
    get devServer(): boolean {
        return this._devServer;
    }

    private _devBlocks: Map<string, string>; // Map<Component name, Host name>
    get devBlocks(): Map<string, string> {
        return this._devBlocks;
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private sessionService: PepSessionService
    ) {
        // Get the addonUUID from the root config.
        this._addonUUID = config.AddonUUID;
        this._devServer = this.route.snapshot.queryParamMap.get('devServer') === 'true';
        
        this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
            // const route: ActivatedRoute = this.getCurrentRoute(this.route);
            // this._devServer = route.snapshot.queryParamMap.get('devServer') === 'true';
            this.history.push(event.urlAfterRedirects);
        });
        
        this.loadDevBlocks();
    }

    private loadDevBlocks() {
        try {
            const devBlocksAsJSON = JSON.parse(this.route.snapshot.queryParamMap.get('devBlocks'));
            this._devBlocks = new Map(devBlocksAsJSON);
        } catch(err) {
            this._devBlocks = new Map<string, string>();
        }
    }

    getCurrentRoute(route: ActivatedRoute) {
        return {
            ...route,
            ...route.children.reduce((acc, child) =>
            ({ ...this.getCurrentRoute(child), ...acc }), {}) 
        };
    }

    // back(): Promise<boolean> {
    //     this.history.pop();
        
    //     if (this.history.length > 0) {
    //         this.history.pop();
    //     }
        
    //     const route: ActivatedRoute = this.getCurrentRoute(this.route);
    //     return this.router.navigate(['../'], {
    //         relativeTo: route,
    //         queryParamsHandling: 'merge'
    //     });
    // }

    getBaseUrl(fileName = 'api'): string {
        // For devServer run server on localhost.
        if(this.devServer) {
            return `http://localhost:4500/${fileName}`;
        } else {
            const baseUrl = this.sessionService.getPapiBaseUrl();
            return `${baseUrl}/addons/api/${this.addonUUID}/${fileName}`;
        }
    }

}
