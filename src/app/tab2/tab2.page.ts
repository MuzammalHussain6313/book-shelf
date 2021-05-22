import {Component, OnInit} from '@angular/core';
import {ActionSheetController, AlertController, NavController} from '@ionic/angular';
import {DataCollectorService} from '../services/data-collector.service';
import {UtilsService} from '../services/utils.service';
import {UserService} from '../services/user.service';
import {ReviewService} from '../services/review.service';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

    required = true;
    donated = false;
    myDonatedBooks: any = [];
    myRequiredBooks: any = [];
    user: any;

    constructor(private actionCtrl: ActionSheetController,
                private dataCollector: DataCollectorService,
                private alertCtrl: AlertController,
                private utils: UtilsService,
                public userService: UserService,
                public reviewService: ReviewService,
                private navCtrl: NavController) {
    }

    ngOnInit() {
        this.user = this.userService.getUser();
        if (this.user) {
            this.loadData(this.user.uid);
        } else {
            this.utils.presentToast('An error occurred while getting Your book');
        }
    }

    loadData(uid) {
        this.dataCollector.getUserBooks(uid);
        this.dataCollector.getValue().subscribe(data => {
            this.myDonatedBooks = this.dataCollector.myDonatedBooks;
            this.myRequiredBooks = this.dataCollector.myRequiredBooks;
            console.log('my donated book', this.myDonatedBooks);
            console.log('my required books', this.myRequiredBooks);
        });
    }

    segmentChanged($event: CustomEvent) {
        this.required = !this.required;
        this.donated = !this.donated;
    }

    expandCLick(book) {
        book.show = !book.show;
    }

    async moreOptions(book) {
        const alert = await this.actionCtrl.create({
            mode: 'ios',
            header: 'More Options !!!',
            cssClass: 'primary',
            buttons: [
                {
                    text: 'Edit',
                    icon: 'pencil-sharp',
                    cssClass: 'primary',
                    handler: () => {
                        // this.navCtrl.navigateForward(['']);
                    }
                },
                {
                    text: 'Delete',
                    icon: 'trash-outline',
                    cssClass: 'danger',
                    handler: () => {
                    }
                },
                {
                    text: 'Messages',
                    icon: 'mail',
                    cssClass: 'primary',
                    handler: () => {
                        // this.navCtrl.navigateForward(['']);
                    }
                },
                {
                    text: 'Reports',
                    icon: 'chatbox',
                    cssClass: 'primary',
                    handler: () => {
                        this.reviewService.bookKey = book.bookKey;
                        this.navCtrl.navigateForward(['/reports']);
                    }
                },
                {
                    text: 'Reviews',
                    icon: 'list',
                    cssClass: 'primary',
                    handler: () => {
                        this.reviewService.bookKey = book.bookKey;
                        this.navCtrl.navigateForward(['/reviews']);
                    }
                },
                {
                    text: 'Cancel',
                    icon: 'backspace',
                    cssClass: 'primary',
                    role : 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });
        await alert.present();
    }

    //
    // async deleteUser(user) {
    //     const alert = await this.alertCtrl.create({
    //         header: 'Are You sure to delete this user?',
    //         buttons: [
    //             {
    //                 text: 'Cancel',
    //                 cssClass: 'primary',
    //                 handler: () => {}
    //             },
    //             {
    //                 text: 'OK',
    //                 cssClass: 'primary',
    //                 handler: () => {
    //
    //                     firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    //                         .then((info) => {
    //                             const fuser: any = firebase.auth().currentUser;
    //                             fuser.delete();
    //                             this.deleteFromDatabase(user);
    //                         }).catch(err => console.log(err));
    //                 }
    //             }
    //         ]
    //     });
    //     alert.present();
    // }
    //
    // deleteFromDatabase(user) {
    //     firebase.database().ref(`/users`).child(user.uid).remove()
    //         .then(res => {
    //             console.log(res);
    //             this.utils.presentToast('User have been deleted successfully...');
    //         }).catch(err => console.log(err));
    // }
    //
    // searchStudents() {
    //     if (this.studentSearch) {
    //         this.filteredStudents = this.search(this.studentSearch, this.students);
    //     } else {
    //         this.filteredStudents = this.students;
    //     }
    // }
    //
    // searchTeachers() {
    //     if (this.facultySearch) {
    //         this.filteredTeachers = this.search(this.facultySearch, this.teachers);
    //     } else {
    //         this.filteredTeachers = this.teachers;
    //     }
    // }
    //
    // clearSearch() {
    //     this.studentSearch = '';
    //     this.filteredStudents = this.students;
    //     this.facultySearch = '';
    //     this.filteredTeachers = this.teachers;
    // }
    //
    // addUser() {
    //     this.navCtrl.navigateForward(['/add-user']);
    // }
    addBook() {
        this.navCtrl.navigateForward(['/add-book']);
    }
}

