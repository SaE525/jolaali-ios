import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, ModalController } from 'ionic-angular';
import { StreamingMedia,StreamingAudioOptions } from '@ionic-native/streaming-media';
import { JolaaliServiceProvider} from "../../providers/jolaali-service/jolaali-service";
import { PopupPage} from "../popup/popup";
import { MusicControls } from '@ionic-native/music-controls';

/**
 * Generated class for the StoriesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-stories',
  templateUrl: 'stories.html',
})
export class StoriesPage {
  stories: any;
  storyData:{} ;
  subUrl: any;
  imageSrc: any;
  audiosrc:any
  subinfo:any;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public jolaaliservicceprovider: JolaaliServiceProvider,private streamingMedia: StreamingMedia,
              public popoverCtrl: PopoverController, public model: ModalController,public musicControls: MusicControls) {
    this.subinfo = JSON.parse(window.localStorage.getItem("Subscription"));
    console.log( this.subinfo );
    this.stories = this.navParams.get("storyData");
    this.subUrl = 'songListByCategoryId?cid=' + this.stories.category_id;
    this.jolaaliservicceprovider.jolaaliservice(this.subUrl).subscribe((data) => {
      if(Object.keys(data.songsList).length > 0) {
        this.imageSrc = this.navParams.get("imgpath");
        this.storyData = data.songsList;
        console.log(this.storyData)
      }
    }, err => {

    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoriesPage');
  }
  imagesrc(src){
    return this.imageSrc + src;
  }
  playsong(id,img){
    this.subUrl = 'songDownload?id=' + id;
    this.jolaaliservicceprovider.jolaaliservice(this.subUrl).subscribe((data) => {
      if (data.audio_path != '' && data.songDownload != '') {
        this.audiosrc = data.audio_path + data.songDownload;
        let options: StreamingAudioOptions = {
          successCallback: () => {
            console.log('Finished Audio')
          },
          errorCallback: (e) => {
            console.log('Error: ', e)
          },
          bgColor: 'yellow',
          bgImageScale: 'fit',
          keepAwake: true,
          bgImage: this.imageSrc + img,
          initFullscreen: false // iOS only!

        };

        //http://soundbible.com/2196-Baby-Music-Box.html
        this.streamingMedia.playAudio(this.audiosrc, options);
      }
    }, err => {

    })
  }
  openstory(id,img){
    if(this.subinfo.getSubscriptionInfo == 0 && this.stories.cat_type == 'paid'){
        const popover = this.model.create(PopupPage,{img:this.imageSrc +img},{enableBackdropDismiss	:true,showBackdrop:true});
        popover.present();
    }else {
      this.playsong(id,img);
    }
  }
}
