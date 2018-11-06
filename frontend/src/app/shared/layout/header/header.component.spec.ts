import { Observable } from 'rxjs/Observable';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { AuthService } from '../../services/auth.service';
import { ScrollInformation } from '../../../app.component';
import { By } from '@angular/platform-browser';
import { DebugElement, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterLinkDirectiveStub } from '../../../../../testing/router-link-directive-stub';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authServiceStub: Partial<AuthService>;
  let linkDes: DebugElement[];
  let routerLinks: RouterLinkDirectiveStub[];

  authServiceStub = {
    isAuthenticated: Observable.of(false)
  };

  const expectedScrollInformation = Observable.of<ScrollInformation>({isUp: true, scrollTopHeight: 1});

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent, RouterLinkDirectiveStub],
      providers: [{provide: AuthService, useValue: authServiceStub}],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.scrollInformation = expectedScrollInformation;
    fixture.detectChanges();
    linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkDirectiveStub));
    routerLinks = linkDes.map(de => de.injector.get(RouterLinkDirectiveStub));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('can get RouterLink from template', () => {
    expect(routerLinks.length).toBe(3, 'Should have 1 routerLink');
    expect(routerLinks[0].linkParams).toBe('/');
    expect(routerLinks[1].linkParams).toBe('/top');
    expect(routerLinks[2].linkParams).toBe('/login');
  });

  it('should show search box', () => {
    expect(fixture.debugElement.queryAll(By.css('input')).length).toBe(2, 'Should have 2 inputs in search form');

    const searchInput = fixture.debugElement.query(By.css('input[name=q]'));
    expect(searchInput.nativeElement.placeholder).toBe('Search here...');

    const searchSubmit = fixture.debugElement.query(By.css('input[type=submit]'));
    expect(searchSubmit.nativeElement.value).toBe('Search');
  });
});
