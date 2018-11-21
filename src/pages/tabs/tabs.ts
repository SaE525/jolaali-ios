import { Component } from '@angular/core';

import { MyprofilePage} from "../myprofile/myprofile";
import { ChangepasswordPage} from "../changepassword/changepassword";
import { SubscriptionPage} from "../subscription/subscription";
import { HomePage} from "../home/home";
import { FeedbackPage} from "../feedback/feedback";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab2Root = MyprofilePage;
  tab3Root = ChangepasswordPage;
  tab4Root = SubscriptionPage;
  tab1Root = HomePage;
  tab5Root = FeedbackPage

  constructor() {

  }
}
