import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClubHomePage } from './club-home.page';

describe('ClubHomePage', () => {
  let component: ClubHomePage;
  let fixture: ComponentFixture<ClubHomePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubHomePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClubHomePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
