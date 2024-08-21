import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataService } from '../service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-sales-growth',
  templateUrl: './sales-growth.component.html',
  styleUrls: ['./sales-growth.component.css']
})
export class SalesGrowthComponent implements OnInit, OnDestroy {

  intervals: string[] = [];
  years: number[] = [];
  selectedInterval: string = 'daily'; // Default to daily
  selectedYear: number = 2022; // Default to year 2022
  loading: boolean = true;
  noData: boolean = false; // Flag to track if no data is available
  chart: Chart | undefined; // Store reference to the chart instance

  constructor(private dataService: DataService) { }

  ngOnInit(): void {
    this.getIntervals();
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  getIntervals(): void {
    this.dataService.getSalesInterval().subscribe(
      data => {
        this.intervals = data;
        this.selectedInterval = this.intervals.includes(this.selectedInterval) ? this.selectedInterval : this.intervals[0];
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
        this.selectedYear = this.years.includes(this.selectedYear) ? this.selectedYear : this.years[0];
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
      if (this.chart) {
        this.chart.destroy(); // Destroy existing chart instance
      }

      this.dataService.getGrowthRateData(this.selectedInterval, this.selectedYear).subscribe(
        data => {
          // Check if data is available
          if (!data || data.length === 0) {
            this.noData = true; // Set flag to true if no data is available
            return;
          }

          this.noData = false; // Reset the flag if data is available

          // Format labels based on interval
          let labels: string[];
          if (this.selectedInterval === 'daily') {
            labels = data.map(d => `${d.period.day}/${d.period.month}/${d.period.year}`);
          } else if (this.selectedInterval === 'monthly') {
            labels = data.map(d => `${d.period.month}/${d.period.year}`);
          } else if (this.selectedInterval === 'quarterly') {
            labels = data.map(d => `Q${d.period.quarter}/${d.period.year}`);
          } else if (this.selectedInterval === 'yearly') {
            labels = data.map(d => `${d.period.year}`);
          } else {
            labels = [];
          }

          const values = data.map(d => d.growth_rate);

          this.chart = new Chart('growthRateChart', {
            type: 'bar',
            data: {
              labels: labels,
              datasets: [{
                label: `Growth Rate (${this.selectedInterval}, ${this.selectedYear})`,
                data: values,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
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
                    label: function (context) {
                      return `Growth Rate: ${context.raw}%`;
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
                  ticks: {
                    maxRotation: 90,
                    minRotation: 45
                  }
                },
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Growth Rate (%)'
                  }
                }
              }
            }
          });
        },
        error => {
          console.error('Error fetching growth rate data:', error);
        }
      );
    }
  }
}
