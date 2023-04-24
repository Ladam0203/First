import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import * as config from '../../firebaseconfig.js';

@Injectable({
  providedIn: 'root'
})
export class FireService {

  firebaseApplication: firebase.app.App;
  firestore: firebase.firestore.Firestore;

  constructor() {
    this.firebaseApplication = firebase.initializeApp(config.firebaseConfig);
    this.firestore = firebase.firestore();
  }
}
