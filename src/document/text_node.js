export default class TextNode {

  constructor(text = '', parent, attrs = []) {
    this.text = text;
    this.parent = parent;
    this.attrs = attrs;
  }

  cloneWithParent(parent) {
    return new TextNode(this.text, parent, this.attrs);
  }

  render() {
    return document.createTextNode(this.text);
  }

}
