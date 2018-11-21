import { Component} from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { SubscriptionPage} from "../subscription/subscription";

/**
 * Generated class for the PopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popup',
  templateUrl: 'popup.html',
})
export class PopupPage {
image:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController) {
    this.image = this.navParams.get("img");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PopupPage');
  }
  initiatePayment(){
      this.view.dismiss();
      //this.navCtrl.push(SubscriptionPage);
  }

}
