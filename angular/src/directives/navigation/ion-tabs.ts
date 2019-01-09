import { Component, ContentChild, HostListener, ViewChild } from '@angular/core';

import { NavController } from '../../providers/nav-controller';
import { IonTabBar } from '../proxies';

import { IonRouterOutlet } from './ion-router-outlet';
import { RouteView } from './stack-utils';

@Component({
  selector: 'ion-tabs',
  template: `
    <ng-content select="[slot=top]"></ng-content>
    <div class="tabs-inner">
      <ion-router-outlet #outlet tabs="true"></ion-router-outlet>
    </div>
    <ng-content></ng-content>`,
  styles: [`
    :host {
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      flex-direction: column;

      width: 100%;
      height: 100%;

      contain: layout size style;
      z-index: $z-index-page-container;
    }
    .tabs-inner {
      position: relative;

      flex: 1;

      contain: layout size style;
    }`
  ]
})
export class IonTabs {

  @ViewChild('outlet', { read: IonRouterOutlet }) outlet: IonRouterOutlet;
  @ContentChild(IonTabBar) tabBar: IonTabBar | undefined;

  constructor(
    private navCtrl: NavController,
  ) {}

  @HostListener('ionRouterOutletActivated', ['$event.detail'])
  onPageSelected(detail: {view: RouteView}) {
    if (this.tabBar) {
      this.tabBar.selectedTab = detail.view.stackId;
    }
  }

  @HostListener('ionTabButtonClick', ['$event.detail.tab'])
  select(tab: string) {
    const selected = this.outlet.getActiveStackId() === tab;
    const href = `${this.outlet.tabsPrefix}/${tab}`;
    const url = selected
      ? href
      : this.outlet.getLastUrl(tab) || href;

    return this.navCtrl.navigateRoot(url, {
      animated: true,
      animationDirection: 'back'
    });
  }
}
