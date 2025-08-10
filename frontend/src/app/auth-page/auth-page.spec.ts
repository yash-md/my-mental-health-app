import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthPage } from './auth-page';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthPage', () => {
  let component: AuthPage;
  let fixture: ComponentFixture<AuthPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthPage, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
