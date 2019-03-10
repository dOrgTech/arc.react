/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import { configure } from '@storybook/react';
import '@storybook/addon-console';

function loadStories() {
  require('../storybook');
}

configure(loadStories, module);
