import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal';
import { JolaaliServiceProvider} from "../../providers/jolaali-service/jolaali-service";
import { Http } from '@angular/http';
import {HomePage} from "../home/home";
import { PaymentPage} from "../payment/payment";
import { CurrencyPipe } from '@angular/common';

/**
 * Generated class for the SubscriptionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-subscription',
  templateUrl: 'subscription.html',
})
export class SubscriptionPage {
  content: Array<any>;
  selection: any = false;
  plan:any;
  subscription:any;
  createsuburl:any;
  coupanUrl:any;
  block:any;
  coupanPrice:any;
  text = "SUBSCRIBE";
  promoCode:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public paypal: PayPal,
              public jolaali: JolaaliServiceProvider, public alert: AlertController, public http: Http,
              private cp: CurrencyPipe) {
    this.jolaali.jolaaliservice('getplansinfo?country='+JSON.parse(window.localStorage.getItem('userData')).country).subscribe((data) =>{
      this.content = data.getplansinfo;
      this.subscription = JSON.parse(window.localStorage.getItem('Subscription'));
      this.block = this.subscription.getSubscriptionInfo.plan_id;
      this.selection = this.subscription.getSubscriptionInfo.plan_id;
      if(this.block){
        this.text = "UPGRADE"
      }
      console.log(this.selection)
    })
    this.http.request('http://icanhazip.com/')
      .subscribe(response => {
        console.log(response.text());
        window.localStorage.setItem('ip',response.text());
      })
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubscriptionPage');
  }
  subscribe(){
    if(this.selection) {
      //console.log(this.selection)
    } else{

    }
  }

  coupanAlert(content){
    var confirmCoupan = this.alert.create({
      title: 'Jo Laali',
      message: content,
      buttons: [{
        text: 'OK',
        handler: data => {

        }
      }]
    });
    confirmCoupan.present();
  }

  validatePromo(){
    this.coupanUrl = "validate_promocode?uid=" + JSON.parse(window.localStorage.getItem("userData")).userId +
      "&pid=" + this.plan.plan_id + "&promo=" + this.promoCode;
    this.jolaali.jolaaliservice(this.coupanUrl).subscribe((data) => {
      console.log(data);
      if(data.promo_status == 'Valid promocode') {
        this.coupanPrice = this.plan.price - (this.plan.price / 100) * this.plan.discount;
        this.coupanAlert('Congratulations ! Promo Code accepted. Your total billable amount after discount is ' + this.cp.transform(this.coupanPrice, this.plan.country)+' Please proceed to subscribe');
        console.log(this.coupanPrice);
      } else{
        this.coupanAlert(data.promo_status);
      }
    })
  }

  paymentalert(fields,status){
    var confirm = this.alert.create({
      title: 'Jo Laali',
      message: fields,
      buttons: [{
        text: 'OK',
        handler: data => {
        if(status == 0){
          this.navCtrl.push(HomePage);
        }
        }
      }]
    });
    confirm.present();
  }
  store(data){
    this.plan = data;
    //console.log(typeof this.plan.plan_id);
  }
  initiatePayment() {

    if (this.selection == this.block) {
      return;
    } else {
      // this.navCtrl.push(PaymentPage);

      this.paypal.init({
        PayPalEnvironmentProduction: 'Aaq7NotM4YISK7o2wSjqwe5OHTH3Nv7c3NKTjzxJlZhlarWuNAXORLK0L1mluXdiFxErqOaCda0e0Opc',
        PayPalEnvironmentSandbox: 'AWVgjXPaR9g4MoHawng2O1LXrOm5El52aEeZYh945Tvl7IprkLjrIexx9f8Nx23AWsEqwtrimVk-5iFz'
      }).then(() => {
        let payment = new PayPalPayment(this.coupanPrice ? this.coupanPrice : this.plan.price, this.plan.country,this.plan.description, 'sale');
        // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
        this.paypal.prepareToRender('PayPalEnvironmentProduction', new PayPalConfiguration({
          // Only needed if you get an "Internal Service Error" after PayPal login!
          //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
        })).then(() => {


          this.paypal.renderSinglePaymentUI(payment).then((data) => {
            console.log(data);
            if (data.response.state == 'approved') {

              var start = data.response.create_time.replace("T", " ");
              var fst = start.replace("Z", "");

              var current = new Date();
              current.setMonth(current.getMonth() + JSON.parse(this.plan.months));
              var end = current.toISOString();
              var et = end.replace("T", " ");
              var fet = et.replace("Z", "");
              var ett = fet.slice(0, -4);


              this.createsuburl = "createSubscription?pid=" + this.plan.plan_id +
                "&uid=" + JSON.parse(window.localStorage.getItem("userData")).userId +
                "&mstatus=Y&price=" + this.plan.price + "&sdate=" + fst + "&edate=" + ett +
                "&ip=" + window.localStorage.getItem('ip') +
                "&country=" + JSON.parse(window.localStorage.getItem("userData")).country +
                "&address1=" + JSON.parse(window.localStorage.getItem("userData")).address1 +
                "&address2=" + JSON.parse(window.localStorage.getItem("userData")).address2 +
                "&city=" + JSON.parse(window.localStorage.getItem("userData")).city +
                "&state=" + JSON.parse(window.localStorage.getItem("userData")).state +
                "country1=" + JSON.parse(window.localStorage.getItem("userData")).country1 +
                "&zipcode=" + JSON.parse(window.localStorage.getItem("userData")).zipcode +
                "&promocode=" + this.coupanPrice ? this.promoCode : '';
              this.jolaali.jolaaliservice(this.createsuburl).subscribe((data) => {
                if (data.subscriptionStatus == "Success") {
                  this.jolaali.jolaaliservice('getSubscriptionInfo?id=' + JSON.parse(window.localStorage.getItem("userData")).userId).subscribe((res) => {
                    console.log(res);
                    window
                      .localStorage
                      .setItem("Subscription", JSON.stringify(res));
                    this.paymentalert('Subscribed for ' + this.plan.description + ' Successfully', 0);
                  })
                }
              })
            }
          }, (err) => {
            console.log(err);
            this.paymentalert('We cannot process your payment. Please try after sometime.', 1);
            console.log("dialog closed without being successful");
            // Error or render dialog closed without being successful
          });
        }, () => {
          this.paymentalert('Payment was not Successful. Please try again.', 1);
          console.log("err in config");
          // Error in configuration
        });
      }, () => {
        this.paymentalert('Unable to load payment gateway. Please try after sometime.', 1);
        console.log("err in init");
        // Error in initialization, maybe PayPal isn't supported or something else
      });

    }

  }


}
