import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomersGeoMapComponent } from './customers-geo-map.component';

describe('CustomersGeoMapComponent', () => {
  let component: CustomersGeoMapComponent;
  let fixture: ComponentFixture<CustomersGeoMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomersGeoMapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomersGeoMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
