import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendshipListComponent } from './friendship-list.component';

describe('FriendshipListComponent', () => {
  let component: FriendshipListComponent;
  let fixture: ComponentFixture<FriendshipListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendshipListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendshipListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
