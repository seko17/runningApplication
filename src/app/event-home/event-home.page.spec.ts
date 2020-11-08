import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EventHomePage } from './event-home.page';

describe('EventHomePage', () => {
  let component: EventHomePage;
  let fixture: ComponentFixture<EventHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EventHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
