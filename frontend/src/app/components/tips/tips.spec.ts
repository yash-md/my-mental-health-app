import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Tips } from './tips';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { Api } from '../../services/api';

describe('Tips', () => {
  let component: Tips;
  let fixture: ComponentFixture<Tips>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tips, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute,
          useValue: {
            queryParams: of({})
          }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tips);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
