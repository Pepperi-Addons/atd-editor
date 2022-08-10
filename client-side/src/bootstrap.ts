import { AppModule } from './addon/app.module';
import { environment } from './environments/environment';
import { bootstrap } from '@angular-architects/module-federation-tools';

bootstrap(AppModule, {
    production: environment.production,
    appType: 'microfrontend' // Only if we have routes use this!!!
});