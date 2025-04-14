import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FriendshipPendingListComponent } from './friendship-pending-list.component';

describe('FriendshipPendingListComponent', () => {
  let component: FriendshipPendingListComponent;
  let fixture: ComponentFixture<FriendshipPendingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FriendshipPendingListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FriendshipPendingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
