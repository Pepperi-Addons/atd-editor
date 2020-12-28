import { Component, OnInit } from '@angular/core';
import { PepMenuItem } from '@pepperi-addons/ngx-lib/menu';

@Component({
  selector: 'atd-editor-behaviour',
  templateUrl: './behaviour.component.html',
  styleUrls: ['./behaviour.component.scss']
})
export class BehaviourComponent implements OnInit {

    menuItems: Array<PepMenuItem>;
    options: Array<PepMenuItem>;
  constructor() { }

  ngOnInit(): void {
    this.loadMenuItems();
    this.loadListChooser();
  }

  private loadMenuItems(): void {
    this.menuItems = this.getMenuItems();
}

  getMenuItems(): Array<PepMenuItem> {
    const menuItems: Array<PepMenuItem> = [
        { key: 'test1', text: 'test 1'},
        { key: 'test2', text: 'test 2', disabled: true },
        { key: 'sep', type: 'splitter' },
        { key: 'test3', text: 'test 3'}];

    return menuItems;
}

private loadListChooser(): void {
    this.options =  [
        { key: 'accounts', text: 'accounts'},
        { key: 'orders', text: 'orders'}
    ];
}

onListChange(event) {
}

onCustomizeFieldClick(event) {
}

selectedRowsChanged(selectedRowsCount) {
    // this.showListActions = selectedRowsCount > 0;
}

}
