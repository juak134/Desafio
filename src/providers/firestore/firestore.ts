import { Injectable } from '@angular/core';   
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } 
from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class FirestoreProvider {
	snapshotChangesSubscription: any;
  constructor(public afDB: AngularFirestore) {
    console.log('Hello FirestoreProvider Provider');
  }
  //Para add una colección en Firestore
  addUser(enviar){
    return new Promise<any>((resolve, reject) => {
      this.afDB.collection('/tiendas').add({
          enviar
      })
      .then((res) => {
        resolve(res)
      },err => reject(err))
    })
  }

   getUsers(){ 
    //return this.afDB.collection('/users').snapshotChanges();
    return new Promise<any>((resolve, reject) => { 
    this.snapshotChangesSubscription = 
    this.afDB.collection('/tiendas').snapshotChanges()
    .subscribe(snapshots => {
      resolve(snapshots);
    })
  });
  }

  getFirestore(){
  	return this.afDB.collection('/tiendas').valueChanges();
  }


}
