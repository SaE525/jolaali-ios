import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';


import { MyprofilePage} from "../pages/myprofile/myprofile";
import { ChangepasswordPage} from "../pages/changepassword/changepassword";
import { SubscriptionPage} from "../pages/subscription/subscription";
import { HomePage} from "../pages/home/home";
import { FeedbackPage} from "../pages/feedback/feedback";
import { TabsPage } from '../pages/tabs/tabs';
import { SignupPage} from "../pages/signup/signup";
import { LoginPage} from "../pages/login/login";
import { ForgotpasswordPage} from "../pages/forgotpassword/forgotpassword";
import { StoriesPage} from "../pages/stories/stories";
import { PopupPage} from "../pages/popup/popup";
import { PaymentPage} from "../pages/payment/payment";

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {HttpModule} from '@angular/http';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PayPal } from '@ionic-native/paypal';
import { StreamingMedia } from '@ionic-native/streaming-media';
import { JolaaliServiceProvider } from '../providers/jolaali-service/jolaali-service';
import { Stripe } from '@ionic-native/stripe';
import { MusicControls } from '@ionic-native/music-controls';
import {CurrencyPipe} from '@angular/common';

@NgModule({
  declarations: [
    MyApp,
    MyprofilePage,
    ChangepasswordPage,
    SubscriptionPage,
    HomePage,
    FeedbackPage,
    TabsPage,
    SignupPage,
    LoginPage,
    ForgotpasswordPage,
    StoriesPage,
    PopupPage,
    PaymentPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    MyprofilePage,
    ChangepasswordPage,
    SubscriptionPage,
    HomePage,
    FeedbackPage,
    TabsPage,
    SignupPage,
    LoginPage,
    ForgotpasswordPage,
    StoriesPage,
    PopupPage,
    PaymentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    JolaaliServiceProvider,
    HttpClientModule,
    PayPal,
    StreamingMedia,
    Stripe,
    MusicControls,
    CurrencyPipe,
    {provide: ErrorHandler, useClass: IonicErrorHandler}

  ]
})
export class AppModule {}
