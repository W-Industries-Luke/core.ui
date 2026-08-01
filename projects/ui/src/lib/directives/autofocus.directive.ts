import { Directive, ElementRef, afterNextRender, inject } from '@angular/core';

/** Focuses the host element once it has rendered (zoneless-safe). */
@Directive({ selector: '[coreAutofocus]' })
export class AutofocusDirective {
  constructor() {
    const element = inject(ElementRef).nativeElement as HTMLElement;
    afterNextRender(() => element.focus());
  }
}
