import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLifetimeValueChartComponent } from './customer-lifetime-value-chart.component';

describe('CustomerLifetimeValueChartComponent', () => {
  let component: CustomerLifetimeValueChartComponent;
  let fixture: ComponentFixture<CustomerLifetimeValueChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerLifetimeValueChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerLifetimeValueChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
