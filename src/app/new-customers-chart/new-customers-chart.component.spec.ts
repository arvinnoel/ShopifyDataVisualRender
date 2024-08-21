import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCustomersChartComponent } from './new-customers-chart.component';

describe('NewCustomersChartComponent', () => {
  let component: NewCustomersChartComponent;
  let fixture: ComponentFixture<NewCustomersChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewCustomersChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCustomersChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
