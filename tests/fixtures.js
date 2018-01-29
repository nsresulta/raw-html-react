export default {
  'parse react component from string': `<div data-react-component="FakeElement"></div>`,
  'parse react component from string with props': `<div data-react-component="FakeElement"  data-react-props='{ "color": "blue" }'></div>`,
  'leaves non-react componetns in place': `<div><div data-react-component="FakeElement" data-react-props='{ "color": "blue" }'></div><p>test</p></div>`,
  'passes through class, width, height, src': `<div data-react-component="FakeElement" class="abc def" width="120" height="150" src="x" />`,
  'Handles comments inside tags': `<ul><!-- <li>test</li> --></ul>`,
  'Handles comment': '<!-- comment -->',
  'parses top level siblings without wrapper': `<li>item-1</li><li>item-2</li><li>item-3</li><li>item-4</li><li>item-5</li>`,
  'parses html with siblings':
    '<ul class="list"><li>Text1</li><li>Text2</li></ul><div>Sibling</div>',
  'supports style': '<div style="background-color: #fff;"></div>',
  'renders text nodes': 'i am pure text',
  // 'handles invalid json': `<div data-react-component="FakeElement" data-react-props="{">test</div>`
};
