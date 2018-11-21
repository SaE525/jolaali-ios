import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { JolaaliServiceProvider} from "../../providers/jolaali-service/jolaali-service";
import {StoriesPage} from "../stories/stories";

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  catagories: any;
  imageSrc: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public jolaaliserviceprovider: JolaaliServiceProvider) {

  this.jolaaliserviceprovider.jolaaliservice('/categoriesList').subscribe((data) => {
   console.log(data)
    this.catagories = data.categoriesList;
   this.imageSrc = data.image_path;
  },err => {

  })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HomePage');
  }

  getStories(data){
    this.navCtrl.push(StoriesPage,{'storyData':data,'imgpath':this.imageSrc});
  }

}
