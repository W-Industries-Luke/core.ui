import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { FormFieldComponent, InputComponent } from '../public-api';

const meta: Meta<InputComponent> = {
  title: 'Components/Input',
  component: InputComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [InputComponent, FormFieldComponent, ReactiveFormsModule] }),
  ],
  argTypes: {
    type: {
      control: 'inline-radio',
      options: ['text', 'email', 'password', 'number', 'date'],
    },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    id: { control: 'text' },
  },
  // Protected template members compodoc picks up; not public API.
  parameters: { controls: { exclude: ['displayValue', 'isDisabled', 'value'] } },
  args: { type: 'text', placeholder: '', disabled: false, id: '' },
  render: (args) => ({
    props: { ...args, control: new FormControl('') },
    template: `
      <core-form-field label="Full name" hint="As it appears on your ID.">
        <core-input
          [formControl]="control"
          [type]="type"
          [placeholder]="placeholder"
          [disabled]="disabled"
        />
      </core-form-field>
    `,
  }),
};

export default meta;
type Story = StoryObj<InputComponent>;

export const Default: Story = {};

export const WithPlaceholder: Story = {
  args: { type: 'email', placeholder: 'you@example.com' },
};

export const Disabled: Story = { args: { disabled: true } };

/**
 * `type="number"` reads and writes `number | null`, so the bound control holds
 * a number rather than the element's string value.
 */
export const NumberInput: Story = {
  args: { type: 'number' },
  render: (args) => ({
    props: { ...args, control: new FormControl<number | null>(null) },
    template: `
      <core-form-field label="Quantity" hint="Whole units only.">
        <core-input [formControl]="control" type="number" />
      </core-form-field>
      <p class="sb-label">control value: {{ control.value === null ? 'null' : control.value }}</p>
    `,
  }),
};

/** Every type the control accepts, side by side. */
export const AllTypes: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { control: new FormControl('') },
    template: `
      <div class="sb-stack">
        @for (type of ['text', 'email', 'password', 'number', 'date']; track type) {
          <core-form-field [label]="type">
            <core-input [type]="type" [formControl]="control" />
          </core-form-field>
        }
      </div>
    `,
  }),
};

/** The error appears only after the field has been touched — focus, then blur. */
export const Invalid: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { control: new FormControl('', [Validators.required, Validators.email]) },
    template: `
      <core-form-field label="Email" hint="Blur the field to see the error.">
        <core-input type="email" [formControl]="control" />
      </core-form-field>
    `,
  }),
};
