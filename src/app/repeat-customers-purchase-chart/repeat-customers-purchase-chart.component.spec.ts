import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepeatCustomersPurchaseChartComponent } from './repeat-customers-purchase-chart.component';

describe('RepeatCustomersPurchaseChartComponent', () => {
  let component: RepeatCustomersPurchaseChartComponent;
  let fixture: ComponentFixture<RepeatCustomersPurchaseChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepeatCustomersPurchaseChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RepeatCustomersPurchaseChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
