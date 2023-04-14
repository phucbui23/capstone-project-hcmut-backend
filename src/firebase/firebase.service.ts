import { Injectable } from '@nestjs/common';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Firestore, getFirestore } from 'firebase/firestore';
import {
  FirebaseStorage,
  StorageReference,
  getStorage,
  ref,
} from 'firebase/storage';

@Injectable()
export class FirebaseService {
  public app: FirebaseApp;
  public storage: FirebaseStorage;
  public storageRef: StorageReference;
  public firestoreRef: Firestore;

  firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
  };

  // Initialize Firebase
  constructor() {
    this.app = initializeApp(this.firebaseConfig);
    this.storage = getStorage(this.app);
    this.storageRef = ref(this.storage);
    this.firestoreRef = getFirestore(this.app);
  }
}
