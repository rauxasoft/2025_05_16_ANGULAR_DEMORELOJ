import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronoConsoleComponent } from './crono-console.component';

describe('CronoConsoleComponent', () => {
  let component: CronoConsoleComponent;
  let fixture: ComponentFixture<CronoConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CronoConsoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CronoConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
