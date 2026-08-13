import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { ButtonComponent, CardComponent } from '../public-api';

const meta: Meta<CardComponent> = {
  title: 'Components/Card',
  component: CardComponent,
  tags: ['autodocs'],
  decorators: [moduleMetadata({ imports: [CardComponent, ButtonComponent] })],
  argTypes: { title: { control: 'text' } },
  args: { title: 'Account details' },
  render: (args) => ({
    props: args,
    template: `
      <core-card [title]="title">
        <p>Cards project their body content and pick up surface, border, and radius tokens.</p>
      </core-card>
    `,
  }),
};

export default meta;
type Story = StoryObj<CardComponent>;

export const WithTitle: Story = {};

/** An empty `title` omits the header entirely. */
export const WithoutTitle: Story = { args: { title: '' } };

/** Composed with buttons, closer to real usage. */
export const WithActions: Story = {
  render: (args) => ({
    props: args,
    template: `
      <core-card [title]="title">
        <p>Deleting this account is permanent and cannot be undone.</p>
        <div class="sb-row">
          <core-button variant="danger">Delete account</core-button>
          <core-button variant="secondary">Cancel</core-button>
        </div>
      </core-card>
    `,
  }),
};
