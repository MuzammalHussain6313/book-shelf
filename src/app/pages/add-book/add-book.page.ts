import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Camera, CameraOptions} from '@ionic-native/camera/ngx';
import * as firebase from 'firebase';
import {LoadingController, NavController} from '@ionic/angular';
import {User} from '../../models/user';
import {UserService} from '../../services/user.service';
import {UtilsService} from '../../services/utils.service';


@Component({
    selector: 'app-add-book',
    templateUrl: './add-book.page.html',
    styleUrls: ['./add-book.page.scss'],
})
export class AddBookPage implements OnInit {

    showPriceForm = false;
    isFree = false;
    types: string[] = ['Fiction', 'Nonfiction', 'Novel', 'Poetry'];
    bookForm: FormGroup;
    picture: any;
    user: User;
    uid: string;
    length: number;
    index: number;

    constructor(private formBuilder: FormBuilder,
                private loadingCtrl: LoadingController,
                private navCtrl: NavController,
                private userService: UserService,
                public utils: UtilsService,
                private camera: Camera) {
    }

    ngOnInit() {
        this.user = this.userService.getUser();
        this.formInitializer();
    }

    formInitializer() {
        this.bookForm = this.formBuilder.group({
            name: [null, [Validators.required]],
            author: ['', [Validators.required]],
            publishDate: ['', [Validators.required]],
            type: ['', [Validators.required]],
            picture: [this.picture, [Validators.required]],
            purpose: [null, [Validators.required]],
            summary: [null, [Validators.required]],
            price: [null]
        });
    }

    typeChanged(event) {
        const purpose = event.detail.value;
        if (purpose === 'Donation') {
            this.showPriceForm = true;
        } else {
            this.showPriceForm = false;
        }
    }

    isFreeChanged(event) {
        const free = event.detail.value;
        if (free === 'NO') {
            this.isFree = true;
        } else {
            this.isFree = false;
        }
    }

    async addBook() {
        this.utils.presentLoading('please wait...');
        const data = this.bookForm.value;
        if (this.isFree === true && data.purpose === 'Required') {
            data.price = 0;
        }
        const name: string = Date.now().toString() + '.jpg';
        firebase.storage().ref(`/bookImages/${name}`)
            .putString(data.picture, firebase.storage.StringFormat.DATA_URL).then((snapshot) => {
            firebase.storage().ref(`/bookImages/` + snapshot.metadata.name)
                .getDownloadURL().then(urL => {
                this.addBookToRealTime(Date.now().toString(), data, urL);
            }).catch(err => {
                alert(err);
            });
        }).catch(err => {
            alert(err);
        });
    }

    async addBookToRealTime(uid, data, url) {
        this.utils.presentLoading('please wait...');
        console.log('data', data);
        const ref = 'books-' + this.user.uid;
        const key = firebase.database().ref('/books').push().key;
        firebase.database().ref(`${ref}/${key}`).set({
            name: data.name,
            image: url,
            publishDate: data.publishDate,
            author: data.author,
            time: Date.now(),
            type: data.type,
            purpose: data.purpose,
            summary: data.summary,
            bookKey: key,
            uid: this.user.uid,
            price: data.price,
        }).then(res => {
            this.updateBookList(url, key);
            this.navCtrl.back();
        }).catch(err => {
            alert(err);
        });
    }

    updateBookList(url, key) {
        this.utils.presentLoading('please wait...');
        const data = this.bookForm.value;
        firebase.database().ref(`/books/${key}`).set({
            name: data.name,
            image: url,
            publishDate: data.publishDate,
            author: data.author,
            time: Date.now(),
            type: data.type,
            purpose: data.purpose,
            summary: data.summary,
            bookKey: key,
            uid: this.user.uid,
            price: data.price,
        }).then(res => {
            this.navCtrl.back();
        }).catch(err => {
            alert(err);
        });
    }

    openCamera(type) {
        const options: CameraOptions = {
            quality: 40,
            sourceType: type,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            saveToPhotoAlbum: true
        };
        this.camera.getPicture(options).then((imageData) => {
            const base64Image = 'data:image/jpeg;base64,' + imageData;
            this.picture = base64Image;
            this.bookForm.patchValue({
                picture: this.picture,
            });
        }, (err) => {
            alert(err);
        });
    }

}
