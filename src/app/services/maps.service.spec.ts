import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MapsService } from './maps.service';

describe('MapsService', () => {
  let servicioMaps: MapsService;
  let controladorHttp: HttpTestingController;

  //variables de prueba
  const latitud = -33.47880675;
  const longitud = -70.65400975;
  const radioBusqueda = 10000;
  const tipoLugar = 'veterinary_care';


  //inicializar el servicio y el controlador antes de cada prueba
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [MapsService], 
    });

    servicioMaps = TestBed.inject(MapsService); 
    controladorHttp = TestBed.inject(HttpTestingController); 
  });

  
  ///limpiar el controlador después de cada prueba
  afterEach(() => {
    controladorHttp.expectOne(
      `/api/google-places?latitud=${latitud}&longitud=${longitud}&radio=${radioBusqueda}&tipo=${tipoLugar}`
    );
    
  });
  
  //verifico que el servicio se haya creado correctamente
  it('deberia crear el servicio correctamente', () => {
    expect(servicioMaps).toBeTruthy(); //confirmo que la instancia del servicio existe
  }); 
  
  //prueba para buscar lugares cercanos
  it('deberia realizar una solicitud para buscar lugares cercanos', () => {
    servicioMaps.buscarLugaresCercanos(latitud, longitud, radioBusqueda, tipoLugar).subscribe((respuesta) => {
      expect(respuesta).toBeTruthy(); //respuesta válida
    });
    const expectedUrl = `${servicioMaps.apiUrl}/place/nearbysearch/json?location=${latitud},${longitud}&radius=${radioBusqueda}&type=${tipoLugar}&key=${servicioMaps.apiKey}`;
    const solicitud = controladorHttp.expectOne(expectedUrl);
    expect(solicitud.request.method).toBe('GET'); //verifico que la solicitud sea de tipo GET
    solicitud.flush({status: 'OK', results: [] }); //envío una respuesta vacía
  });


  // Prueba para manejar errores al buscar lugares cercanos
  it('deberia manejar errores al buscar lugares cercanos', () => {
    servicioMaps.buscarLugaresCercanos(latitud, longitud, radioBusqueda, tipoLugar).subscribe(() => {
      fail('fallo al buscar lugares cercanos'); //falla si la solicitud se completa correctamente
    }),
    (error: any) => {
      expect(error).toBeTruthy(); //error esperado
    }
    const solicitud = controladorHttp.expectOne(
      `/api/google-places?latitud=${latitud}&longitud=${longitud}&radio=${radioBusqueda}&tipo=${tipoLugar}`
    );
    expect(solicitud.request.method).toBe('GET');
    solicitud.flush({ status: 'OK', results: [] });
    solicitud.error(new ErrorEvent('Error al buscar lugares cercanos'));
  });

  it('debería generar la URL correcta para buscarLugaresCercanos', () => {
    servicioMaps.buscarLugaresCercanos(latitud, longitud, radioBusqueda, tipoLugar).subscribe();
  
    const solicitud = controladorHttp.expectOne(
      `${servicioMaps.apiUrl}/place/nearbysearch/json?location=${latitud},${longitud}&radius=${radioBusqueda}&type=${tipoLugar}&key=${servicioMaps.apiKey}`
    );
    expect(solicitud.request.method).toBe('GET');
    solicitud.flush({ status: 'OK', results: [] });
  });
  
  

});
