import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapsService {
  public apiKey = 'AIzaSyCa1v0xBkBxXoRqdH9P3RJOAe6nKqq9q2E'; //My API Key
  public apiUrl = '/maps/api'; //URL de la API de Google Maps


  constructor(private http: HttpClient) { }

  
  
  //obtengo la ubicación actual
  getGeoLocation(address: string): Observable<any> {
    const url = `${this.apiUrl}/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${this.apiKey}`;
    return this.http.get(url);
  }

  //busco lugares cercanos a una ubicación
  buscarLugaresCercanos(latitud: number, longitud: number, radio: number, tipo: string): Observable<any> {
    const url = `${this.apiUrl}/place/nearbysearch/json?location=${latitud},${longitud}&radius=${radio}&type=${tipo}&key=${this.apiKey}`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error al buscar lugares cercanos', error);
        return throwError(() => new Error('Error al buscar lugares cercanos'));
      })
    );
  }
} 

