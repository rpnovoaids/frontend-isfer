import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MisMatriculasComponent } from './mis-matriculas.component';

describe('MisMatriculasComponent', () => {
  let component: MisMatriculasComponent;
  let fixture: ComponentFixture<MisMatriculasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MisMatriculasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MisMatriculasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
