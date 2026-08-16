import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextareaComponent } from './textarea.component';

@Component({
  imports: [TextareaComponent, ReactiveFormsModule],
  template: `<core-textarea [formControl]="control" [rows]="rows" />`,
})
class HostComponent {
  control = new FormControl<string | null>('');
  rows = 4;
}

describe('TextareaComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  function element(): HTMLTextAreaElement {
    return fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;
  }

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
  });

  it('writes the form value into the element', () => {
    fixture.componentInstance.control.setValue('notes');
    fixture.detectChanges();

    expect(element().value).toBe('notes');
  });

  it('pushes typed text back to the form control', () => {
    fixture.detectChanges();

    element().value = 'typed';
    element().dispatchEvent(new Event('input'));

    expect(fixture.componentInstance.control.value).toBe('typed');
  });

  it('applies the row count', () => {
    fixture.componentInstance.rows = 8;
    fixture.detectChanges();

    expect(element().rows).toBe(8);
  });

  it('reflects the form control disabled state', () => {
    fixture.componentInstance.control.disable();
    fixture.detectChanges();

    expect(element().disabled).toBe(true);
  });
});
