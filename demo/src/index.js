import React from 'react';
import { render } from 'react-dom';

import ReactHtml from '../../src';
import fixtures from '../../tests/fixtures';

class Square extends React.Component {
  state = {
    hover: false
  };

  render() {
    const {
      width = '200px',
      color = '#666',
      hoverColor = 'black',
      background = 'black',
      hoverBackground = 'white',
      text
    } = this.props;

    return (
      <div
        onMouseEnter={() => {
          this.setState({ hover: true });
        }}
        onMouseLeave={() => {
          this.setState({ hover: false });
        }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          border: `5px solid ${background}`,
          width,
          height: width,
          color: this.state.hover ? hoverColor : color,
          background: this.state.hover ? hoverBackground : background
        }}
      >
        {text}
      </div>
    );
  }
}

const FakeElement = ({ color = 'red' }) =>
  React.createElement('span', { style: { color } }, 'hello');

class Editor extends React.Component {
  state = {
    html: `<div data-react-component="Square" data-react-props='{ "text": "hello world 1", "width": "150px", "background": "#ffb3ba" }'></div>
<div data-react-component="Square" data-react-props='{ "text": "hello world 2", "width": "150px", "background": "#baffc9" }'></div>
<div data-react-component="Square" data-react-props='{ "text": "hello world 3", "width": "150px", "background": "#bae1ff" }'></div>`
  };

  handleInputChange = event =>
    this.setState({
      [event.target.name]: event.target.value
    });

  render() {
    return (
      <React.Fragment>
        <div style={{ display: 'flex' }}>
          <div>
            <ReactHtml
              html={this.state.html}
              componentMap={{ Square }}
              allowUpdates={true}
              w
            />
          </div>
          <textarea
            style={{ width: '100%' }}
            name="html"
            onChange={this.handleInputChange}
            value={this.state.html}
          />
        </div>
      </React.Fragment>
    );
  }
}

const Demo = () => (
  <div>
    <h1>ReactHtmlConverter Demo</h1>
    <Editor />
    {Object.keys(fixtures).map(fixture => {
      const html = fixtures[fixture];
      return (
        <div key={fixture}>
          <h3>{fixture}</h3>
          <pre>{html}</pre>
          <ReactHtml html={html} componentMap={{ FakeElement }} />
        </div>
      );
    })}
  </div>
);

render(<Demo />, document.querySelector('#demo'));
