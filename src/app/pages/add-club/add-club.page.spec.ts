import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddClubPage } from './add-club.page';

describe('AddClubPage', () => {
  let component: AddClubPage;
  let fixture: ComponentFixture<AddClubPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddClubPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddClubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
