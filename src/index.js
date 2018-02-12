import React from 'react';
import ReactDOM from 'react-dom';

type ReactHtmlProps = {
  html: String,
  componentMap: Object,
  componentAttribute?: String,
  propsAttribute?: String,
  contextWrapper?: React.Node,
  allowUpdates?: Boolean
};

export default class ReactHtml extends React.Component<> {
  static defaultProps = {
    componentAttribute: 'data-react-component',
    propsAttribute: 'data-react-props',
    allowUpdates: false
  };

  renderDom = () => {
    // exit early for server-side rendered applications
    if (typeof window === 'undefined') {
      return;
    }

    const {
      html,
      componentMap,
      componentAttribute,
      propsAttribute,
      allowUpdates
    } = this.props;

    // render the html passed in props to the target element
    this.renderTarget.innerHTML = html;

    // iterate over all elements that match our componentAttribute
    // ie `<div data-react-component>`
    Array.from(
      this.renderTarget.querySelectorAll(`[${componentAttribute}]`)
    ).forEach(node => {
      const component = componentMap[node.getAttribute(componentAttribute)];
      const props = this.parseStringProps(node.getAttribute(propsAttribute));
      const element = React.createElement(component, props);

      // render the newly created element into the subtree using an
      // unstable ReactDOM api in order to maintain the tree context
      ReactDOM.unstable_renderSubtreeIntoContainer(this, element, node, () =>
        // after the React element is rendered, replace the placeholder element
        // with it's child to clean up the DOM
        node.replaceWith(...node.childNodes)
      );
    });

    // if updates are dissallowed we can clean up the dom further by
    // replacing the target element with it's children
    if (!allowUpdates) {
      // remove the outer container
      this.renderTarget.replaceWith(...this.renderTarget.childNodes);
    }
  };

  componentDidMount() {
    this.renderDom();
  }

  componentDidUpdate() {
    // Only rerender if updates are explicitly allowed
    if (this.props.allowUpdates) {
      this.renderDom();
    }
  }

  parseStringProps = componentProps => {
    const {
      html,
      componentMap,
      componentAttribute,
      propsAttribute,
      contextWrapper,
      ...additionalProps
    } = this.props;

    if (!componentProps) {
      return additionalProps;
    }

    let props;

    try {
      props = JSON.parse(componentProps);
    } catch (error) {
      console.warn(`Error parsing data-react-props`, componentProps);
    }

    return { ...props, ...additionalProps };
  };

  renderToStaticMarkup = () => {
    // We do not need to render to static markup on the client
    if (typeof window === 'object') {
      return null;
    }

    const ReactDOMServer = require('react-dom/server');
    const cheerio = require('cheerio');

    const {
      html,
      componentAttribute,
      propsAttribute,
      componentProps,
      componentMap,
      contextWrapper
    } = this.props;

    // parse the raw html with cheerio
    const $ = cheerio.load(html);

    $(`[${componentAttribute}]`).each((i, element) => {
      const component = componentMap[element.attribs[componentAttribute]];
      const props = this.parseStringProps(element.attribs[propsAttribute]);

      let reactElement = React.createElement(component, props);

      // If context is required, this component must receive all applicable
      // providers as a wrapper component through props.
      // example: <ReactHTML contextWrapper={(props) => <StaticRouter {...props} />} />
      if (contextWrapper) {
        reactElement = React.createElement(contextWrapper, null, reactElement);
      }

      const reactHtml = ReactDOMServer.renderToStaticMarkup(reactElement);

      // replace the placeholder element with the rendered html
      $(element).replaceWith(reactHtml);
    });

    return $('body').html();
  };

  render() {
    return (
      <div
        ref={element => {
          this.renderTarget = element;
        }}
        dangerouslySetInnerHTML={{
          __html: this.renderToStaticMarkup()
        }}
      />
    );
  }
}
