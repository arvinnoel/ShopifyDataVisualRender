import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // Register Chart.js components

@Component({
  selector: 'app-sales-chart',
  templateUrl: './sales-chart.component.html',
  styleUrls: ['./sales-chart.component.css']
})
export class SalesChartComponent implements OnInit, OnDestroy {

  intervals: string[] = [];
  years: number[] = [];
  selectedInterval: string = 'daily'; // Default to daily
  selectedYear: number = 2022; // Default to year 2022
  loading: boolean = true;
  chart: Chart | undefined; // Store reference to the chart instance

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getIntervals();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy(); // Clean up the chart instance when the component is destroyed
    }
  }

  getIntervals(): void {
    this.dataService.getSalesInterval().subscribe(
      data => {
        this.intervals = data;
        this.selectedInterval = this.intervals.includes(this.selectedInterval) ? this.selectedInterval : this.intervals[0]; // Ensure default interval is valid
        this.getYears(this.selectedInterval);
      },
      error => {
        console.error('Error fetching intervals:', error);
      }
    );
  }

  getYears(interval: string): void {
    this.dataService.getSalesYear(interval).subscribe(
      data => {
        this.years = data;
        this.selectedYear = this.years.includes(this.selectedYear) ? this.selectedYear : this.years[0]; // Ensure default year is valid
        this.loading = false;
        this.updateChart(); // Initialize chart with default year and interval
      },
      error => {
        console.error('Error fetching years:', error);
        this.loading = false;
      }
    );
  }

  onIntervalChange(): void {
    if (this.selectedInterval) {
      this.getYears(this.selectedInterval);
    }
  }

  onYearChange(): void {
    if (this.selectedInterval && this.selectedYear) {
      this.updateChart(); // Update chart when year changes
    }
  }

  updateChart(): void {
    if (this.selectedInterval && this.selectedYear) {
      // Destroy the existing chart instance if it exists
      if (this.chart) {
        this.chart.destroy();
      }

      this.dataService.getSalesData(this.selectedInterval, this.selectedYear).subscribe(
        data => {
          if (!data || data.length === 0) {
            console.warn('No data available for the selected year and interval.');
            return;
          }

          // Format labels based on interval
          let labels: string[];
          if (this.selectedInterval === 'daily') {
            labels = data.map(d => `${d._id.day}/${d._id.month}/${d._id.year}`);
          } else if (this.selectedInterval === 'monthly') {
            labels = data.map(d => `${d._id.month}/${d._id.year}`);
          } else if (this.selectedInterval === 'quarterly') {
            labels = data.map(d => `Q${d._id.quarter}/${d._id.year}`);
          } else if (this.selectedInterval === 'yearly') {
            labels = data.map(d => `${d._id.year}`);
          } else {
            labels = []; // Default to empty if interval is not recognized
          }

          const values = data.map(d => d.total_sales);

          // Create the chart
          this.chart = new Chart('salesChart', {
            type: 'line',
            data: {
              labels: labels,
              datasets: [{
                label: `Sales (${this.selectedInterval}, ${this.selectedYear})`,
                data: values,
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderWidth: 1,
                fill: true
              }]
            },
            options: {
              responsive: true,
              plugins: {
                legend: {
                  display: true,
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return `Sales: ${context.raw}`;
                    }
                  }
                }
              },
              scales: {
                x: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: `Date (${this.selectedInterval})`
                  },
                  // Rotate labels for better readability if needed
                  ticks: {
                    maxRotation: 90,
                    minRotation: 45
                  }
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Total Sales'
                  }
                }
              }
            }
          });
        },
        error => {
          console.error('Error fetching sales data:', error);
        }
      );
    }
  }
}
