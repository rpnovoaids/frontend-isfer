import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoMatriculasPagosComponent } from './tipo-matriculas-pagos.component';

describe('TipoMatriculasPagosComponent', () => {
  let component: TipoMatriculasPagosComponent;
  let fixture: ComponentFixture<TipoMatriculasPagosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TipoMatriculasPagosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoMatriculasPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
