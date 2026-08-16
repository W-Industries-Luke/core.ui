import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CORE_ERROR_MESSAGES } from '../../forms/core-control';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { InputComponent } from '../input/input.component';
import { RadioGroupComponent } from '../radio-group/radio-group.component';
import { SelectComponent } from '../select/select.component';
import { TextareaComponent } from '../textarea/textarea.component';
import { FormFieldComponent } from './form-field.component';

@Component({
  imports: [FormFieldComponent, InputComponent, ReactiveFormsModule],
  template: `
    <core-form-field [label]="label" [hint]="hint" [error]="error" [required]="required">
      <core-input [formControl]="control" />
    </core-form-field>
  `,
})
class HostComponent {
  control = new FormControl<string | null>('');
  label = 'Email';
  hint = '';
  error = '';
  required: boolean | undefined = undefined;
}

describe('FormFieldComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  function query(selector: string): HTMLElement | null {
    return fixture.nativeElement.querySelector(selector);
  }

  function input(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input') as HTMLInputElement;
  }

  function blur(): void {
    input().dispatchEvent(new Event('blur'));
    fixture.detectChanges();
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
  });

  it('labels the projected control', () => {
    fixture.detectChanges();

    expect(query('.core-field-label')?.textContent?.trim()).toBe('Email');
    expect(query('.core-field-label')?.getAttribute('for')).toBe(input().id);
  });

  it('marks the field required from the control validator', () => {
    fixture.componentInstance.control = new FormControl('', Validators.required);
    fixture.detectChanges();

    expect(query('.core-field-required')).not.toBeNull();
  });

  it('lets the required marker be forced on', () => {
    fixture.componentInstance.required = true;
    fixture.detectChanges();

    expect(query('.core-field-required')).not.toBeNull();
  });

  it('shows the hint and points the control at it', () => {
    fixture.componentInstance.hint = 'We never share it.';
    fixture.detectChanges();

    expect(query('.core-field-hint')?.textContent).toBe('We never share it.');
    expect(input().getAttribute('aria-describedby')).toBe(query('.core-field-hint')?.id);
  });

  it('holds the error back until the control is touched', () => {
    fixture.componentInstance.control = new FormControl('', Validators.required);
    fixture.detectChanges();

    expect(query('.core-field-error')).toBeNull();

    blur();

    expect(query('.core-field-error')?.textContent).toBe('This field is required.');
  });

  it('points the control at the error once shown', () => {
    fixture.componentInstance.control = new FormControl('', Validators.required);
    fixture.componentInstance.hint = 'We never share it.';
    fixture.detectChanges();
    blur();

    expect(input().getAttribute('aria-describedby')).toBe(query('.core-field-error')?.id);
  });

  it('replaces the hint with the error rather than showing both', () => {
    fixture.componentInstance.control = new FormControl('', Validators.required);
    fixture.componentInstance.hint = 'We never share it.';
    fixture.detectChanges();
    blur();

    expect(query('.core-field-hint')).toBeNull();
  });

  it('builds the message from the failing validator', () => {
    fixture.componentInstance.control = new FormControl('ab', Validators.minLength(5));
    fixture.detectChanges();
    blur();

    expect(query('.core-field-error')?.textContent).toBe('Enter at least 5 characters.');
  });

  it('shows an explicit error immediately, without waiting for a touch', () => {
    fixture.componentInstance.error = 'That address is already registered.';
    fixture.detectChanges();

    expect(query('.core-field-error')?.textContent).toBe('That address is already registered.');
  });

  it('renders nothing for a validator with no configured message', () => {
    fixture.componentInstance.control = new FormControl('', () => ({ unmapped: true }));
    fixture.detectChanges();
    blur();

    expect(query('.core-field-error')?.textContent).toBe('');
  });

  describe('wrapping each control type', () => {
    @Component({
      imports: [
        FormFieldComponent,
        InputComponent,
        TextareaComponent,
        SelectComponent,
        CheckboxComponent,
        RadioGroupComponent,
        ReactiveFormsModule,
      ],
      template: `
        <core-form-field label="Text"><core-input [formControl]="control" /></core-form-field>
        <core-form-field label="Notes"><core-textarea [formControl]="control" /></core-form-field>
        <core-form-field label="Status">
          <core-select [formControl]="control" [options]="options" />
        </core-form-field>
        <core-form-field><core-checkbox [formControl]="control" label="Opt in" /></core-form-field>
        <core-form-field label="Channel">
          <core-radio-group [formControl]="control" [options]="options" />
        </core-form-field>
      `,
    })
    class AllControlsHost {
      control = new FormControl<string | null>(null);
      options = [{ label: 'One', value: 'one' }];
    }

    it('labels every control type it wraps', () => {
      const all = TestBed.createComponent(AllControlsHost);
      all.detectChanges();

      const labels: HTMLLabelElement[] = Array.from(
        all.nativeElement.querySelectorAll('.core-field-label'),
      );
      expect(labels.length).toBe(4);
      for (const label of labels) {
        const target = all.nativeElement.querySelector(`#${label.getAttribute('for')}`);
        expect(target).not.toBeNull();
      }
    });
  });

  describe('without a projected control', () => {
    @Component({
      imports: [FormFieldComponent],
      template: `<core-form-field label="Orphan" hint="No control here" [error]="error" />`,
    })
    class EmptyHost {
      error = '';
    }

    it('still renders its label and hint', () => {
      const empty = TestBed.createComponent(EmptyHost);
      empty.detectChanges();

      expect(empty.nativeElement.querySelector('.core-field-label')?.textContent?.trim()).toBe(
        'Orphan',
      );
      expect(empty.nativeElement.querySelector('.core-field-hint')?.id).toBe('core-field-hint');
    });

    it('still renders an explicit error', () => {
      const empty = TestBed.createComponent(EmptyHost);
      empty.componentInstance.error = 'Something went wrong.';
      empty.detectChanges();

      const error = empty.nativeElement.querySelector('.core-field-error') as HTMLElement;
      expect(error.textContent).toBe('Something went wrong.');
      expect(error.id).toBe('core-field-error');
    });
  });

  describe('with overridden messages', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        providers: [{ provide: CORE_ERROR_MESSAGES, useValue: { required: 'Required, sorry.' } }],
      });
      fixture = TestBed.createComponent(HostComponent);
    });

    it('uses the app-provided message map', () => {
      fixture.componentInstance.control = new FormControl('', Validators.required);
      fixture.detectChanges();
      blur();

      expect(query('.core-field-error')?.textContent).toBe('Required, sorry.');
    });
  });
});
