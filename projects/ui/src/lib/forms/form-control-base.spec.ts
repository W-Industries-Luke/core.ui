import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InputComponent } from '../components/input/input.component';

@Component({
  imports: [InputComponent],
  template: `<core-input [disabled]="disabled" [id]="id" />`,
})
class HostComponent {
  disabled = false;
  id = '';
}

/** The unbound path: a control used as a plain element, with no forms directive. */
describe('FormControlBase without a form control', () => {
  function render(setup: (host: HostComponent) => void = () => {}): HTMLInputElement {
    const fixture = TestBed.createComponent(HostComponent);
    setup(fixture.componentInstance);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('input') as HTMLInputElement;
  }

  it('renders without a bound control', () => {
    const input = render();

    expect(input.value).toBe('');
    expect(input.getAttribute('aria-invalid')).toBeNull();
    expect(input.hasAttribute('required')).toBe(false);
  });

  it('survives a blur with nothing registered to notify', () => {
    const input = render();

    expect(() => input.dispatchEvent(new Event('blur'))).not.toThrow();
  });

  it('keeps typing local instead of throwing', () => {
    const input = render();

    input.value = 'typed';
    expect(() => input.dispatchEvent(new Event('input'))).not.toThrow();
  });

  it('reports no validation state at all', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const control = fixture.debugElement.query(By.directive(InputComponent))
      .componentInstance as InputComponent;

    expect(control.errorText()).toBeNull();
    expect(control.showError()).toBe(false);
    expect(control.required()).toBe(false);
    expect(control.invalid()).toBe(false);
    expect(control.touched()).toBe(false);
  });

  it('honours the standalone disabled input', () => {
    expect(render((host) => (host.disabled = true)).disabled).toBe(true);
  });

  it('generates a unique id per control and takes an explicit one', () => {
    expect(render().id).toMatch(/^core-control-\d+$/);
    expect(render((host) => (host.id = 'email-field')).id).toBe('email-field');
  });
});
