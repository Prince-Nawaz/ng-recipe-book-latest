import { TestBed, async } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppComponent } from './app.component';
import { LoggingService } from './logging.service';

describe('AppComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [{ provide: Store, useClass: TestStore }, LoggingService],
    });
    TestBed.compileComponents();
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});

export class TestStore {
  private state = new BehaviorSubject(undefined);

  setState(data: any) {
    this.state.next(data);
  }

  select(selector?: any): Observable<any> {
    return this.state.asObservable();
  }

  dispatch(action: any) {}
}
