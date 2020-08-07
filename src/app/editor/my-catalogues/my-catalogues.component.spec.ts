import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyCataloguesComponent } from './my-catalogues.component';

describe('MyCataloguesComponent', () => {
  let component: MyCataloguesComponent;
  let fixture: ComponentFixture<MyCataloguesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyCataloguesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyCataloguesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
