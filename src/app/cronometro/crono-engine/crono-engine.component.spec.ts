import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronoEngineComponent } from './crono-engine.component';

describe('CronoEngineComponent', () => {
  let component: CronoEngineComponent;
  let fixture: ComponentFixture<CronoEngineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CronoEngineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CronoEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
