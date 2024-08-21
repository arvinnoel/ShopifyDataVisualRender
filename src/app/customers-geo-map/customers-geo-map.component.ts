import { Component, AfterViewInit, OnInit } from '@angular/core';
import { DataService } from '../service'; // Adjust path to your data service
import * as L from 'leaflet';

@Component({
  selector: 'app-geo-map',
  templateUrl: './customers-geo-map.component.html',
  styleUrls: ['./customers-geo-map.component.css']
})
export class CustomersGeoMapComponent implements OnInit, AfterViewInit {
  private map: any;
  private cityCoordinates: { [key: string]: [number, number] } = {};
  private citiesData: { city: string, customers: string[] }[] = [];

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.fetchCities();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [20, 0], // Center the map near the equator
      zoom: 2, // Initial zoom level to show the entire world
      minZoom: 2, // Prevent zooming out too much to avoid the map looking small
      maxZoom: 5, // Allow zooming in but not too much
      scrollWheelZoom: true, // Enable zooming with mouse scroll
      dragging: true, // Enable dragging
      zoomControl: true, // Enable zoom controls
    });
  
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, // Maximum zoom level allowed by the tile layer
      minZoom: 2,  // Minimum zoom level to keep the world visible
      noWrap: true, // Prevent the map from wrapping around the edges
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  
    this.map.fitBounds([
      [-60, -180], // Southwest corner of the map
      [85, 180]    // Northeast corner of the map
    ]);
  }
  
  
  

  private fetchCities(): void {
    this.dataService.getCustomerDistributionCities().subscribe(cities => {
      const cityNames = cities.map((city: { city: string }) => city.city);
      const requests = cityNames.map(city =>
        this.dataService.getCoordinates(city).toPromise()
          .then((result: any) => {
            const geometry = result.results[0]?.geometry;
            if (geometry) {
              return { city, coords: [geometry.lat, geometry.lng] }; // Note the order: [lat, lng]
            } else {
              return { city, coords: [0, 0] };
            }
          })
      );

      Promise.all(requests).then(results => {
        this.cityCoordinates = results.reduce((acc, { city, coords }) => {
          if (coords.length === 2) {
            acc[city] = coords as [number, number];
          } else {
            console.warn(`Invalid coordinates for city: ${city}`, coords);
            acc[city] = [0, 0];
          }
          return acc;
        }, {} as { [key: string]: [number, number] });

        this.fetchCustomerDistribution();
      });
    });
  }

  private fetchCustomerDistribution(): void {
    this.dataService.getCustomerDistribution().subscribe(data => {
      this.citiesData = this.transformData(data);
      this.updateMap();
    });
  }

  private transformData(data: any[]): { city: string, customers: string[] }[] {
    return data.map(record => ({
      city: record._id,
      customers: record.names.map((name: { first_name: string }) => name.first_name)
    }));
  }

  private updateMap(): void {
    const markers = this.citiesData.map((cityData) => {
      const coords = this.cityCoordinates[cityData.city];
      if (coords && coords[0] !== 0 && coords[1] !== 0) {
        return L.marker(coords).bindPopup(`<strong>${cityData.city}</strong><br>${cityData.customers.join('<br>')}`);
      } else {
        console.warn(`No valid coordinates found for city: ${cityData.city}`);
        return null; // Return null for invalid coordinates
      }
    }).filter(marker => marker !== null); // Filter out null values

    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map(marker => marker!.getLatLng()));
      this.map.fitBounds(bounds);

      markers.forEach(marker => marker!.addTo(this.map));
    }
  }
}
