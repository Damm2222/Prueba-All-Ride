import { Component } from '@angular/core';
import { SocketService } from './socket.service';

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

  constructor(private socketService: SocketService) {
    // Escuchar eventos de 'newLocation'
    this.socketService.on('newLocation').subscribe((coords: any) => {
      this.markers.push(coords);
      console.log('AppComponent: Recibido nuevo marcador vía socket:', coords);
    });

    // Escuchar eventos de 'error' si decides manejar errores vía socket
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

    // Emitir 'geocodeAddress' al servidor vía socket
    this.socketService.emit('geocodeAddress', this.address);
    console.log('Evento geocodeAddress emitido:', this.address);
  }

  emitTestEvent() {
    this.socketService.emit('testEvent', { message: 'Hola desde el cliente!' });
    console.log('Evento de prueba emitido.');
  }
}
