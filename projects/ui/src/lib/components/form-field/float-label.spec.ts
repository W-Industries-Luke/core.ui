import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from '../checkbox/checkbox.component';
import { InputComponent, InputType } from '../input/input.component';
import { RadioGroupComponent } from '../radio-group/radio-group.component';
import { SelectComponent } from '../select/select.component';
import { TextareaComponent } from '../textarea/textarea.component';
import { FieldAppearance, FormFieldComponent } from './form-field.component';

@Component({
  imports: [FormFieldComponent, InputComponent, ReactiveFormsModule],
  template: `
    <core-form-field [label]="label" [appearance]="appearance">
      <core-input [formControl]="control" [type]="type" />
    </core-form-field>
  `,
})
class InputHost {
  control = new FormControl<string | number | null>('');
  label = 'Email';
  appearance: FieldAppearance = 'float';
  type: InputType = 'text';
}

describe('floating label', () => {
  let fixture: ComponentFixture<InputHost>;

  function field(): HTMLElement {
    return fixture.nativeElement.querySelector('.core-field') as HTMLElement;
  }

  function input(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input') as HTMLInputElement;
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(InputHost);
  });

  it('rests inside the control while empty and unfocused', () => {
    fixture.detectChanges();

    expect(field().classList).toContain('floating');
    expect(field().classList).not.toContain('floated');
  });

  it('floats on focus and settles back on blur', () => {
    fixture.detectChanges();

    input().dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect(field().classList).toContain('floated');

    input().dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(field().classList).not.toContain('floated');
  });

  it('stays floated while the control holds a value', () => {
    fixture.componentInstance.control.setValue('typed');
    fixture.detectChanges();

    expect(field().classList).toContain('floated');
  });

  it('treats a zero as a value rather than empty', () => {
    fixture.componentInstance.control.setValue(0);
    fixture.detectChanges();

    expect(field().classList).toContain('floated');
  });

  it('tells the control to reserve room for the label', () => {
    fixture.detectChanges();

    expect(input().classList).toContain('float');
  });

  it('still marks the control touched on blur', () => {
    fixture.detectChanges();

    input().dispatchEvent(new Event('blur'));

    expect(fixture.componentInstance.control.touched).toBe(true);
  });

  it('stays stacked by default', () => {
    fixture.componentInstance.appearance = 'stacked';
    fixture.detectChanges();

    expect(field().classList).not.toContain('floating');
    expect(input().classList).not.toContain('float');
  });

  it('does not float without a label to float', () => {
    fixture.componentInstance.label = '';
    fixture.detectChanges();

    expect(field().classList).not.toContain('floating');
  });

  it('keeps a date input floated — its format mask is always visible', () => {
    fixture.componentInstance.type = 'date';
    fixture.detectChanges();

    expect(field().classList).toContain('floated');
  });

  describe('without a projected control', () => {
    @Component({
      imports: [FormFieldComponent],
      template: `<core-form-field label="Orphan" appearance="float" />`,
    })
    class EmptyHost {}

    it('renders the resting label and never floats it', () => {
      const empty = TestBed.createComponent(EmptyHost);
      empty.detectChanges();

      const el = empty.nativeElement.querySelector('.core-field') as HTMLElement;
      expect(el.classList).toContain('floating');
      expect(el.classList).not.toContain('floated');
    });
  });

  describe('per control type', () => {
    @Component({
      imports: [
        FormFieldComponent,
        TextareaComponent,
        SelectComponent,
        CheckboxComponent,
        RadioGroupComponent,
        ReactiveFormsModule,
      ],
      template: `
        <core-form-field label="Notes" appearance="float" class="notes">
          <core-textarea [formControl]="control" />
        </core-form-field>
        <core-form-field label="Status" appearance="float" class="status">
          <core-select [formControl]="control" [options]="options" />
        </core-form-field>
        <core-form-field label="Terms" appearance="float" class="terms">
          <core-checkbox [formControl]="control" label="I accept" />
        </core-form-field>
        <core-form-field label="Channel" appearance="float" class="channel">
          <core-radio-group [formControl]="control" [options]="options" />
        </core-form-field>
      `,
    })
    class AllHost {
      control = new FormControl<string | null>(null);
      options = [{ label: 'One', value: 'one' }];
    }

    let all: ComponentFixture<AllHost>;

    function fieldOf(name: string): HTMLElement {
      return all.nativeElement.querySelector(`.${name} .core-field`) as HTMLElement;
    }

    beforeEach(() => {
      all = TestBed.createComponent(AllHost);
      all.detectChanges();
    });

    it('rests the label over an empty textarea', () => {
      expect(fieldOf('notes').classList).toContain('floating');
      expect(fieldOf('notes').classList).not.toContain('floated');
    });

    it('keeps a select floated — it always shows an option', () => {
      expect(fieldOf('status').classList).toContain('floated');
    });

    it('leaves a checkbox stacked — it labels itself', () => {
      expect(fieldOf('terms').classList).not.toContain('floating');
    });

    it('leaves a radio group stacked — the options are always visible', () => {
      expect(fieldOf('channel').classList).not.toContain('floating');
    });
  });
});
