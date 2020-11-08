import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BookEventPage } from './book-event.page';

describe('BookEventPage', () => {
  let component: BookEventPage;
  let fixture: ComponentFixture<BookEventPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookEventPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BookEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
