import * as React from 'react';
import * as ReactDOM from 'react-dom';
import NodeMap from '../node_map';
import TextNode from '../../../document/text';
import { debug } from '../../../config';

interface TextProps {
  node: TextNode
}

export default class Text extends React.Component<TextProps, undefined> {

  private domNode: Node = null;

  componentDidMount() {
      NodeMap.set(ReactDOM.findDOMNode(this), this.props.node);
  }

  shouldComponentUpdate(nextProps: TextProps): boolean {
    return nextProps.node.id !== this.props.node.id;
  }

  componentWillUnmount() {
    NodeMap.delete(ReactDOM.findDOMNode(this));
  }

  componentDidUpdate() {
    NodeMap.delete(this.domNode);
    NodeMap.set(ReactDOM.findDOMNode(this), this.props.node);
  }

  render() {
    if (debug.log.docRendering) { // todo put this in a logger class
      console.groupCollapsed('%cRendering %cText   %c%d %c%s', 'color: gray; font-weight: lighter;', 'color: black; font-weight: bold;', 'color: blue;', this.props.node.id, 'color: gray; font-weight: lighter;', this.props.node.text);
      console.log(this.props.node.text);
      console.groupEnd();
    }
    return this.props.node.text;
  }

}