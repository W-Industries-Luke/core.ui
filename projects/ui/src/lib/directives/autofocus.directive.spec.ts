import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AutofocusDirective } from './autofocus.directive';

@Component({
  imports: [AutofocusDirective],
  template: `
    <input class="plain" />
    <input class="focused" coreAutofocus />
  `,
})
class HostComponent {}

describe('AutofocusDirective', () => {
  it('focuses its host element after render', async () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const focused = fixture.nativeElement.querySelector('.focused') as HTMLInputElement;
    expect(document.activeElement).toBe(focused);
  });
});
