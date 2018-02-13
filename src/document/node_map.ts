import Node from "./node";

interface Map {
  [key: string]: MapEntry;
}

interface MapEntry {
  parent: Node;
  children: Node[];
}

export default class NodeMap {

  public rootNode: Readonly<Node>;
  private map: Map;

  constructor(map: Map = null, rootNode: Node = null) {
    this.map = map || {};
    this.rootNode = rootNode || new Node();
    if (!map && !rootNode) this.set(this.rootNode, null, []);
  }

  set(node: Node, parent: Node = null, children: Node[] = null): this { // todo add to children when setting parent?
    this.map[node.id.toString()] = { parent, children };
    return this;
  }

  setChildren(node: Node, children: Node[] = null): this {
    this.map[node.id.toString()].children = children;
    return this;
  }

  get(node: Node): MapEntry {
    return this.map[node.id.toString()];
  }

  getRoot(): MapEntry {
    return this.get(this.rootNode);
  }

  getParent(node: Node): Node {
    return this.get(node).parent;
  }

  getChildren(node: Node): Node[] {
    return this.get(node).children;
  }

  // todo make immutable?
  replace(currentNode: Node, newNode: Node): this {
    const entry = this.get(currentNode);
    if (entry.parent) this.replaceChildInParent(entry.parent, currentNode, newNode);
    this.set(newNode, entry.parent, entry.children);
    this.removeRecursively([currentNode]);
    return this;
  }

  // todo make immutable?
  remove(node: Node): this {
    const entry = this.get(node);
    if (!entry) return this;
    if (entry.parent) this.removeChildFromParent(entry.parent, node);
    if (entry.children) this.removeRecursively(entry.children);
    return this;
  }

  // todo make immutable?
  mergeRight(leftNode: Node, rightNode: Node): this {
    const leftChildren = this.get(leftNode).children;
    const rightChildren = this.get(rightNode).children;
    leftChildren.push(...rightChildren);
    this.remove(rightNode);
    return this;
  }

  clone() {
    const map = Object.assign({}, this.map);
    Object.keys(map).forEach(nodeId => map[nodeId].children.slice(0));
    return new NodeMap(map, this.rootNode);
  }

  private replaceChildInParent(parent: Node, currentNode: Node, newNode: Node): this {
    const entry = this.get(parent);
    if (!entry.children) return this;
    const index = entry.children.indexOf(currentNode);
    if (index === -1) return this;
    entry.children[index] = newNode;
    return this;
  }

  private removeChildFromParent(parent: Node, child: Node): this {
    const siblings = this.get(parent).children;
    const index = siblings.indexOf(child);
    if (index !== -1) siblings.splice(index, 1);
    return this;
  }

  private removeRecursively(nodes: Node[]): this {
    nodes.forEach(node => {
      this.removeRecursively(this.get(node).children);
      delete this.map[node.id.toString()];
    });
    return this;
  }

}
