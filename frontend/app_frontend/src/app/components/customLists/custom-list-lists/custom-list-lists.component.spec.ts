import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomListListsComponent } from './custom-list-lists.component';

describe('CustomListListsComponent', () => {
  let component: CustomListListsComponent;
  let fixture: ComponentFixture<CustomListListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomListListsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomListListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
