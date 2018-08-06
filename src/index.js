import React from 'react';
import ReactDOM from 'react-dom';

export default class ReactHtml extends React.PureComponent<{
  html: String,
  componentMap: Object,
  componentAttribute?: String,
  propsAttribute?: String,
  contextWrapper?: React.Node,
  onServerRender?: Function,
  afterFirstRender?: Function
}> {
  static defaultProps = {
    componentAttribute: 'data-react-component',
    propsAttribute: 'data-react-props'
  };

  state = {
    rendered: null,
    isFirstRender: false
  };

  renderDom = () => {
    // exit early for server-side rendered applications
    if (typeof window === 'undefined' || !this.renderTarget) {
      return;
    }

    const {
      html,
      componentMap,
      componentAttribute,
      propsAttribute
    } = this.props;

    // render the html passed in props to the target element
    if (document.createRange) {
      // empty renderTarget before appending new fragment
      while (this.renderTarget.firstChild) {
        this.renderTarget.removeChild(this.renderTarget.firstChild);
      }

      const range = document.createRange();
      range.setStart(this.renderTarget, 0);
      this.renderTarget.appendChild(range.createContextualFragment(html));
    } else {
      this.renderTarget.innerHTML = html;
    }

    // iterate over all elements that match our componentAttribute
    // ie `<div data-react-component>`
    const rendered = Array.from(
      this.renderTarget.querySelectorAll(`[${componentAttribute}]`)
    ).map(node => {
      const component = componentMap[node.getAttribute(componentAttribute)];
      const props = this.parseStringProps(node.getAttribute(propsAttribute));
      const element = React.createElement(component, props);

      // render the newly created element into the subtree
      return ReactDOM.createPortal(element, node);
    });

    this.setState({
      rendered,
      isFirstRender: true
    });
  };

  componentDidMount() {
    this.renderDom();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.html !== prevProps.html) {
      this.renderDom();
    }

    if (this.state.isFirstRender && this.props.afterFirstRender) {
      this.props.afterFirstRender();
      this.setState({ isFirstRender: false });
    }
  }

  componentWillUnmount() {
    while (this.renderTarget.firstChild) {
      this.renderTarget.removeChild(this.renderTarget.firstChild);
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
      contextWrapper,
      onServerRender
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

    if (onServerRender) {
      onServerRender($);
    }

    return $('body').html();
  };

  render() {
    const staticMarkup = this.renderToStaticMarkup();

    const divProps = {};

    if (staticMarkup) {
      divProps.dangerouslySetInnerHTML = { __html: staticMarkup };
    }

    return (
      <React.Fragment>
        <div
          ref={element => {
            this.renderTarget = element;
          }}
          {...divProps}
        />
        {this.state.rendered}
      </React.Fragment>
    );
  }
}
