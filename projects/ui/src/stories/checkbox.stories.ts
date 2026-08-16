import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CheckboxComponent, FormFieldComponent } from '../public-api';

const meta: Meta<CheckboxComponent> = {
  title: 'Components/Checkbox',
  component: CheckboxComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [CheckboxComponent, FormFieldComponent, ReactiveFormsModule] }),
  ],
  argTypes: {
    label: { control: 'text' },
    disabled: { control: 'boolean' },
    id: { control: 'text' },
  },
  parameters: { controls: { exclude: ['isDisabled', 'value'] } },
  args: { label: 'Email me product updates', disabled: false, id: '' },
  render: (args) => ({
    props: { ...args, control: new FormControl(false) },
    template: `
      <core-checkbox [formControl]="control" [label]="label" [disabled]="disabled" />
    `,
  }),
};

export default meta;
type Story = StoryObj<CheckboxComponent>;

/** The label belongs beside the box, so the checkbox owns it rather than the field. */
export const Default: Story = {};

export const Checked: Story = {
  render: (args) => ({
    props: { ...args, control: new FormControl(true) },
    template: `<core-checkbox [formControl]="control" [label]="label" />`,
  }),
};

export const Disabled: Story = { args: { disabled: true } };

/**
 * Wrapped in a field for the error only — leave the wrapper's `label` unset so
 * the checkbox is not labelled twice.
 */
export const Invalid: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { control: new FormControl(false, Validators.requiredTrue) },
    template: `
      <core-form-field hint="Blur the checkbox to see the error.">
        <core-checkbox [formControl]="control" label="I accept the terms" />
      </core-form-field>
    `,
  }),
};
