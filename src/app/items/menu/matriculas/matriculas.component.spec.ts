import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriculasComponent } from './matriculas.component';

describe('MatriculasComponent', () => {
  let component: MatriculasComponent;
  let fixture: ComponentFixture<MatriculasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MatriculasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatriculasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
