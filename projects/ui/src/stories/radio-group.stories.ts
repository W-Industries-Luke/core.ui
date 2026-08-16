import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CoreOption, FormFieldComponent, RadioGroupComponent } from '../public-api';

const channels: CoreOption<string>[] = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Push notification', value: 'push' },
  { label: 'Post', value: 'post', disabled: true },
];

const meta: Meta<RadioGroupComponent<string>> = {
  title: 'Components/Radio Group',
  component: RadioGroupComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [RadioGroupComponent, FormFieldComponent, ReactiveFormsModule] }),
  ],
  argTypes: {
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
    disabled: { control: 'boolean' },
    id: { control: 'text' },
  },
  parameters: { controls: { exclude: ['groupName', 'isDisabled', 'value'] } },
  args: { orientation: 'vertical', disabled: false, id: '', options: channels },
  render: (args) => ({
    props: { ...args, control: new FormControl<string | null>('email') },
    template: `
      <core-form-field label="How should we reach you?">
        <core-radio-group
          [formControl]="control"
          [options]="options"
          [orientation]="orientation"
          [disabled]="disabled"
        />
      </core-form-field>
    `,
  }),
};

export default meta;
type Story = StoryObj<RadioGroupComponent<string>>;

export const Default: Story = {};

export const Horizontal: Story = { args: { orientation: 'horizontal' } };

export const Disabled: Story = { args: { disabled: true } };

export const Invalid: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      options: channels,
      control: new FormControl<string | null>(null, Validators.required),
    },
    template: `
      <core-form-field label="How should we reach you?" hint="Blur the group to see the error.">
        <core-radio-group [formControl]="control" [options]="options" />
      </core-form-field>
    `,
  }),
};
