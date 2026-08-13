import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { AutofocusDirective, CardComponent } from '../public-api';

const meta: Meta<AutofocusDirective> = {
  title: 'Directives/Autofocus',
  component: AutofocusDirective,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [AutofocusDirective, CardComponent] })],
  parameters: {
    docs: {
      description: {
        component:
          '`[coreAutofocus]` focuses its host after the first render, via `afterNextRender` ' +
          'so it stays zoneless-safe. Reload the story to see the focus ring land.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<AutofocusDirective>;

export const FocusesOnRender: Story = {
  render: () => ({
    template: `
      <core-card title="Sign in">
        <label class="sb-stack">
          <span class="sb-label">Email (focused on render)</span>
          <input coreAutofocus type="email" placeholder="you@example.com" />
        </label>
      </core-card>
    `,
  }),
};

/** Without the directive, for comparison — focus stays where it was. */
export const WithoutDirective: Story = {
  render: () => ({
    template: `
      <core-card title="Sign in">
        <label class="sb-stack">
          <span class="sb-label">Email (not focused)</span>
          <input type="email" placeholder="you@example.com" />
        </label>
      </core-card>
    `,
  }),
};
