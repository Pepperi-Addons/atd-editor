import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackofficeIframeComponent } from './backoffice-iframe.component';
import { SafePipe } from 'src/addon/pipes/safe.pipe';



@NgModule({
        declarations: [BackofficeIframeComponent, SafePipe],
        imports: [CommonModule],
        exports: [BackofficeIframeComponent]
})
export class BackofficeIframeModule { }
