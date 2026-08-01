import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

@Component({
  imports: [ButtonComponent],
  template: `
    <core-button [variant]="variant" [size]="size" [disabled]="disabled" [type]="type">
      Save
    </core-button>
  `,
})
class HostComponent {
  variant: 'primary' | 'secondary' | 'danger' = 'primary';
  size: 'sm' | 'md' = 'md';
  disabled = false;
  type: 'button' | 'submit' = 'button';
}

describe('ButtonComponent', () => {
  function render(overrides: Partial<HostComponent> = {}) {
    const fixture = TestBed.createComponent(HostComponent);
    Object.assign(fixture.componentInstance, overrides);
    fixture.detectChanges();
    return {
      fixture,
      button: fixture.nativeElement.querySelector('button') as HTMLButtonElement,
    };
  }

  it('projects its content', () => {
    const { button } = render();

    expect(button.textContent?.trim()).toBe('Save');
  });

  it('defaults to a primary medium button', () => {
    const { button } = render();

    expect(Array.from(button.classList).sort()).toEqual(['core-btn', 'md', 'primary']);
    expect(button.type).toBe('button');
    expect(button.disabled).toBe(false);
  });

  it('applies variant and size classes', () => {
    const { button } = render({ variant: 'danger', size: 'sm' });

    expect(Array.from(button.classList).sort()).toEqual(['core-btn', 'danger', 'sm']);
  });

  it('renders as a submit button when asked', () => {
    const { button } = render({ type: 'submit' });

    expect(button.type).toBe('submit');
  });

  it('disables the native button', () => {
    const { button } = render({ disabled: true });

    expect(button.disabled).toBe(true);
  });
});
