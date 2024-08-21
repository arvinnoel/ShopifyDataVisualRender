import { Component, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { DataService } from '../service'; // Adjust the path as needed

@Component({
  selector: 'app-new-customers-chart',
  templateUrl: './new-customers-chart.component.html',
  styleUrls: ['./new-customers-chart.component.css']
})
export class NewCustomersChartComponent implements OnInit {
  years: number[] = [];
  selectedYear: number = 2020; // Default year
  chart?: Chart;
  loading: boolean = true;

  constructor(private dataService: DataService) { }

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
    this.dataService.getCustomerData().subscribe(
      (data: any[]) => {
        const filteredData = data.filter(d => new Date(d.created_at).getFullYear() === year);
        const processedData = this.processData(filteredData);
        this.updateChart(processedData);
      },
      (error) => {
        console.error('Error fetching chart data', error);
      }
    );
  }

  processData(data: any[]): { x: number, y: number, label: string }[] {
    // Initialize array for data points
    const points: { x: number, y: number, label: string }[] = [];

    data.forEach(item => {
      const date = new Date(item.created_at);
      const month = date.getMonth() + 1; // Months are 0-based in JavaScript
      const day = date.getDate();
      points.push({ x: month, y: day, label: item.first_name }); // Only first name included
    });

    return points;
  }

  updateChart(data: { x: number, y: number, label: string }[]): void {
    if (this.chart) {
      // Update existing chart
      this.chart.data.datasets[0].data = data;
      this.chart.update();
    } else {
      // Register Chart.js components
      Chart.register(...registerables);

      // Create new chart
      this.chart = new Chart('newcustomerchart', {
        type: 'scatter', // Scatter plot type
        data: {
          datasets: [{
            label: 'New Customers',
            data: data, // Data points with x and y values
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Data point color
            borderColor: 'rgba(75, 192, 192, 1)', // Border color of data points
            borderWidth: 1,
            pointRadius: 5, // Radius of the data points
            pointHoverRadius: 7, // Radius of the data points on hover
            pointHoverBackgroundColor: 'rgba(255, 159, 64, 0.2)', // Hover background color
            pointHoverBorderColor: 'rgba(255, 159, 64, 1)' // Hover border color
          }]
        },
        options: {
          scales: {
            x: {
              type: 'linear', // X-axis is linear
              position: 'bottom',
              title: {
                display: true,
                text: 'Months' // X-axis label
              },
              ticks: {
                stepSize: 1, // Ensure each month is displayed
                callback: function(tickValue: string | number) {
                  // Ensure tickValue is a number before processing
                  if (typeof tickValue === 'number') {
                    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                    return months[tickValue - 1]; // Map month numbers to month names
                  }
                  return tickValue; // Fallback if tickValue is not a number
                }
              }
            },
            y: {
              title: {
                display: true,
                text: 'Day of Month' // Y-axis label
              }
            }
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function(context) {
                  // Customize tooltip content to include only first name
                  const dataPoint = context.raw as { x: number, y: number, label: string };
                  return `${dataPoint.label}: ${dataPoint.y}th`; // Only first name
                }
              }
            }
          }
        }
      });
    }
  }
}
