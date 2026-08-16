import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { FormFieldComponent, TextareaComponent } from '../public-api';

const meta: Meta<TextareaComponent> = {
  title: 'Components/Textarea',
  component: TextareaComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [TextareaComponent, FormFieldComponent, ReactiveFormsModule] }),
  ],
  argTypes: {
    rows: { control: { type: 'number', min: 2, max: 20 } },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    id: { control: 'text' },
  },
  parameters: { controls: { exclude: ['isDisabled', 'value'] } },
  args: { rows: 4, placeholder: '', disabled: false, id: '' },
  render: (args) => ({
    props: { ...args, control: new FormControl('') },
    template: `
      <core-form-field label="Notes" hint="Markdown is not rendered.">
        <core-textarea
          [formControl]="control"
          [rows]="rows"
          [placeholder]="placeholder"
          [disabled]="disabled"
        />
      </core-form-field>
    `,
  }),
};

export default meta;
type Story = StoryObj<TextareaComponent>;

export const Default: Story = {};

export const Tall: Story = { args: { rows: 10 } };

export const Disabled: Story = { args: { disabled: true } };

/** A length validator reports through the same field wrapper. */
export const Invalid: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { control: new FormControl('too short', Validators.minLength(20)) },
    template: `
      <core-form-field label="Notes" hint="Blur the field to see the error.">
        <core-textarea [formControl]="control" />
      </core-form-field>
    `,
  }),
};
