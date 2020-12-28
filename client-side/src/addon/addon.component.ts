import { Component, OnInit } from '@angular/core';
import { PepCustomizationService, PepStyleType } from '@pepperi-addons/ngx-lib';

@Component({
    selector: 'addon-root',
    templateUrl: './addon.component.html',
    styleUrls: ['./addon.component.scss']
})
export class AddonComponent implements OnInit {

    footerHeight: number;

    showLoading = false;

    constructor(public customizationService: PepCustomizationService) {
    }

    ngOnInit() {
        this.customizationService.setThemeVariables();

        this.customizationService.footerHeight.subscribe(footerHeight => {
            this.footerHeight = footerHeight;
        });
    }

    getTopBarStyle() {
        return document.documentElement.style.getPropertyValue(PepCustomizationService.STYLE_TOP_HEADER_KEY) as PepStyleType;
    }

    navigateHome() {
        alert('Home');
    }

    getButtonClassName() {
        return this.getTopBarStyle() === 'strong' ? 'keep-background-on-focus' : 'invert';
    }

}
