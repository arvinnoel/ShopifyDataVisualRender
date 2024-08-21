import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatToolbarModule } from '@angular/material/toolbar';
import { FormsModule } from '@angular/forms';

import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSidenavModule} from '@angular/material/sidenav';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import { SalesChartComponent } from './sales-chart/sales-chart.component';
import { SalesGrowthComponent } from './sales-growth/sales-growth.component';

import { NewCustomersChartComponent } from './new-customers-chart/new-customers-chart.component';
import { RepeatCustomersPurchaseChartComponent } from './repeat-customers-purchase-chart/repeat-customers-purchase-chart.component';
import { CustomersGeoMapComponent } from './customers-geo-map/customers-geo-map.component';
import { CustomerLifetimeValueChartComponent } from './customer-lifetime-value-chart/customer-lifetime-value-chart.component';


@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SalesChartComponent,
    SalesGrowthComponent,
    NewCustomersChartComponent,
    RepeatCustomersPurchaseChartComponent,
    CustomersGeoMapComponent,
    CustomerLifetimeValueChartComponent,
    
    
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule, // Import MatToolbarModule
    MatSidenavModule, // Import MatSidenavModule
    MatListModule, // Import MatListModule
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatMenuModule,
    RouterModule ,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatProgressSpinnerModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
