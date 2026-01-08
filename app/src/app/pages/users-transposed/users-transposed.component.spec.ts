import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersTransposedComponent } from './users-transposed.component';

describe('UsersTransposedComponent', () => {
  let component: UsersTransposedComponent;
  let fixture: ComponentFixture<UsersTransposedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsersTransposedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersTransposedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
