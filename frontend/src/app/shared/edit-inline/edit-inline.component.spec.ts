import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInlineComponent } from './edit-inline.component';

describe('EditInlineComponent', () => {
  let component: EditInlineComponent;
  let fixture: ComponentFixture<EditInlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditInlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditInlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
