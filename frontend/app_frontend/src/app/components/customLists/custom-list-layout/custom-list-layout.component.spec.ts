import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomListLayoutComponent } from './custom-list-layout.component';

describe('CustomListLayoutComponent', () => {
  let component: CustomListLayoutComponent;
  let fixture: ComponentFixture<CustomListLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomListLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomListLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
