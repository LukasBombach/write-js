export default class Node {

  private static nextNodeId = 0;

  private _id: number;
  private _parent: Node;
  private _children: Array<Node>;

  constructor(parent: Node = null, children: Node[] = []) {
    this._id = ++Node.nextNodeId;
    this._parent = parent;
    this._children = children;
  }

  id(): number {
    return this._id;
  }

  index(): number {
    return this.parent() ? this.siblings().indexOf(this) : 0;
  }

  parent(condition?: (parent: Node) => boolean): Node {
    if (!condition) return this._parent;
    if (condition && condition(this._parent)) return this._parent;
    if (this._parent) return this._parent.parent(condition);
    return null;
  }

  prev(condition?: (parent: Node) => boolean): Node {
    const prevSiblings = this.prevSiblings();
    for (let i = prevSiblings.length - 1; i >= 0; i--) {
      if (condition(prevSiblings[i])) return prevSiblings[i];
    }
    return null;
  }

  next(condition = (node: Node) => true): Node {
    const nextSiblings = this.nextSiblings();
    for (let i = 0; i < nextSiblings.length; i++) {
      if (condition(nextSiblings[i])) return nextSiblings[i];
    }
    return null;
  }

  firstSibling(condition = (node: Node) => true): Node {
    const siblings = this.siblings();
    for (let i = 0; i < siblings.length; i++) {
      if (condition(siblings[i])) return siblings[i];
    }
    return null;
  }

  lastSibling(condition = (node: Node) => true): Node {
    const siblings = this.siblings();
    for (let i = siblings.length - 1; i >= 0; i--) {
      if (condition(siblings[i])) return siblings[i];
    }
    return null;
  }

  prevLeaf(condition?: (parent: Node) => boolean): Node {
    const lastLeaf = this.prevSiblings().reduceRight((pre, cur) => pre || cur.lastLeaf(condition), null);
    if (lastLeaf) return lastLeaf;
    const parentWithPrev = this.parent(parent => !!parent.prev());
    if (parentWithPrev) return parentWithPrev.prevLeaf(condition);
    return null;
  }

  nextLeaf(condition?: (parent: Node) => boolean): Node {
    // const next = this.next();
    // if (next) return next.firstLeaf();
    // const parentWithNext = this.parent(parent => !!parent.next());
    // if (parentWithNext) return parentWithNext.nextLeaf();
    // return null;
  }

  firstLeaf(): Node {
    // const children = this.children();
    // if (!children.length) return this;
    // return children[0].firstLeaf();
  }

  lastLeaf(condition = (node: Node) => true): Node {
    const children = this.children();
    if (!children.length) return condition(this) ? this : null;
    const lastSibling = this.lastSibling(condition);
    return lastSibling ? lastSibling.lastLeaf() : null;
  }

  siblings(): Node[] {
    return this.parent().children();
  }

  prevSiblings(): Node[] {
    return this.siblings().slice(0, this.index());
  }

  nextSiblings(): Node[] {
    return this.siblings().slice(this.index() + 1);
  }

  children(): Node[] {
    return this._children;
  }

  hasChild(node: Node): boolean {
    return this.children().indexOf(node) !== -1;
  }

  // todo instead of checking with hasChild this should traverse down the siblings to check if that node is there
  precedes(that: Node): boolean {
    const thisIndex = this.index();
    const thatIndex = that.index();
    if (thatIndex !== -1) return thatIndex < thisIndex;
    const siblings = this.siblings();
    for (let i = thisIndex; i >= 0; --i) if (siblings[i].hasChild(that)) return true;
    return false;
  }

  // todo instead of checking with hasChild this should traverse down the siblings to check if that node is there
  succeeds(that: Node): boolean {
    const thisIndex = this.index();
    const thatIndex = that.index();
    if (thatIndex !== -1) return thatIndex < thisIndex;
    const siblings = this.siblings();
    for (let i = thisIndex; i < siblings.length; ++i) if (siblings[i].hasChild(that)) return true;
    return false;
  }

  __dangerouslyMutateParent(parent: Node = null): Node {
    this._parent = parent;
    return this;
  }

}