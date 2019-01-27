import { Component, NgZone  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ToastController, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';
import { FirestoreProvider } from '../../providers/firestore/firestore';
import { HomePage } from '../home/home';

import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import {
	GoogleMaps,
	GoogleMap,
	GoogleMapsEvent,
	GoogleMapOptions,
	CameraPosition,
	MarkerOptions,
	Marker,
	ILatLng,
	Geocoder, 
    GeocoderRequest, 
    GeocoderResult
} from '@ionic-native/google-maps';
declare var google;

@IonicPage()
@Component({
  selector: 'page-registro',
  templateUrl: 'registro.html',
})
export class RegistroPage {
 	datos: FormGroup;
 	map: any;
 	//map: GoogleMap;
	latituda: any;
	longituda: any;
	latitudo: any=0;
	longitudo: any=0;
	latLng:any={};
	latLngpo: any={};
	mark: Marker;
	markers: any;
	autocomplete: any;
  	GoogleAutocomplete: any;
  	GooglePlaces: any;
  	geocoder: any
  	autocompleteItems: any;
  	loading: any;
  	nomlugar: any;
  	enviar:any={};

	placesService: any;
	places: any = [];
	searchDisabled: boolean;
    saveDisabled: boolean;
    location: any; 
    array_marcadores = new Array();
  constructor(public navCtrl: NavController, public navParams: NavParams,
  				public formBuilder: FormBuilder,
  				public loadingCtrl: LoadingController, 
                private alertCtrl: AlertController, 
                public toastCtrl: ToastController,
  				private googleMaps: GoogleMaps, 
				private geolocation: Geolocation,
				public  platform: Platform,
				public zone: NgZone,
				public firestore: FirestoreProvider
  				) {
  	    this.geocoder = new google.maps.Geocoder;
	    let elem = document.createElement("map")
	    this.GooglePlaces = new google.maps.places.PlacesService(elem);
	    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
	    this.autocomplete = {
	      input: ''
	    };
	    this.autocompleteItems = [];
	    this.markers = [];
	    this.loading = this.loadingCtrl.create();
  }

 ionViewWillLoad() {

      this.datos = new FormGroup({
        nombre: new FormControl('', Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(5),
          Validators.pattern('([a-zA-Z0-9-.ñÑ@*´¨á-úÁ-Ú ])*'),
          Validators.required
        ])),
        duena: new FormControl('', Validators.compose([
          Validators.maxLength(25),
          Validators.minLength(5),
          Validators.pattern('([a-zA-Z0-9-.ñÑá-úÁ-Ú ])*'),
        ])),
        telefono: new FormControl('', Validators.compose([
          Validators.maxLength(10),
          Validators.minLength(5),
          Validators.pattern('^09[0-9 ]*')
        ])),
       /* direccion: new FormControl('', Validators.compose([
          Validators.maxLength(10),
          Validators.minLength(5),
          Validators.pattern('([a-zA-Z0-9-.ñÑ@*´¨á-úÁ-Ú ])*'),
          Validators.required
        ])),*/
	      verduras: new FormControl(),
	      frutas: new FormControl(),
	      panaderia: new FormControl(),
	      bebidas: new FormControl(),
	      dulces: new FormControl(),
	      cerveza: new FormControl()
      });

      this.datos.valueChanges
        .debounceTime(400)
        .subscribe(data => this.onValueChanged(data));

		this.platform.ready().then(() => {
        	this.myposicion();
     	});

  } 
//funcion que revisa si hay cambios en el formulario 3 y muestra mensajes de error
  onValueChanged(data?: any) {
      if (!this.datos) { return; }
      const form = this.datos;
      for (const field in this.formErrors) {
          // Limpiamos los mensajes anteriores
          this.formErrors[field] = [];
          this.datos[field] = '';
        const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
                this.formErrors[field].push(messages[key]);
            }
        }
      }
  }


  formErrors = {
      'nombre': [],
      'duena': [],
      'telefono': []
  };

//mensajes de error para cada validacion
  validationMessages = {
      'nombre': {
          'required':      'Se requiere el campo Nombres',
          'minlength':     'El campo Nombres debe tener al menos 5 caracteres.',
          'maxlength':     'El campo Nombres no puede tener más de 25 caracteres.',
          'pattern':       'Solo letras y Numeros'
      },
      'duena': {
          'minlength':     'El campo Nombres debe tener al menos 5 caracteres.',
          'maxlength':     'El campo Nombres no puede tener más de 25 caracteres.',
          'pattern':       'Solo letras y Numeros'
      },
      'telefono': {
          'minlength':     'El campo Nombres debe tener al menos 5 caracteres.',
          'maxlength':     'El campo Nombres no puede tener más de 25 caracteres.',
          'pattern':       'Solo numeros empezando por 09'
      }
  };

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

loadMap(){
	   let mapContainer = document.getElementById('map_canvas2');
	    //usando mapa.js
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
              //icon : 'assets/imgs/miubicacion.jpg', 
              map: this.map,
              animation: 'DROP',
              title: 'mi posición',
  			  position: {
				lat: this.latituda,
				lng: this.longituda
			},
			draggable: true
          }); 
	    this.array_marcadores.push(miMarker);
		google.maps.event.addListener(miMarker, 'dragend', function() {
		  	this.latituda = this.getPosition().lat();
 			this.longituda = this.getPosition().lng();

			console.log(this.latituda);
			console.log(this.longituda);

		});
    }	

	obtenerubicacion(){
		for(var a in this.array_marcadores)
				{
					this.array_marcadores[a].setMap(null);
				}
	    this.array_marcadores = [];

		let marker: Marker = new google.maps.Marker({
			  map: this.map,
              animation: 'DROP',
              title: 'mi posición',
  			  position: {
				lat: this.latituda,
				lng: this.longituda
			},
			draggable: true
		});
		this.array_marcadores.push(marker)
		google.maps.event.addListener(marker, 'dragend', function() {
		  	this.latituda = this.getPosition().lat();
 			this.longituda = this.getPosition().lng();

			console.log(this.latituda);
			console.log(this.longituda);

		});
		
		this.map.setCenter(marker.getPosition());
		}


  updateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        if(predictions){
          this.zone.run(() => {
            predictions.forEach((prediction) => {
              this.autocompleteItems.push(prediction);
            });
          });
        }
    });
  }

  selectSearchResult(item){
  	console.log(item); 
  	this.autocompleteItems = [];
  	this.nomlugar=item.description;
    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){
        console.log(results[0].geometry.location.lat());
        this.latituda=results[0].geometry.location.lat()
		this.longituda=results[0].geometry.location.lng()
		/*this.map.clear().then(() => {
		});*/
		this.obtenerubicacion();

      }
    })
  	
  }



	registrar(){
		if(this.datos.value.verduras==false && 
			this.datos.value.frutas==false && 
			this.datos.value.panaderia==false && 
			this.datos.value.bebidas==false &&
			this.datos.value.dulces ==false &&
			this.datos.value.cerveza==false) {
			let alerta = this.alertCtrl.create({
				title: 'Error',
				message: 'No selecciono ningun producto',
				buttons: ['Aceptar']
			});
			alerta.present();
		}else{
			let alert = this.alertCtrl.create({
				title: 'COnfirmar Nueva Tienda',
				message: '¿Esta seguro de que los datos son correctos?',
				buttons: [
					{
						text: 'Cancelar',
						//role: 'Si',
						handler: () => {

						}
					},
					{
						text: 'Si, estoy seguro',
						handler: () => {

							if(this.datos.value.nombre=="") {
								var nom = " ";
							}else{
								var nom = String(this.datos.value.nombre);
							}
							if(this.datos.value.duena=="") {
								var due = "Anonimo";
							}else{
								var due = String(this.datos.value.duena);
							}
							if(this.datos.value.telefono=="") {
								var tel = "0000000000s";
							}else{
								var tel = String(this.datos.value.telefono);
							}
							var pro="";
							if(this.datos.value.verduras == true) {
								if(pro=="") {
									pro=pro+"Verduras"
								}else{
									pro=pro+", Verduras"
								}
							}
							if(this.datos.value.frutas == true) {
								if(pro=="") {
									pro=pro+"Frutas"
								}else{
									pro=pro+", Frutas"
								}									
							}
							if(this.datos.value.dulces == true) {
								if(pro=="") {
									pro=pro+"Dulces"
								}else{
									pro=pro+", Dulces"
								}										
							}
							if(this.datos.value.cerveza == true) {
								if(pro=="") {
									pro=pro+"Cerveza"
								}else{
									pro=pro+", Cerveza"
								}											
							}
							if(this.datos.value.bebidas == true) {
								if(pro=="") {
									pro=pro+"Bebidas"
								}else{
									pro=pro+", Bebidas"
								}												
							}
							if(this.datos.value.panaderia == true) {
								if(pro=="") {
									pro=pro+"Panaderia"
								}else{
									pro=pro+", Panaderia"
								}													
							}


							this.enviar={
								nombre: nom,
								duena: due,
								telefono: tel,
								productos : pro,
								ubicacion: {
									direccion: this.nomlugar,
									lat: this.latituda,
									lng: this.longituda
								}
							}
							this.firestore.addUser(this.enviar)
							  .then( res => {
							    let toast = this.toastCtrl.create({
							      message: 'User was created successfully',
							      duration: 3000
							    });
							    toast.present(); 
							  }, err => {
							    console.log(err)
							  })
							this.navCtrl.pop();

						}
					}
				]
			});
			alert.present();
		}	
	}








}
