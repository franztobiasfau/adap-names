import { Node } from "./Node";
import { Directory } from "./Directory";

export class Link extends Node {
  protected targetNode: Node | null = null;

  constructor(bn: string, pn: Directory, tn?: Node) {
    super(bn, pn);

    if (tn != undefined) {
      this.targetNode = tn;
    }
  }

  public getTargetNode(): Node | null {
    return this.targetNode;
  }

  public setTargetNode(target: Node): void {
    this.targetNode = target;
  }

  public getBaseName(): string {
    const target = this.ensureTargetNode(this.targetNode);
    return target.getBaseName();
  }

  public rename(bn: string): void {
    const target = this.ensureTargetNode(this.targetNode);
    target.rename(bn);
  }

  protected ensureTargetNode(target: Node | null): Node {
    const result: Node = this.targetNode as Node;
    return result;
  }

  /**
   * Returns all nodes in the tree that match bn
   * @param bn basename of node being searched for
   */
  public findNodes(bn: string): Set<Node> {
    const result: Set<Node> = super.findNodes(bn);

    if (this.targetNode != null) {
        const linkNode: Set<Node> = this.targetNode.findNodes(bn);
        linkNode.forEach((link) => result.add(link));
    }

    return result;
  }
}
