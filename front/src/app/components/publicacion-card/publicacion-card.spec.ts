import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublicacionCardComponent } from './publicacion-card';

describe('PublicacionCardComponent', () => {
  let component: PublicacionCardComponent;
  let fixture: ComponentFixture<PublicacionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicacionCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PublicacionCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
