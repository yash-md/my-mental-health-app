import { ComponentFixture, TestBed } from '@angular/core/testing';

import { History } from './history';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('History', () => {
  let component: History;
  let fixture: ComponentFixture<History>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [History, HttpClientTestingModule ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(History);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
