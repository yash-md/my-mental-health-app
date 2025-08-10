import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { EditProfileComponent } from './edit-profile';
import { Api } from '../../services/api';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('EditProfileComponent', () => {
  let component: EditProfileComponent;
  let fixture: ComponentFixture<EditProfileComponent>;
  let apiServiceMock: any;

  beforeEach(async () => {
    apiServiceMock = {
      getProfile: jasmine.createSpy('getProfile').and.returnValue(of({ user: { name: 'Test User', email: 'test@example.com', phone: '1234567890' } })),
      updateProfile: jasmine.createSpy('updateProfile').and.returnValue(of({}))
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule, EditProfileComponent, HttpClientTestingModule],
      providers: [{ provide: Api, useValue: apiServiceMock }]
    }).compileComponents();

    fixture = TestBed.createComponent(EditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load profile data on init', () => {
    expect(apiServiceMock.getProfile).toHaveBeenCalled();
    expect(component.editProfileForm.value).toEqual({ name: 'Test User', email: 'test@example.com', phone: '1234567890'});
  });

  it('should call updateProfile on valid form submission', () => {
    component.editProfileForm.setValue({ name: 'Updated User', email: 'updated@example.com', phone: '1234567809'});
    component.onSubmit();
    expect(apiServiceMock.updateProfile).toHaveBeenCalledWith({ name: 'Updated User', email: 'updated@example.com', phone: '1234567809'});
  });

  it('should not call updateProfile on invalid form submission', () => {
    component.editProfileForm.controls['email'].setValue('invalid-email');
    component.onSubmit();
    expect(apiServiceMock.updateProfile).not.toHaveBeenCalled();
  });

  it('should display success message on successful update', () => {
    component.onSubmit();
    expect(component.successMessage).toBe('Profile updated successfully!');
  });

  it('should display error message on failed update', () => {
    apiServiceMock.updateProfile.and.returnValue(throwError(() => new Error('Failed to update')));
    component.onSubmit();
    expect(component.errorMessage).toBe('Failed to update profile.');
  });
});
