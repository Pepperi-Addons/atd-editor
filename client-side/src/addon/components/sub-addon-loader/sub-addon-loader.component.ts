import { SubAddonLoaderService } from './sub-addon-loader.service';
import { BackofficeIframeModule } from './../atd-editor/backoffice-iframe/backoffice-iframe.module';
import { BackofficeIframeComponent } from './../atd-editor/backoffice-iframe/backoffice-iframe.component';
import { Compiler,
    Component,
    Injector,
    OnInit,
    ViewChild,
    ViewContainerRef,
    ɵrenderComponent as renderComponent,
    ɵcreateInjector as createInjector,
    NgModuleFactory,
    ComponentFactoryResolver,
    Type,
    ComponentFactory,
    SystemJsNgModuleLoader} from '@angular/core';

@Component({
  selector: 'addon-sub-addon-loader',
  template: '<ng-container #anchor></ng-container>'
})
export class SubAddonLoaderComponent  {

    @ViewChild('anchor', { read: ViewContainerRef }) anchor: ViewContainerRef;
    componentFactories: ComponentFactory<any>[];

    constructor(private compiler: Compiler, private injector: Injector,
            private service: SubAddonLoaderService) {
        // this.load();
     }

    async load(){
        this.service.setModules();
        const module = await this.service.load('http://localhost:4401/editor.plugin.bundle.js');
        const moduleFactory = await this.loadModuleFactory(module);
        const moduleRef = moduleFactory.create(this.injector);
        const componentProvider = moduleRef.injector.get('plugins');

        //from plugins array load the component on position 0
        const componentFactory = moduleRef.componentFactoryResolver
            .resolveComponentFactory<any>(
                componentProvider[0][0].component
            );
        const entryComponent = (moduleFactory as any).entry;
        const compFactory = moduleRef.componentFactoryResolver.resolveComponentFactory(entryComponent);
        this.anchor.clear();
        this.anchor.createComponent(compFactory);
    }



    // async loadComponent() {
    //  this.componentFactories = [];
    //   const { BackofficeIframeModule } = await import('../atd-editor/backoffice-iframe/backoffice-iframe.module');
    //   const moduleFactory = await this.loadModuleFactory(BackofficeIframeModule);
    //   const factory = this.moduleRef.componentFactoryResolver.resolveComponentFactory(BackofficeIframeComponent);
    //   this.anchor.clear();
    //   this.anchor.createComponent(factory);
    // }

    private async loadModuleFactory(t: any) {
      if (t instanceof NgModuleFactory) {
        return t;
      } else {
        return await this.compiler.compileModuleAsync(t);
      }
    }

    private loadModule(moduleType: Type<any>) {
        this.anchor.clear();
        const moduleFactories = this.compiler.compileModuleAndAllComponentsSync(moduleType);
        this.componentFactories = moduleFactories.componentFactories;
    }

}
