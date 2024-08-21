import { Component, OnInit } from '@angular/core';
import { DataService, ClvByCohort } from '../service';
import { Chart, registerables } from 'chart.js';

@Component({
  selector: 'app-customer-lifetime-value-chart',
  templateUrl: './customer-lifetime-value-chart.component.html',
  styleUrls: ['./customer-lifetime-value-chart.component.css']
})
export class CustomerLifetimeValueChartComponent implements OnInit {
  years: number[] = [];
  selectedYear: number = 2020; // Default year
  chart?: Chart;
  loading: boolean = true;

  constructor(private dataService: DataService) {
    // Register the components for Chart.js
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.loadYears();
  }

  loadYears(): void {
    this.dataService.getCustomerYears().subscribe(
      (years: number[]) => {
        this.years = years;
        this.loading = false;
        if (!this.years.includes(this.selectedYear)) {
          this.selectedYear = this.years[0]; // Set default to first year if default is not available
        }
        this.loadChartData(this.selectedYear); // Load data for the default year
      },
      (error) => {
        console.error('Error fetching years', error);
        this.loading = false;
      }
    );
  }

  onYearChange(): void {
    this.loadChartData(this.selectedYear);
  }

  loadChartData(year: number): void {
    this.loading = true;
    this.dataService.getCustomerValueCohorts(year).subscribe(
      (data: ClvByCohort[]) => {
        // Prepare months, average values, and customer names
        const months: string[] = [];
        const averageValues: number[] = [];
        const customerNames: { [key: number]: string[] } = {}; // Use an object to map index to names

        data.forEach((item, index) => {
          months.push(item.cohort); // Use the cohort as the month
          averageValues.push(item.average_clv);
          // Store customer names indexed by month
          customerNames[index] = item.customer_names;
        });

        if (this.chart) {
          this.chart.destroy();
        }

        this.chart = new Chart('lineChart', {
          type: 'line',
          data: {
            labels: months,
            datasets: [{
              label: `Average CLV for ${year}`,
              data: averageValues,
              borderColor: '#3e95cd',
              fill: false
            }]
          },
          options: {
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Month'
                }
              },
              y: {
                title: {
                  display: true,
                  text: 'Average CLV'
                }
              }
            },
            plugins: {
              tooltip: {
                callbacks: {
                  // Custom tooltip label
                  label: (context) => {
                    // Get the month and average CLV
                    const month = context.label;
                    const value = context.raw;
                    const index = context.dataIndex;

                    // Construct the tooltip label
                    const label = `Month: ${month} | Avg CLV: ${value}`;

                    // Add customer names if available
                    const names = customerNames[index];
                    const namesText = names ? names.join('\n') : 'No customers'; // Join names with new lines

                    return `${label}\nCustomers:\n${namesText}`;
                  }
                }
              }
            }
          }
        });

        this.loading = false;
      },
      (error) => {
        console.error('Error fetching CLV data', error);
        this.loading = false;
      }
    );
  }
}
