/**
 * @jest-environment node
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import ReactHtml from '../src';
import fixtures from './fixtures';
import FakeElement from './FakeElement';

describe('Server-side rendering', async () => {
  for (const testName in fixtures) {
    it(testName, () => {
      const html = fixtures[testName];
      const element = (
        <ReactHtml
          componentMap={{ FakeElement }}
          html={html}
          onServerRender={$ => $('script').remove()}
        />
      );
      expect(ReactTestRenderer.create(element).toJSON()).toMatchSnapshot();
    });
  }
});
