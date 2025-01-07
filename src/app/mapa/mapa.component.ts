import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() markers: { lat: number; lng: number }[] = [];

  @ViewChild(GoogleMap, { static: false }) map!: GoogleMap;

  // Definir el centro inicial del mapa en Santiago de Chile
  center: google.maps.LatLngLiteral = { lat: -33.4489, lng: -70.6693 }; // Coordenadas de Santiago de Chile
  zoom = 12; // Nivel de zoom inicial

  constructor() {}

  ngOnInit(): void {
    // Configuraciones iniciales si es necesario
  }

  ngAfterViewInit(): void {
    // Llamar a fitBounds después de un breve retraso para asegurar que el mapa y los marcadores están listos
    setTimeout(() => {
      this.fitBounds();
    }, 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['markers'] && this.markers.length > 0) {
      this.fitBounds();
    }
  }

  fitBounds(): void {
    console.log('MapaComponent: Ejecutando fitBounds.');

    // Crear un nuevo objeto de límites
    const bounds = new google.maps.LatLngBounds();

    // Extender los límites con cada marcador válido
    this.markers.forEach((marker) => {
      if (marker.lat !== undefined && marker.lng !== undefined) {
        const latLng = new google.maps.LatLng(marker.lat, marker.lng);
        bounds.extend(latLng);
      } else {
        console.warn(
          'MapaComponent: Marcador con coordenadas inválidas:',
          marker
        );
      }
    });

    // Verificar si el mapa está inicializado
    const currentMap = this.map?.googleMap;

    if (!currentMap) {
      console.error('MapaComponent: El mapa no está inicializado.');
      return;
    }

    // Ajustar los límites del mapa para incluir todos los marcadores
    if (this.markers.length > 0) {
      console.log('MapaComponent: Ajustando los límites del mapa.');
      currentMap.fitBounds(bounds);

      // Limitar el nivel de zoom máximo para evitar alejar demasiado el mapa
      const maxZoom = 15; // Ajusta este valor según tus necesidades
      const listener = google.maps.event.addListener(
        currentMap,
        'bounds_changed',
        () => {
          const currentZoom = currentMap.getZoom();
          if (currentZoom !== undefined && currentZoom > maxZoom) {
            console.log(
              `MapaComponent: Nivel de zoom demasiado alto (${currentZoom}), ajustando a ${maxZoom}.`
            );
            currentMap.setZoom(maxZoom);
          }
          google.maps.event.removeListener(listener);
        }
      );
    } else {
      // Si no hay marcadores, centrar el mapa en Santiago de Chile
      currentMap.setCenter(this.center);
      currentMap.setZoom(this.zoom);
    }
  }
}
