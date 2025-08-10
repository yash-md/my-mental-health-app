import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoIntro } from './logo-intro';

describe('LogoIntro', () => {
  let component: LogoIntro;
  let fixture: ComponentFixture<LogoIntro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoIntro]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LogoIntro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
