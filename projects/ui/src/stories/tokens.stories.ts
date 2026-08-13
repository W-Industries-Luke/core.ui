import type { Meta, StoryObj } from '@storybook/angular';
import { TokenGalleryComponent } from './token-gallery.component';

/**
 * The token names published by `@w-industries-luke/core-themes`. Values are not
 * duplicated here on purpose — the gallery reads them off the live stylesheet.
 */
const COLOR_TOKENS = [
  'color-primary',
  'color-primary-contrast',
  'color-danger',
  'color-danger-contrast',
  'color-background',
  'color-surface',
  'color-border',
  'color-border-subtle',
  'color-text',
  'color-text-muted',
  'color-header',
  'color-header-text',
  'color-header-muted',
  'color-accent-bg',
  'color-accent-border',
  'color-accent-text',
  'color-focus-ring',
] as const;

const meta: Meta<TokenGalleryComponent> = {
  title: 'Design Tokens/Overview',
  component: TokenGalleryComponent,
  parameters: {
    docs: {
      description: {
        component:
          'Live values read from the loaded `core-themes` stylesheet. Flip the **Theme** ' +
          'toolbar control to compare the light and dark scales.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<TokenGalleryComponent>;

/** All 17 color tokens. Swap the theme toolbar to see the dark scale. */
export const Colors: Story = {
  args: { tokens: [...COLOR_TOKENS], preview: 'color' },
};

/** Corner radii. These are theme-independent — identical in light and dark. */
export const Radii: Story = {
  args: { tokens: ['radius-sm', 'radius-md', 'radius-pill'], preview: 'radius' },
};

/** The single elevation token. Also theme-independent. */
export const Shadow: Story = {
  args: { tokens: ['shadow-sm'], preview: 'shadow' },
};

/** The base font stack. */
export const Typography: Story = {
  args: { tokens: ['font-family'], preview: 'font' },
};
