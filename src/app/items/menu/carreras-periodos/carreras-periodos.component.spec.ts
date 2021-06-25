import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrerasPeriodosComponent } from './carreras-periodos.component';

describe('CarrerasPeriodosComponent', () => {
  let component: CarrerasPeriodosComponent;
  let fixture: ComponentFixture<CarrerasPeriodosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarrerasPeriodosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrerasPeriodosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
