import { Component, ViewChild } from '@angular/core';
import { SocketService } from './socket.service';
import { MapaComponent } from './mapa/mapa.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'pruebaTecnica';
  address: string = '';
  markers: { lat: number; lng: number }[] = [];
  roomId: string = 'Damm2222'; // Reemplaza con el nombre de usuario de GitHub

  @ViewChild(MapaComponent) mapaComponent!: MapaComponent;

  constructor(private socketService: SocketService) {
    // Escuchar eventos de 'newLocation' para actualizar el map
    this.socketService.on('newLocation').subscribe((coords: any) => {
      this.markers.push(coords);
      console.log('AppComponent: Recibido nuevo marcador vía socket:', coords);

      if (this.mapaComponent) {
        this.mapaComponent.updateMapView();
      }
    });

    this.socketService.on('error').subscribe((errorMessage: any) => {
      console.error('AppComponent: Error recibido vía socket:', errorMessage);
      alert(errorMessage);
    });
  }

  geocodeAddress() {
    if (!this.address.trim()) {
      console.error('AppComponent: La dirección está vacía.');
      alert('Por favor, ingresa una dirección.');
      return;
    }

    this.socketService.emit('geocodeAddress', this.address);
    console.log('Evento geocodeAddress emitido:', this.address);
  }

  emitTestEvent() {
    this.socketService.emit('testEvent', { message: 'Hola desde el cliente!' });
    console.log('Evento de prueba emitido.');
  }
}
