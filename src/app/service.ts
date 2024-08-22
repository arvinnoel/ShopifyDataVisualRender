import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Define the interface for the response
export interface ClvByCohort {
  cohort: string;
  average_clv: number;
  customer_names: string[];
}
@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  private GeoAPI = 'https://api.opencagedata.com/geocode/v1/json?';
  private APIKey = 'eaa4a42a4ffb47b68082695fa220d609'; 

  // readonly APIUrl = "http://127.0.0.1:5000";
  // readonly APIUrl = "http://0.0.0.0:8000";
  readonly APIUrl = "https://flask-data-visual.onrender.com";
  constructor(private http: HttpClient) { }

  getSalesYear(groupBy: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.APIUrl}/sales/years?group_by=${groupBy}`);
  }
  getSalesInterval(): Observable<string[]> {
    return this.http.get<string[]>(`${this.APIUrl}/sales/intervals`);
  }

  getSalesData(interval: string, year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.APIUrl}/sales/${interval}/${year}`);
  }
  getGrowthRateData(interval: string, year: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.APIUrl}/sales-growth/${interval}/${year}`);
  }
  
  getCustomerYears(): Observable<number[]> {
    return this.http.get<number[]>(`${this.APIUrl}/new-customers/years`);
  }
  
  getCustomerData(): Observable<string[]> {
    return this.http.get<string[]>(`${this.APIUrl}/new-customers`);
  }

  getRepeatCustomersPurchase(interval: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.APIUrl}/repeat-customers/${interval}`);
  }

  getCustomerDistribution(): Observable<any[]> {
    return this.http.get<any[]>(`${this.APIUrl}/customer-distribution`);
  }

  getCoordinates(city: string): Observable<any> {
    return this.http.get<any>(`${this.GeoAPI}?q=${encodeURIComponent(city)}&key=${this.APIKey}`);
  }

  getCustomerDistributionCities(): Observable<any[]> {
    return this.http.get<any[]>(`${this.APIUrl}/distributed-cities`);
  }
  // getCustomerValueCohorts(year: number): Observable<number[]> {
  //   return this.http.get<number[]>(`${this.APIUrl}/clv-by-cohorts/${year}`);
  // }
  getCustomerValueCohorts(year: number): Observable<ClvByCohort[]> {
    return this.http.get<ClvByCohort[]>(`${this.APIUrl}/clv-by-cohorts/${year}`);
  }
}