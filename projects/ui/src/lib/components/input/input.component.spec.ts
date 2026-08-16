import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent, InputType } from './input.component';

@Component({
  imports: [InputComponent, ReactiveFormsModule],
  template: `<core-input [formControl]="control" [type]="type" [placeholder]="placeholder" />`,
})
class HostComponent {
  control = new FormControl<string | number | null>('');
  type: InputType = 'text';
  placeholder = '';
}

describe('InputComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  function render(): HTMLInputElement {
    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('input') as HTMLInputElement;
  }

  function type(input: HTMLInputElement, value: string): void {
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('writes the form value into the element', () => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.setValue('hello');
    fixture.detectChanges();

    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).value).toBe('hello');
  });

  it('pushes typed text back to the form control', () => {
    const input = render();

    type(input, 'typed');

    expect(fixture.componentInstance.control.value).toBe('typed');
  });

  it('emits numbers, not strings, for type="number"', () => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.type = 'number';
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    type(input, '42');

    expect(fixture.componentInstance.control.value).toBe(42);
  });

  it('emits null for a cleared number rather than NaN', () => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.type = 'number';
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    type(input, '');

    expect(fixture.componentInstance.control.value).toBeNull();
  });

  it('renders an empty string when the value is null', () => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.setValue(null);
    fixture.detectChanges();

    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).value).toBe('');
  });

  it('reflects the form control disabled state', () => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).disabled).toBe(true);
  });

  it('marks itself invalid only once touched', () => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control = new FormControl('', Validators.required);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    expect(input.getAttribute('aria-invalid')).toBeNull();

    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('marks the element required from the control validator', () => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.control = new FormControl('', Validators.required);
    fixture.detectChanges();

    expect(
      (fixture.nativeElement.querySelector('input') as HTMLInputElement).hasAttribute('required'),
    ).toBe(true);
  });

  it('passes the placeholder through', () => {
    fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.placeholder = 'you@example.com';
    fixture.detectChanges();

    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).placeholder).toBe(
      'you@example.com',
    );
  });
});
