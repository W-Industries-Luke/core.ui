import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import {
  ButtonComponent,
  CheckboxComponent,
  FormFieldComponent,
  InputComponent,
  RadioGroupComponent,
  SelectComponent,
  TextareaComponent,
} from '../public-api';

const meta: Meta<FormFieldComponent> = {
  title: 'Components/Form Field',
  component: FormFieldComponent,
  tags: ['autodocs'],
  decorators: [
    moduleMetadata({
      imports: [
        FormFieldComponent,
        InputComponent,
        TextareaComponent,
        SelectComponent,
        CheckboxComponent,
        RadioGroupComponent,
        ButtonComponent,
        ReactiveFormsModule,
      ],
    }),
  ],
  argTypes: {
    label: { control: 'text' },
    hint: { control: 'text' },
    error: { control: 'text' },
    required: { control: 'boolean' },
    appearance: { control: 'inline-radio', options: ['stacked', 'float'] },
  },
  parameters: {
    controls: {
      exclude: [
        'controlId',
        'isRequired',
        'showError',
        'errorMessage',
        'hintId',
        'errorId',
        'floatingLabel',
        'isFloated',
      ],
    },
  },
  args: {
    label: 'Email',
    hint: 'We never share it.',
    error: '',
    required: undefined,
    appearance: 'stacked',
  },
  render: (args) => ({
    props: { ...args, control: new FormControl('', [Validators.required, Validators.email]) },
    template: `
      <core-form-field
        [label]="label"
        [hint]="hint"
        [error]="error"
        [required]="required"
        [appearance]="appearance"
      >
        <core-input type="email" [formControl]="control" />
      </core-form-field>
    `,
  }),
};

export default meta;
type Story = StoryObj<FormFieldComponent>;

/**
 * The wrapper finds the projected control through content projection, so it can
 * label it, mirror its validation state, and point its `aria-describedby` at
 * whichever of the hint or error is currently rendered.
 */
export const Default: Story = {};

/** The required marker follows the control's own `Validators.required`. */
export const Required: Story = {
  render: (args) => ({
    props: { ...args, control: new FormControl('', Validators.required) },
    template: `
      <core-form-field [label]="label" [hint]="hint">
        <core-input [formControl]="control" />
      </core-form-field>
    `,
  }),
};

/**
 * `error` overrides the control's own message — for server-side failures no
 * validator knows about. It shows immediately, without waiting for a touch.
 */
export const ServerError: Story = {
  args: { error: 'That address is already registered.' },
};

/** One field per control type, wired to a single reactive form. */
export const WholeForm: Story = {
  parameters: { controls: { disable: true } },
  render: () => {
    const form = new FormBuilder().group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      status: [null as number | null, Validators.required],
      channel: [null as string | null, Validators.required],
      notes: ['', Validators.maxLength(200)],
      terms: [false, Validators.requiredTrue],
    });

    return {
      props: {
        form,
        statuses: [
          { label: 'Draft', value: 1 },
          { label: 'Published', value: 2 },
        ],
        channels: [
          { label: 'Email', value: 'email' },
          { label: 'SMS', value: 'sms' },
        ],
      },
      template: `
        <form [formGroup]="form" class="sb-stack" style="max-width: 32rem">
          <core-form-field label="Full name">
            <core-input formControlName="name" />
          </core-form-field>

          <core-form-field label="Email" hint="We never share it.">
            <core-input type="email" formControlName="email" />
          </core-form-field>

          <core-form-field label="Status">
            <core-select formControlName="status" [options]="statuses" placeholder="Choose one" />
          </core-form-field>

          <core-form-field label="How should we reach you?">
            <core-radio-group formControlName="channel" [options]="channels" orientation="horizontal" />
          </core-form-field>

          <core-form-field label="Notes" hint="Up to 200 characters.">
            <core-textarea formControlName="notes" [rows]="3" />
          </core-form-field>

          <core-form-field>
            <core-checkbox formControlName="terms" label="I accept the terms" />
          </core-form-field>

          <div class="sb-row">
            <core-button type="submit" [disabled]="form.invalid">Submit</core-button>
            <span class="sb-label">form status: {{ form.status }}</span>
          </div>
        </form>
      `,
    };
  },
};

/**
 * `appearance="float"` rests the label inside the control and lifts it to the
 * top edge on focus or once there is a value — click through the fields to see
 * it. Controls that are always showing something of their own (select, date
 * input) keep the label floated, and controls that label themselves (checkbox,
 * radio group) stay stacked whatever the appearance.
 */
export const FloatingLabel: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: {
      text: new FormControl(''),
      filled: new FormControl('ada@example.com'),
      date: new FormControl(''),
      status: new FormControl<number | null>(null),
      notes: new FormControl(''),
      terms: new FormControl(false),
      statuses: [
        { label: 'Draft', value: 1 },
        { label: 'Published', value: 2 },
      ],
    },
    template: `
      <div class="sb-stack" style="max-width: 24rem">
        <core-form-field label="Email" appearance="float">
          <core-input type="email" [formControl]="text" />
        </core-form-field>

        <core-form-field label="Email" appearance="float" hint="Starts floated: it has a value.">
          <core-input type="email" [formControl]="filled" />
        </core-form-field>

        <core-form-field label="Starts on" appearance="float" hint="A date mask is always visible.">
          <core-input type="date" [formControl]="date" />
        </core-form-field>

        <core-form-field label="Status" appearance="float">
          <core-select [formControl]="status" [options]="statuses" placeholder="Choose one" />
        </core-form-field>

        <core-form-field label="Notes" appearance="float">
          <core-textarea [formControl]="notes" [rows]="3" />
        </core-form-field>

        <core-form-field label="Terms" appearance="float" hint="A checkbox labels itself.">
          <core-checkbox [formControl]="terms" label="I accept the terms" />
        </core-form-field>
      </div>
    `,
  }),
};

/** The same field in both appearances, for comparison. */
export const AppearanceComparison: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    props: { stacked: new FormControl(''), floated: new FormControl('') },
    template: `
      <div class="sb-row" style="align-items: flex-start; gap: 2rem">
        <div style="width: 16rem">
          <div class="sb-label">stacked (default)</div>
          <core-form-field label="Email" hint="We never share it.">
            <core-input type="email" [formControl]="stacked" />
          </core-form-field>
        </div>
        <div style="width: 16rem">
          <div class="sb-label">float</div>
          <core-form-field label="Email" appearance="float" hint="We never share it.">
            <core-input type="email" [formControl]="floated" />
          </core-form-field>
        </div>
      </div>
    `,
  }),
};
