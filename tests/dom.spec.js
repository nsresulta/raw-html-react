/**
 * @jest-environment jsdom
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import ReactHtml from '../src';
import fixtures from './fixtures';
import FakeElement from './FakeElement';

describe('client side rendering', async () => {
  for (const testName in fixtures) {
    it(testName, () => {
      const html = fixtures[testName];
      let nodeRef;

      const element = <ReactHtml componentMap={{ FakeElement }} html={html} />;

      ReactTestRenderer.create(element, {
        createNodeMock: el => (nodeRef = document.createElement(el.type))
      });

      expect(nodeRef.firstChild).toMatchSnapshot();
    });
  }
});
