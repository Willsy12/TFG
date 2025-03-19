import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideogameLayoutComponent } from './videogame-layout.component';

describe('VideogameLayoutComponent', () => {
  let component: VideogameLayoutComponent;
  let fixture: ComponentFixture<VideogameLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideogameLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideogameLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
