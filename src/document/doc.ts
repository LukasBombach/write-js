import Node from "./node";
import NodeMap from "./node_map";
import Selection from "../selection";
import insertTextTransformation from '../transformations/insert_text';
import deleteSelectionTransformation from '../transformations/delete_selection';
import { DELETE_SELECTION, TYPE_INSERT_TEXT } from "../actions/input";
import DomParser from "../parser/dom";
import HtmlParser from "../parser/html";

export interface TransformationResult {
  doc: Doc;
  selection: Selection
}

export default class Doc {

  private static nextDocId = 0;

  public id: Readonly<number>;
  public nodeMap: Readonly<NodeMap>;

  static fromHtml(html: string): Doc {
    const nodeMap = HtmlParser.getNodeMapFor(html);
    return new Doc(nodeMap);
  }

  static fromElement(element: Element): Doc {
    const nodeMap = DomParser.getNodeMapFor(element);
    return new Doc(nodeMap);
  }

  constructor(nodeMap: NodeMap = new NodeMap()) {
    this.id = ++Doc.nextDocId;
    this.nodeMap = nodeMap;
  }

  children(): Node[] {
    return this.nodeMap.getRoot().children;
  }

  replaceNode(node: Node, newNode: Node): Doc {
    return this.replaceNodes([node], [newNode]);
  }

  deleteNode(node: Node): Doc {
    return this.deleteNodes([node])
  }

  replaceNodes(nodes: Node[], newNodes: Node[]): Doc {
    const nodeMap = this.nodeMap.clone();
    nodes.forEach((node, index) => nodeMap.replace(node, newNodes[index]));
    return new Doc(nodeMap);
  }

  deleteNodes(nodes: Node[]): Doc {
    const nodeMap = this.nodeMap.clone();
    nodes.forEach(node => nodeMap.remove(node));
    return new Doc(nodeMap);
  }

  merge(leftNode: Node, rightNode: Node): Doc {
    const nodeMap = this.nodeMap.clone();
    nodeMap.merge(leftNode, rightNode);
    return new Doc(nodeMap);
  }

  mergeParents(leftNode: Node, rightNode: Node): Doc {
    const leftParent = this.nodeMap.getParent(leftNode);
    const rightParent = this.nodeMap.getParent(rightNode);
    return this.merge(leftParent, rightParent);
  }

  async transform(action: any): Promise<TransformationResult> {
    if (action.type === TYPE_INSERT_TEXT) return await insertTextTransformation(this, action);
    if (action.type === DELETE_SELECTION) return await deleteSelectionTransformation(this, action);
    console.warn(`Could not find transformation for action "${action.type}"`, action);
    return { doc: this, selection: null };
  }

}
