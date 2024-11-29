import { Node } from "./Node";

export class Directory extends Node {
  protected childNodes: Set<Node> = new Set<Node>();

  constructor(bn: string, pn: Directory) {
    super(bn, pn);
    console.log(`DEBUG: Directory created with baseName='${bn}'`);
  }

  public add(cn: Node): void {
    this.childNodes.add(cn);
  }

  public remove(cn: Node): void {
    this.childNodes.delete(cn); // Yikes! Should have been called remove
  }

  /**
   * Returns all childNodes in the tree that match bn
   * @param bn basename of node being searched for
   */
  public override findNodes(bn: string): Set<Node> {
    const result: Set<Node> = super.findNodes(bn);

    for (const child of this.childNodes) {
        child.findNodes(bn).forEach(node => result.add(node)); //Rekursive für alle childNodes
    }

    return result;
  }
}
