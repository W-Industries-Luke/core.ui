import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CoreOption } from '../select/select.component';
import { RadioGroupComponent } from './radio-group.component';

@Component({
  imports: [RadioGroupComponent, ReactiveFormsModule],
  template: `<core-radio-group [formControl]="control" [options]="options" />`,
})
class HostComponent {
  control = new FormControl<string | null>(null);
  options: CoreOption<string>[] = [
    { label: 'Email', value: 'email' },
    { label: 'SMS', value: 'sms' },
    { label: 'Post', value: 'post', disabled: true },
  ];
}

describe('RadioGroupComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  function radios(): HTMLInputElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('input'));
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
  });

  it('renders one radio per option inside a radiogroup', () => {
    fixture.detectChanges();

    expect(radios().length).toBe(3);
    expect(fixture.nativeElement.querySelector('[role="radiogroup"]')).not.toBeNull();
  });

  it('gives every radio the same name so they behave as one group', () => {
    fixture.detectChanges();

    const names = new Set(radios().map((radio) => radio.name));
    expect(names.size).toBe(1);
  });

  it('checks the radio matching the form value', () => {
    fixture.componentInstance.control.setValue('sms');
    fixture.detectChanges();

    expect(radios()[1].checked).toBe(true);
  });

  it('pushes the chosen value back to the form control', () => {
    fixture.detectChanges();

    radios()[0].dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.control.value).toBe('email');
  });

  it('disables individual options', () => {
    fixture.detectChanges();

    expect(radios()[2].disabled).toBe(true);
  });

  it('puts the control id on the first radio so a field label can focus it', () => {
    fixture.detectChanges();

    expect(radios()[0].id).toBeTruthy();
    expect(radios()[1].id).toBe('');
  });

  it('disables every radio when the form control is disabled', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    expect(radios().every((radio) => radio.disabled)).toBe(true);
  });
});
