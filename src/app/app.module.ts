import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { FormsModule } from '@angular/forms'; 

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { RegistroPage } from '../pages/registro/registro';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { AngularFirestoreModule } from 'angularfire2/firestore';
import { FirebaseDbProvider } from '../providers/firebase-db/firebase-db';
import { FirestoreProvider } from '../providers/firestore/firestore';

export const firebaseConfig = {
    apiKey: "AIzaSyBU1-EqoPv9nhSWNQy8g0xD5Yh4sCxJjOo",
    authDomain: "prueba-dc20c.firebaseapp.com",
    databaseURL: "https://prueba-dc20c.firebaseio.com",
    projectId: "prueba-dc20c",
    storageBucket: "prueba-dc20c.appspot.com",
    messagingSenderId: "604603573190"
};



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    RegistroPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFirestoreModule.enablePersistence()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    RegistroPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseDbProvider,
    FirebaseDbProvider,
    FirestoreProvider
  ]
})
export class AppModule {}
