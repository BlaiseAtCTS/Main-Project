import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminApproval } from './admin-approval';

describe('AdminApproval', () => {
  let component: AdminApproval;
  let fixture: ComponentFixture<AdminApproval>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminApproval]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminApproval);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
