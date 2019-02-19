/* eslint-disable import/no-extraneous-dependencies, import/no-unresolved, import/extensions */

import { configure } from '@storybook/react';

function loadStories() {
  // TODO: improve this directory, rename it "examples"?
  require('../stories');
}

configure(loadStories, module);
