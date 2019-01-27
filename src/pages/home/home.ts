import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import { ToastController, LoadingController, AlertController } from 'ionic-angular';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import {
	GoogleMaps,
	GoogleMap,
	GoogleMapsEvent,
	GoogleMapOptions,
	CameraPosition,
	MarkerOptions,
	Marker,
	ILatLng
} from '@ionic-native/google-maps';
declare var google;


import { RegistroPage } from '../registro/registro';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
//map: GoogleMap;
	latituda: any=0;
	longituda: any=0;
 	map: any;
 	listado: any=[];
 	array_marcadores = new Array();
    ltiendas;
    mostrar:any=[];
    nombres:any=[];
    prod:any;
    coorori:ILatLng;
    coordes:ILatLng;
    dis:any=[];
    distance: string;
	distancia: any;
	vec:any=[];
	directionsServiceTmp: any = null;
    directionsDisplayTmp: any = null;
    bounds: any = null;
    //legs:any;
  constructor(public navCtrl: NavController,
  				private googleMaps: GoogleMaps, 
				private geolocation: Geolocation,
				public  platform: Platform,
				public firestore: FirestoreProvider,
				public loadingCtrl: LoadingController, 
                private alertCtrl: AlertController, 
                public toastCtrl: ToastController) { 		
  		this.directionsServiceTmp = new google.maps.DirectionsService;
        this.directionsDisplayTmp = new google.maps.DirectionsRenderer;
        this.bounds = new google.maps.LatLngBounds();


        
  }
/* ionViewCanEnter(){
 		
 }
*/
  ionViewDidLoad(){
        this.platform.ready().then(() => {
        	this.myposicion();
     	});
  }

  ionViewDidEnter(){
   //Cargando el observable
     this.impri();

}




 impri(){
 		 	this.firestore.getFirestore().subscribe(tiendas=>{
		  this.ltiendas = tiendas;
		  
		  if(this.ltiendas.length==0) {
		  	this.eliminar();
		  }
		  for(let k in this.ltiendas){ 
		  	  console.log(k);
		      this.obtenerubicacion(this.ltiendas[k].enviar.ubicacion.lat, 
		      						this.ltiendas[k].enviar.ubicacion.lng,
		      						''+this.ltiendas[k].enviar.nombre,
		      						''+this.ltiendas[k].enviar.dueña,
		      						''+this.ltiendas[k].enviar.telefono,
		      						''+this.ltiendas[k].enviar.productos,
		      						this.ltiendas[k].enviar.ubicacion.direccion,k);
		      this.coordes={
					lat: this.ltiendas[k].enviar.ubicacion.lat, 
					lng: this.ltiendas[k].enviar.ubicacion.lng 
		      }
		      
	     	  this.coorori={
					lat: this.latituda, 
					lng: this.longituda 
			  }	  
			  this.nombres[k]=(this.ltiendas[k].enviar.nombre);
			  console.log(this.nombres);
			  
		      this.mdistancia(this.coorori,this.coordes);
		      this.nombres.push(this.ltiendas[k].enviar.nombre);
		  }
		  this.nombres=[];
		  this.vec=[];
		})
		
		console.log(this.mostrar);
		
		console.log(this.nombres);
 }

	myposicion(){
			this.geolocation.getCurrentPosition().then((resp) => {
				this.latituda =resp.coords.latitude;
				this.longituda =resp.coords.longitude;
				console.log(this.latituda);
				console.log(this.longituda);
				this.loadMap();
			}).catch((error) => {
				console.log('Error getting location', error);
			});

	}

  eliminar(){
	for(var a in this.array_marcadores)
	{
		this.array_marcadores[a].setMap(null);
	}
	this.array_marcadores = [];
  }
	obtenerubicacion(lat, lng,nom,due,tel,pro,ubi,k){
		if(k==0) {
				for(var a in this.array_marcadores)
				{
					this.array_marcadores[a].setMap(null);
				}
	    		this.array_marcadores = [];
		}
		let markera: Marker = new google.maps.Marker({
			  icon : 'assets/imgs/tienda.png',
			  map: this.map,
              animation: 'DROP',
              title: 'mi posición',
  			  position: {
				lat: lat,
				lng: lng
			},
			//draggable: true
		});
		var message= "Tienda: "+nom+
			 ", Dueña: "+due+
			 ", Telefono: "+tel+
			 ", Productos: "+pro+
			 ", Ubicación; "+ubi;
		this.array_marcadores.push(markera)
		var infowindow1 = new google.maps.InfoWindow({ content: message });

			
		google.maps.event.addListener(markera, 'click', function() {

			infowindow1.open(this.map, markera);
		 
		});
		
		//this.map.setCenter(marker.getPosition());
		}


	loadMap(){
	   let mapContainer = document.getElementById('map_canvas');
	    let mapOptions2= {
	      center: {
					lat: this.latituda,
					lng: this.longituda
				},
	      zoom: 12
	    };
	    this.map = new google.maps.Map(mapContainer, mapOptions2);
	    let miMarker = new google.maps.Marker({
              //para cargar una imagen especial
              icon : 'assets/imgs/actual.png', 
              map: this.map,
              animation: 'DROP',
              title: 'mi posición',
  			  position: {
				lat: this.latituda,
				lng: this.longituda
			}
          }); 
    }

	registrar(){
		this.navCtrl.push(RegistroPage, {}, { animate: true, duration: 200 });
	}


	mdistancia(origen, destino){
		this.directionsServiceTmp.route({
		            origin: origen,
		            destination: destino,
		            optimizeWaypoints: true,
		            travelMode: 'DRIVING'
		        }, (response, status) => {
		               this.distance=((response.routes[0].legs[0].distance.value)/1000)+"";
		               console.log(this.distance);
		               this.vec.push(this.distance);
		               console.log(this.vec);
		               // for (var u in this.nombres) {
		               // 		console.log(this.u+this.nombres[u]+this.distance);
		               		
		               // 	   this.mostrar[u]={
		               // 	   	 n: this.nombres[u],
		               // 	   	 d: this.distance
		               // 	   }
		               // }
		               // console.log(this.mostrar);
		               
		               
		               for (var i in this.ltiendas) {
							this.mostrar[i]={
								nombre: this.ltiendas[i].enviar.nombre,
								distanci: this.vec[i]
							}               	
		               }
		               console.log(this.mostrar);
		               
		     //           this.nombres=[];
		     //           this.vec=[];
		     //           console.log(this.mostrar);
		               //this.vec.push(this.distance);
		               
		        }
		        );
	}

}
