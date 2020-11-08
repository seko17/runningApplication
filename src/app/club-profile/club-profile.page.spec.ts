import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ClubProfilePage } from './club-profile.page';

describe('ClubProfilePage', () => {
  let component: ClubProfilePage;
  let fixture: ComponentFixture<ClubProfilePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClubProfilePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ClubProfilePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
