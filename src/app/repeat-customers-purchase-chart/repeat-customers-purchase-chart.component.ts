import { Component, OnInit } from '@angular/core';
import { DataService } from '../service';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-repeat-customers-purchase-chart',
  templateUrl: './repeat-customers-purchase-chart.component.html',
  styleUrls: ['./repeat-customers-purchase-chart.component.css']
})
export class RepeatCustomersPurchaseChartComponent implements OnInit {
  intervals: string[] = [];
  selectedInterval: string = 'daily'; // Default to daily
  loading: boolean = true;
  doughnutChart?: Chart<'doughnut', number[], string>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.getIntervals();
    this.loadChartData(this.selectedInterval); // Load chart data for the default interval
  }

  getIntervals(): void {
    this.dataService.getSalesInterval().subscribe(
      (data: string[]) => {
        this.intervals = data;
        this.loading = false;
        this.selectedInterval = this.intervals.includes(this.selectedInterval) ? this.selectedInterval : this.intervals[0];
      },
      (error) => {
        console.error('Error fetching intervals:', error);
        this.loading = false;
      }
    );
  }

  onIntervalChange(): void {
    if (this.selectedInterval) {
      this.loadChartData(this.selectedInterval);
    }
  }

  loadChartData(interval: string): void {
    this.dataService.getRepeatCustomersPurchase(interval).subscribe(
      (data: any[]) => {
        const labels = data.map(d => `${d.first_name} ${d.last_name}`);
        const totalPurchases = data.map(d => d.total_purchases);

        this.updateDoughnutChart(labels, totalPurchases);
      },
      (error) => {
        console.error('Error fetching chart data', error);
      }
    );
  }

  updateDoughnutChart(labels: string[], data: number[]): void {
    if (this.doughnutChart) {
      this.doughnutChart.data.labels = labels;
      this.doughnutChart.data.datasets[0].data = data;
      this.doughnutChart.update();
    } else {
      this.doughnutChart = new Chart<'doughnut', number[], string>('doughnutChart', {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: this.getColorPalette(data.length),
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false, // Disable the legend
            },
            title: {
              display: true,
              text: 'Repeat Customers - Doughnut Chart'
            }
          },
          layout: {
            padding: 20 // Add some padding around the chart if needed
          }
        }
      });
    }
  }

  getColorPalette(length: number): string[] {
    const colors = [
      '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
      '#F7464A', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360', '#AC64AD'
    ];
    return colors.slice(0, length);
  }
}
