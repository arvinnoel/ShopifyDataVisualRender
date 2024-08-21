import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesGrowthComponent } from './sales-growth.component';

describe('SalesGrowthComponent', () => {
  let component: SalesGrowthComponent;
  let fixture: ComponentFixture<SalesGrowthComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesGrowthComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesGrowthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
