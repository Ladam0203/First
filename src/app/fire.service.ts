import { Injectable } from '@angular/core';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import 'firebase/compat/storage'

import * as config from '../../firebaseconfig.js';
import {MessageDTO} from "./MessageDTO";
import {Message} from "./Message";

@Injectable({
  providedIn: 'root'
})
export class FireService {

  firebaseApplication: firebase.app.App;
  firestore: firebase.firestore.Firestore;
  auth: firebase.auth.Auth;
  storage: firebase.storage.Storage;

  user: firebase.User | null;
  avatarURL: string;

  messages: Message[];

  constructor() {
    this.firebaseApplication = firebase.initializeApp(config.firebaseConfig);
    this.firestore = firebase.firestore();
    this.auth = firebase.auth();
    this.storage = firebase.storage();

    //this.firestore.useEmulator("localhost", 8080);

    this.user = null;
    this.avatarURL = "https://p1.hiclipart.com/preview/386/684/972/face-icon-user-icon-design-user-profile-share-icon-avatar-black-and-white-silhouette-png-clipart.jpg";

    this.messages = [];

    this.auth.onAuthStateChanged((user) => {
      this.user = user;
      if (user) {
        this.getMessages();
        this.getAvatarOfSignedInUser();
      }
   });


  }

  getMessages() {
    let query = this.firestore
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added") {
            let message: Message = {
              id: change.doc.id,
              timestamp: change.doc.data()["timestamp"],
              user: change.doc.data()["user"],
              content: change.doc.data()["content"],
            }
            this.messages.push(message);
          }
          if (change.type === "modified") {
            let message: Message = {
              id: change.doc.id,
              timestamp: change.doc.data()["timestamp"],
              user: change.doc.data()["user"],
              content: change.doc.data()["content"],
            }
            let index = this.messages.findIndex((message) => message.id === change.doc.id);
            this.messages[index] = message;
          }
          if (change.type === "removed") {
            let index = this.messages.findIndex((message) => message.id === change.doc.id);
            this.messages.splice(index, 1);
          }
        });
      });
  }

  sendMessage(content: string)  {
    let messageDTO: MessageDTO = {
      timestamp: new Date(),
      user: "user",
      content: content,
    }
    this.firestore.collection('messages').add(messageDTO);
  }

  signUp(email: string, password: string) {
    this.auth.createUserWithEmailAndPassword(email, password);
    console.log("Registered as " + email);
  }

  signIn(email: string, password: string) {
    this.auth.signInWithEmailAndPassword(email, password);
    console.log("Signed in as " + email);
  }

  signOut() {
    this.auth.signOut();
  }

  async getAvatarOfSignedInUser() {
    if (this.user) {
      this.avatarURL = await this.storage.ref('avatars').child(this.user.uid).getDownloadURL();
    }
  }

  async updateAvatarOfSignedInUser(file: File) {
    if (this.user) {
      let uploadTask = await this.storage.ref('avatars').child(this.user.uid).put(file);
      this.avatarURL = await uploadTask.ref.getDownloadURL();
    }
  }
}
