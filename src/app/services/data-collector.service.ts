import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject } from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class DataCollectorService {

    collection: BehaviorSubject<any>;
    books = [];
    myRequiredBooks = [];
    myDonatedBooks = [];
    constructor() {
        this.collection = new BehaviorSubject<any>('data');
        this.getAllBooks();
    }

    getAllBooks() {
        firebase.database().ref('books').on('value', snapshot => {
            this.books = [];
            snapshot.forEach((node) => {
                const book = node.val();
                book.show = false;
                this.books.push(book);
                this.setValue('data');
                console.log('books: ', this.books);
            });
        });
    }

    setValue(value) {
        return this.collection.next(value);
    }

    getValue(): Observable<boolean> {
        return this.collection.asObservable();
    }

    getUserBooks(uid) {
        const ref = 'books-' + uid;
        firebase.database().ref(`${ref}`).on('value', snapshot => {
            this.myRequiredBooks = [];
            this.myDonatedBooks = [];
            snapshot.forEach((node) => {
                const book = node.val();
                book.show = false;
                if (book.purpose === 'Donation') {
                    this.myDonatedBooks.push(book);
                } else {
                    this.myRequiredBooks.push(book);
                }
            });
            this.setValue('books');
        });
    }

    createGroups(array, keyName): any {
        const result: any = array.reduce((r, a) => {
            r[a[`${keyName}`]] = r[a[`${keyName}`]] || [];
            r[a[`${keyName}`]].push(a);
            return r;
        }, Object.create(null));
        console.log('00000000000000', result);
        const resultArray = Object.keys(result).map((courseIndex) => {
            const course = result[courseIndex];
            return course;
        });
        resultArray.forEach((cours, index) => {
            cours.courseKey = cours[index].key;
        });
        console.log('grouped courses for no of students.: ', resultArray);
        return resultArray;
    }
}
