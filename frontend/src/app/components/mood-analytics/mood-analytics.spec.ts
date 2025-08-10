import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoodAnalytics } from './mood-analytics';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('MoodAnalytics', () => {
  let component: MoodAnalytics;
  let fixture: ComponentFixture<MoodAnalytics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MoodAnalytics, HttpClientTestingModule], 
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

    fixture = TestBed.createComponent(MoodAnalytics);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
