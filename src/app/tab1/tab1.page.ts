import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton, IonSpinner, IonList, IonIcon } from '@ionic/angular/standalone';
import { MapsService } from '../services/maps.service';
import { CommonModule } from '@angular/common';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonIcon, IonList, IonSpinner, IonButton, IonLabel, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, CommonModule],
})
export class Tab1Page implements OnInit {

  cargando = false; 
  veterinariasCercanas: any[] = []; 
  latitud: number = 0;
  longitud: number = 0;
  radio = 2000; 
  tipo = 'veterinary_care';


  constructor(private mapsService: MapsService) {}

  async obtenerUbicacionActual() {
    this.cargando = true;

    try {
      const coordenadas = await Geolocation.getCurrentPosition();
      this.latitud = coordenadas.coords.latitude;
      this.longitud = coordenadas.coords.longitude;
      console.log('Ubicación actual:', this.latitud, this.longitud);
      this.buscarVeterinariasCercanas();
    } catch (error) {
      console.error('Error al obtener la ubicación actual:', error);
      this.cargando = false;
    }
  }

  buscarVeterinariasCercanas() {
    console.log('Buscando veterinarias cercanas con coordenadas:', this.latitud, this.longitud);
    this.mapsService.buscarLugaresCercanos(this.latitud, this.longitud, this.radio, this.tipo).subscribe(
      (respuesta) => {
        console.log('Datos recibidos:', respuesta);
        this.veterinariasCercanas = respuesta.results;
        this.cargando = false;
      },
      (error) => {
        console.error('Error al buscar veterinarias cercanas:', error);
        this.cargando = false;
      }
    )
  }

  abrirGoogleMaps(lat: number, lng: number): void {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank'); // Abre el enlace en una nueva pestaña o aplicación
  }

  ngOnInit(): void {
    console.log('Componente inicializado. Listo para buscar ubicaciones.');
  }
}
