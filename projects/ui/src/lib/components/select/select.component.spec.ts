import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CoreOption, SelectComponent } from './select.component';

@Component({
  imports: [SelectComponent, ReactiveFormsModule],
  template: `
    <core-select [formControl]="control" [options]="options" [placeholder]="placeholder" />
  `,
})
class HostComponent {
  control = new FormControl<number | null>(null);
  options: CoreOption<number>[] = [
    { label: 'Draft', value: 1 },
    { label: 'Published', value: 2 },
    { label: 'Archived', value: 3, disabled: true },
  ];
  placeholder = '';
}

describe('SelectComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  function select(): HTMLSelectElement {
    return fixture.nativeElement.querySelector('select') as HTMLSelectElement;
  }

  function options(): HTMLOptionElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll('option'));
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
  });

  it('renders one option per entry', () => {
    fixture.detectChanges();

    expect(options().map((option) => option.textContent?.trim())).toEqual([
      'Draft',
      'Published',
      'Archived',
    ]);
  });

  it('selects the option matching the form value', () => {
    fixture.componentInstance.control.setValue(2);
    fixture.detectChanges();

    expect(options()[1].selected).toBe(true);
  });

  it('emits the option value with its original type, not the option string', () => {
    fixture.detectChanges();

    select().value = '1';
    select().dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.control.value).toBe(2);
  });

  it('clears the value when nothing is selected', () => {
    fixture.componentInstance.control.setValue(1);
    fixture.detectChanges();

    // What a browser shows when the bound value matches no option: an empty
    // element value, which must not be read as index 0.
    select().selectedIndex = -1;
    select().dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.control.value).toBeNull();
  });

  it('disables individual options', () => {
    fixture.detectChanges();

    expect(options()[2].disabled).toBe(true);
  });

  it('renders a leading placeholder option while nothing is selected', () => {
    fixture.componentInstance.placeholder = 'Choose a status';
    fixture.detectChanges();

    const first = options()[0];
    expect(first.textContent?.trim()).toBe('Choose a status');
    expect(first.disabled).toBe(true);
    expect(first.selected).toBe(true);
  });

  it('deselects the placeholder once a value is set', () => {
    fixture.componentInstance.placeholder = 'Choose a status';
    fixture.componentInstance.control.setValue(1);
    fixture.detectChanges();

    expect(options()[0].selected).toBe(false);
  });
});
