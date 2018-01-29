[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

Inspired by [Sethorax/react-html-converter](https://github.com/Sethorax/react-html-converter) and [aknuds1/html-to-react](https://github.com/mikenikles/html-to-react).

A React component that converts raw HTML to React components.

On the client, no additional dependencies are used beyond React. Cheerio is used for rendering static elements for server-side rendered applications.

This is useful for rending React components from a headless CMS in client side react applications.

## Install

```sh
yarn add html-react-converter
```

or

```sh
npm install html-react-converter
```

## Example

```js
import React from 'react';
import ReactHtml from 'html-react-converter';
import MyComponent from '../components/MyComponent';

class Example extends React.Component {
  render() {
    const html = `<div data-react-component="MyComponent"></div>`;
    return <ReactHtml html={html} componentMap={{ MyComponent }} />;
  }
}
```

## API

### `<ReactHtml>`

This component takes raw html as text and renders react components.

#### Props

```js
type ReactHtmlProps = {
  html: String,
  componentMap: Object,
  componentAttribute?: String,
  propsAttribute?: String,
  ContextWrapper?: React.Node,
  allowUpdates?: Boolean
};
```

| Prop Name          | Type      | Required   | Default Value        | Description                                                                                                                                        |
| ------------------ | --------- | ---------- | -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| html               | `String`  | `required` |                      | HTML to be parsed and rendered with React components inline.                                                                                       |
| componentMap       | `Object`  | `required` |                      | An object where the key is the value to be used in `data-react-component` attributes and the value is the reference to the actual react component. |
| componentAttribute | `Object`  | optional   | data-react-component | The react component to be rendered in place of the html element                                                                                    |
| propsAttribute     | `Object`  | optional   | data-react-props     | The props that will be passed to the react component. (JSON string)                                                                                |
| ContextWrapper     | `Object`  | optional   | null                 | Wrapper component to be used when statically rendering for SSR. Typically a context provider.                                                      |
| allowUpdates       | `Boolean` | optional   | false                | Allow the                                                                                                                                          |

### HTML Attributes

#### `data-react-component="string"`

#### `data-react-props="JSON"`

Sets the props that will be passed to the react component. (JSON format)

Constructor takes plain JSON object where the key is the value to be used in `data-react-component` attributes and the value is the reference to the actual react component.

[build-badge]: https://img.shields.io/travis/getchalk/raw-html-react/master.png?style=flat-square
[build]: https://travis-ci.org/getchalk/raw-html-react
[npm-badge]: https://img.shields.io/npm/v/raw-html-react.png?style=flat-square
[npm]: https://www.npmjs.org/package/raw-html-react
[coveralls-badge]: https://img.shields.io/coveralls/getchalk/raw-html-react/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/getchalk/raw-html-react
