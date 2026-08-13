import { setCompodocJson } from '@storybook/addon-docs/angular';
import type { Decorator, Preview } from '@storybook/angular';
import docJson from '../documentation.json';

setCompodocJson(docJson);

/**
 * `@w-industries-luke/core-themes` only defines its tokens at `:root`
 * (`:root.core-theme-dark` forces dark), so the switch has to happen on the
 * preview iframe's <html> element rather than on a wrapper node.
 */
const withCoreTheme: Decorator = (story, context) => {
  const theme = context.globals['theme'] === 'dark' ? 'dark' : 'light';
  const root = document.documentElement;
  root.classList.remove('core-theme-light', 'core-theme-dark');
  root.classList.add(`core-theme-${theme}`);
  return story();
};

const preview: Preview = {
  decorators: [withCoreTheme],
  initialGlobals: { theme: 'light' },
  globalTypes: {
    theme: {
      description: 'core-themes color scheme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    layout: 'padded',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    options: {
      storySort: {
        order: ['Introduction', 'Design Tokens', 'Components', 'Directives', 'Pipes'],
      },
    },
  },
};

export default preview;
