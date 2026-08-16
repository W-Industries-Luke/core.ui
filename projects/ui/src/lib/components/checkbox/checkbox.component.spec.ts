import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CheckboxComponent } from './checkbox.component';

@Component({
  imports: [CheckboxComponent, ReactiveFormsModule],
  template: `<core-checkbox [formControl]="control" label="Email me updates" />`,
})
class HostComponent {
  control = new FormControl<boolean | null>(false);
}

describe('CheckboxComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  function input(): HTMLInputElement {
    return fixture.nativeElement.querySelector('input') as HTMLInputElement;
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
  });

  it('renders its label beside the box', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('span')?.textContent).toBe('Email me updates');
  });

  it('checks itself from the form value', () => {
    fixture.componentInstance.control.setValue(true);
    fixture.detectChanges();

    expect(input().checked).toBe(true);
  });

  it('pushes the toggled state back to the form control', () => {
    fixture.detectChanges();

    input().checked = true;
    input().dispatchEvent(new Event('change'));

    expect(fixture.componentInstance.control.value).toBe(true);
  });

  it('ties its label to the input for click-to-toggle', () => {
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('label')?.getAttribute('for')).toBe(input().id);
  });

  it('reflects the form control disabled state', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    expect(input().disabled).toBe(true);
  });
});
