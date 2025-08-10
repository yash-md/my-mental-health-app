import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Profile } from './profile';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile ,HttpClientTestingModule],
      providers: [
              {
                provide: ActivatedRoute,
                useValue: {
                  params: of({}),
                  queryParams: of({}),
                  snapshot: { params: {}, queryParams: {} }
                }
              }
            ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
