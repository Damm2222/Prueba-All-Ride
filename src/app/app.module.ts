import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // Importar FormsModule para [(ngModel)]
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { MapaComponent } from './mapa/mapa.component';
import { SocketService } from './socket.service'; // Importar el servicio

@NgModule({
  declarations: [AppComponent, MapaComponent],
  imports: [BrowserModule, FormsModule, GoogleMapsModule, HttpClientModule],
  providers: [SocketService],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
