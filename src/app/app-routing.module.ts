import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

import { SalesChartComponent } from './sales-chart/sales-chart.component';
import { SalesGrowthComponent } from './sales-growth/sales-growth.component';
import { NewCustomersChartComponent } from './new-customers-chart/new-customers-chart.component';
import { RepeatCustomersPurchaseChartComponent } from './repeat-customers-purchase-chart/repeat-customers-purchase-chart.component';
import { CustomersGeoMapComponent } from './customers-geo-map/customers-geo-map.component';
import { CustomerLifetimeValueChartComponent } from './customer-lifetime-value-chart/customer-lifetime-value-chart.component';

const routes: Routes = [
  { path: '', redirectTo: '/sales-chart', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },

  { path: 'sales-chart', component: SalesChartComponent },
  { path: 'sales-growth', component: SalesGrowthComponent},
  { path: 'new-customers-chart', component: NewCustomersChartComponent},
  { path: 'repeat-customers-purchase-chart', component: RepeatCustomersPurchaseChartComponent},
  { path: 'customers-geo-map', component: CustomersGeoMapComponent},
  { path: 'customer-lifetime-value-chart', component: CustomerLifetimeValueChartComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
