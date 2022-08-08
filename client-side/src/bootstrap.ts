import { AddonModule } from './addon/addon.module';
import { environment } from './environments/environment';
import { bootstrap } from '@angular-architects/module-federation-tools';

bootstrap(AddonModule, {
    production: environment.production,
    appType: 'microfrontend' // Only if we have routes use this!!!
});