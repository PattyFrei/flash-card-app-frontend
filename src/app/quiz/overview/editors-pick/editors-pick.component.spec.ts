import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorsPickComponent } from './editors-pick.component';

describe('EditorsPickComponent', () => {
  let component: EditorsPickComponent;
  let fixture: ComponentFixture<EditorsPickComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditorsPickComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorsPickComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
