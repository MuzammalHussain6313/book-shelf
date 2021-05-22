import {Component, OnInit} from '@angular/core';
import {UtilsService} from '../../services/utils.service';
import {ActionSheetController, NavController, PopoverController} from '@ionic/angular';
import {RatingComponent} from './rating/rating.component';
import * as firebase from 'firebase';
import {ReviewService} from '../../services/review.service';

@Component({
    selector: 'app-book-detail',
    templateUrl: './book-detail.page.html',
    styleUrls: ['./book-detail.page.scss'],
})
export class BookDetailPage implements OnInit {

    book: any;

    constructor(public utils: UtilsService,
                public actionCtrl: ActionSheetController,
                public navCtrl: NavController,
                private reviewService: ReviewService,
                public popoverController: PopoverController) {
    }

    ngOnInit() {
        this.book = JSON.parse(localStorage.getItem('book'));
    }

    async moreOptions() {
        const alert = await this.actionCtrl.create({
            mode: 'ios',
            header: 'More Options !!!',
            cssClass: 'primary',
            buttons: [
                {
                    text: 'Feedback',
                    icon: 'pencil-sharp',
                    cssClass: 'secondary',
                    handler: () => {
                        this.giveFeedback();
                    }
                },
                {
                    text: 'Report',
                    icon: 'newspaper',
                    cssClass: 'danger',
                    handler: () => {
                        this.reviewService.bookKey = this.book.bookKey;
                        this.navCtrl.navigateForward(['/send-report']);
                    }
                },
                {
                    text: 'Cancel',
                    icon: 'backspace',
                    cssClass: 'primary',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        await alert.present();
    }

    async giveFeedback() {
        const review = await this.popoverController.create({
            component: RatingComponent,
            componentProps: {id: 1}
        });
        this.reviewService.bookKey = this.book.bookKey;
        return await review.present();
    }

    expandCLick() {
        this.book.show = !this.book.show;
    }

    openChat() {
        this.utils.presentToast('Chat is under development. Please contact us from your profile to get update');
    }

}
