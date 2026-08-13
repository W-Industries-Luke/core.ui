import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent } from '../public-api';

const meta: Meta<ButtonComponent> = {
  title: 'Components/Button',
  component: ButtonComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [ButtonComponent] })],
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'danger'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    type: { control: 'inline-radio', options: ['button', 'submit'] },
    disabled: { control: 'boolean' },
  },
  // `classes` is a protected computed; compodoc documents it, but it is not
  // part of the component's public API. (It cannot be hidden via `argTypes` —
  // protected members are not in `keyof ButtonComponent`.)
  parameters: { controls: { exclude: ['classes'] } },
  args: { variant: 'primary', size: 'md', disabled: false, type: 'button' },
  render: (args) => ({
    props: args,
    template: `
      <core-button [variant]="variant" [size]="size" [disabled]="disabled" [type]="type">
        Save changes
      </core-button>
    `,
  }),
};

export default meta;
type Story = StoryObj<ButtonComponent>;

export const Primary: Story = {};

export const Secondary: Story = { args: { variant: 'secondary' } };

export const Danger: Story = { args: { variant: 'danger' } };

export const Disabled: Story = { args: { disabled: true } };

/** Every variant at both sizes — the quickest way to eyeball the whole set. */
export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => ({
    template: `
      <div class="sb-stack">
        @for (size of ['md', 'sm']; track size) {
          <div>
            <div class="sb-label">size: {{ size }}</div>
            <div class="sb-row">
              @for (variant of ['primary', 'secondary', 'danger']; track variant) {
                <core-button [variant]="variant" [size]="size">{{ variant }}</core-button>
                <core-button [variant]="variant" [size]="size" [disabled]="true">
                  {{ variant }} disabled
                </core-button>
              }
            </div>
          </div>
        }
      </div>
    `,
  }),
};
