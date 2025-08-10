import { TestBed } from '@angular/core/testing';
import { Auth } from './auth'; 
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Auth2', () => {
  let service: Auth;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], 
      providers: [Auth]
    });
    service = TestBed.inject(Auth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
