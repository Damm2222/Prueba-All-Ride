import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    const githubUsername = 'Damm2222'; // Reemplaza con el nombre de usuario de GitHub
    const roomId = githubUsername; // Usar el nombre de usuario como ID de sala

    // this.socket = io('https://stage.allrideapp.com', {
    //   path: '/tech_interview', // Ruta configurada en el servidor
    //   query: { room: roomId },
    //   transports: ['websocket'], // Opcional: Forzar el uso de WebSocket
    // });
    this.socket = io('http://localhost:3000', {
      path: '/tech_interview', // Ruta configurada en el servidor
      query: { room: roomId },
      transports: ['websocket'], // Opcional: Forzar el uso de WebSocket
    });

    this.socket.on('connect', () => {
      console.log('Conectado al servidor de socket.');
    });

    this.socket.on('disconnect', () => {
      console.log('Desconectado del servidor de socket.');
    });
  }

  // Emitir eventos
  emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }

  // Escuchar eventos
  on(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data: any) => {
        subscriber.next(data);
      });
    });
  }
}
