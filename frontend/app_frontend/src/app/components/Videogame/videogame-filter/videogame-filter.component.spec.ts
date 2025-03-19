import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideogameFilterComponent } from './videogame-filter.component';

describe('VideogameFilterComponent', () => {
  let component: VideogameFilterComponent;
  let fixture: ComponentFixture<VideogameFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideogameFilterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideogameFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
