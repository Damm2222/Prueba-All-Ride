import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { GoogleMap } from '@angular/google-maps';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css'],
})
export class MapaComponent implements OnInit, OnChanges {
  @Input() markers: { lat: number; lng: number }[] = [];
  @ViewChild(GoogleMap, { static: false }) mapComponent!: GoogleMap;

  mapOptions: google.maps.MapOptions = {
    center: { lat: -33.4489, lng: -70.6693 },
    zoom: 12,
  };

  private gmap?: google.maps.Map;

  ngOnInit(): void {}

  /**
   * Este método se llama cuando el mapa está completamente inicializado.
   * @param map La instancia real de google.maps.Map
   */
  onMapReady(map: google.maps.Map): void {
    console.log('Mapa inicializado', map);
    this.gmap = map;
    if (this.markers.length > 0) {
      this.fitBounds();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['markers'] && this.markers.length > 0 && this.gmap) {
      console.log('Marcadores actualizados:', this.markers);
      setTimeout(() => this.fitBounds(), 0);
    }
  }
  updateMapView(): void {
    if (this.markers.length === 0) {
      console.warn('No hay marcadores para actualizar la vista del mapa.');
      return;
    }

    if (this.markers.length === 1) {
      this.centerMapOnLastMarker();
    } else {
      this.fitBounds();
    }
  }

  fitBounds(): void {
    console.log('fitBounds ejecutado con marcadores:', this.markers);

    if (!this.gmap) {
      console.warn('fitBounds: El mapa no está disponible');
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    let validMarkers = 0;

    this.markers.forEach((marker) => {
      if (marker.lat != null && marker.lng != null) {
        bounds.extend(new google.maps.LatLng(marker.lat, marker.lng));
        validMarkers++;
      } else {
        console.warn('fitBounds: Marcador inválido:', marker);
      }
    });

    if (validMarkers === 0) {
      console.warn('fitBounds: Sin marcadores válidos');
      return;
    }

    this.gmap.fitBounds(bounds);

    google.maps.event.addListenerOnce(this.gmap, 'bounds_changed', () => {
      const currentZoom = this.gmap?.getZoom();
      if (currentZoom && currentZoom > 15) {
        console.log(`Ajustando zoom de ${currentZoom} a 15`);
        this.gmap?.setZoom(15); // Operador opcional para prevenir errores
      }
    });
  }

  centerMapOnLastMarker(): void {
    if (!this.gmap || this.markers.length === 0) {
      console.warn(
        'centerMapOnLastMarker: El mapa no está disponible o no hay marcadores.'
      );
      return;
    }

    const lastMarker = this.markers[this.markers.length - 1];
    if (!lastMarker) {
      console.warn('centerMapOnLastMarker: Sin marcadores.');
      return;
    }

    console.log('Centrando en último marcador:', lastMarker);
    this.gmap.setCenter({ lat: lastMarker.lat, lng: lastMarker.lng });
    this.gmap.setZoom(14);
  }
}
