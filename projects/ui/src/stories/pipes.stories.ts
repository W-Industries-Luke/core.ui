import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { InitialsPipe, TruncatePipe } from '../public-api';

type PipeArgs = { value: string; max: number; limit: number; ellipsis: string };

const meta: Meta<PipeArgs> = {
  title: 'Pipes/Overview',
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [InitialsPipe, TruncatePipe] })],
  argTypes: {
    value: { control: 'text' },
    max: { control: { type: 'number', min: 1, max: 5 } },
    limit: { control: { type: 'number', min: 1, max: 80 } },
    ellipsis: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<PipeArgs>;

/** `coreInitials` — first letter of up to `max` words, uppercased. */
export const Initials: Story = {
  args: { value: 'Jane Quinn Doe', max: 2, limit: 25, ellipsis: '…' },
  render: (args) => ({
    props: args,
    template: `
      <div class="sb-stack">
        <div><span class="sb-label">input</span> <code>{{ value }}</code></div>
        <div><span class="sb-label">max</span> <code>{{ max }}</code></div>
        <div><span class="sb-label">output</span> <code>{{ value | coreInitials: max }}</code></div>
      </div>
    `,
  }),
};

/** `coreTruncate` — cuts to `limit` characters and appends the ellipsis. */
export const Truncate: Story = {
  args: {
    value: 'The quick brown fox jumps over the lazy dog',
    max: 2,
    limit: 25,
    ellipsis: '…',
  },
  render: (args) => ({
    props: args,
    template: `
      <div class="sb-stack">
        <div><span class="sb-label">input</span> <code>{{ value }}</code></div>
        <div><span class="sb-label">limit</span> <code>{{ limit }}</code></div>
        <div>
          <span class="sb-label">output</span>
          <code>{{ value | coreTruncate: limit : ellipsis }}</code>
        </div>
      </div>
    `,
  }),
};
