import Node from "./node";

interface WalkResult {
  node: Text;
  offset: number;
}

export default class Text extends Node {

  private _text: string;
  private _attrs: string[];

  constructor(text: string = '', attrs: string[] = [], parent: Node) {
    super(parent, null);
    this._text = text;
    this._attrs = attrs;
  }

  text(): string {
    return this._text;
  }

  attrs(): string[] {
    return this._attrs;
  }

  insertString(offset: number, str: string): Text {
    const text = this.text().substr(0, offset) + str + this.text().substr(offset);
    const attrs = this.attrs().slice(0);
    return new Text(text, attrs, this.parent());
  }

  prevTextLeaf(): Text {
    return this.prevLeaf(node => node instanceof Text) as Text;
  }

  nextTextLeaf(): Text {
    return this.nextLeaf(node => node instanceof Text) as Text;
  }

}
