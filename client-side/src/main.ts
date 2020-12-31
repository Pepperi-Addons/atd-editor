
import { enableProdMode, NgZone } from '@angular/core';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Router } from '@angular/router';
import { ɵAnimationEngine as AnimationEngine } from '@angular/animations/browser';

import { singleSpaAngular, getSingleSpaExtraProviders } from 'single-spa-angular';
import { AddonModule } from './addon/addon.module';
import { environment } from './environments/environment';
import { singleSpaPropsSubject } from './single-spa/single-spa-props';
import * as config from '../../addon.config.json'
if (environment.production) {
    enableProdMode();
}

// let lifecycles = null;

// if (config.Client.Mode === 'Standalone') {
//     platformBrowserDynamic().bootstrapModule(AddonModule)
//     .catch(err => console.error(err));
// }

// else {
  const   lifecycles = singleSpaAngular({
        bootstrapFunction: singleSpaProps => {
            singleSpaPropsSubject.next(singleSpaProps);
            return platformBrowserDynamic(getSingleSpaExtraProviders()).bootstrapModule(AddonModule);
        },
        template: '<addon-root />',
        Router,
        NgZone,
        AnimationEngine,
    });


// }

// export const bootstrap = config.Client.Mode === 'Standalone' ? '' : lifecycles.bootstrap;
// export const mount = config.Client.Mode === 'Standalone' ? '' : lifecycles.mount;
// export const unmount = config.Client.Mode === 'Standalone' ? '' : lifecycles.unmount;

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
export const update = lifecycles.update;
