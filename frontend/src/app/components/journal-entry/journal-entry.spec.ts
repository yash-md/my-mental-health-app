import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalEntry } from './journal-entry';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('JournalEntry', () => {
  let component: JournalEntry;
  let fixture: ComponentFixture<JournalEntry>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JournalEntry, HttpClientTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalEntry);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
