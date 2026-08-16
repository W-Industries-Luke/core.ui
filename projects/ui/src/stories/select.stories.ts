import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { CoreOption, FormFieldComponent, SelectComponent } from '../public-api';

const statuses: CoreOption<number>[] = [
  { label: 'Draft', value: 1 },
  { label: 'In review', value: 2 },
  { label: 'Published', value: 3 },
  { label: 'Archived', value: 4, disabled: true },
];

const meta: Meta<SelectComponent<number>> = {
  title: 'Components/Select',
  component: SelectComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({ imports: [SelectComponent, FormFieldComponent, ReactiveFormsModule] }),
  ],
  argTypes: {
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    id: { control: 'text' },
  },
  parameters: { controls: { exclude: ['selectedIndex', 'isDisabled', 'value'] } },
  args: { placeholder: 'Choose a status', disabled: false, id: '', options: statuses },
  render: (args) => ({
    props: { ...args, control: new FormControl<number | null>(null) },
    template: `
      <core-form-field label="Status" hint="Archived entries cannot be selected.">
        <core-select
          [formControl]="control"
          [options]="options"
          [placeholder]="placeholder"
          [disabled]="disabled"
        />
      </core-form-field>
      <p class="sb-label">control value: {{ control.value === null ? 'null' : control.value }}</p>
    `,
  }),
};

export default meta;
type Story = StoryObj<SelectComponent<number>>;

/**
 * Option values round-trip with their original type — pick an option and the
 * bound control holds a `number`, not the option element's string.
 */
export const Default: Story = {};

export const Preselected: Story = {
  render: (args) => ({
    props: { ...args, control: new FormControl<number | null>(3) },
    template: `
      <core-form-field label="Status">
        <core-select [formControl]="control" [options]="options" />
      </core-form-field>
    `,
  }),
};

export const Disabled: Story = { args: { disabled: true } };

export const Invalid: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      options: statuses,
      control: new FormControl<number | null>(null, Validators.required),
    },
    template: `
      <core-form-field label="Status" hint="Blur the field to see the error.">
        <core-select [formControl]="control" [options]="options" placeholder="Choose a status" />
      </core-form-field>
    `,
  }),
};
