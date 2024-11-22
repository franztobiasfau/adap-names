import { Name } from "../names/Name";
import { Directory } from "./Directory";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Node {
  protected baseName: string = "";
  protected parentNode: Directory;

  constructor(bn: string, pn: Directory) {
    this.assertNodeConstructor(bn,pn);
    this.doSetBaseName(bn);
    this.parentNode = pn;
  }

  public move(to: Directory): void {
    this.assertNodeMove(to);
    this.parentNode.remove(this);
    to.add(this);
  }

  public getFullName(): Name {
    const result: Name = this.parentNode.getFullName();
    result.append(this.getBaseName());
    return result;
  }

  public getBaseName(): string {
    return this.doGetBaseName();
  }

  protected doGetBaseName(): string {
    return this.baseName;
  }

  public rename(bn: string): void {
    this.assertNodeRename(bn);
    this.doSetBaseName(bn);
  }

  protected doSetBaseName(bn: string): void {
    this.assertNodeSetBaseName(bn);
    this.baseName = bn;
  }

  public getParentNode(): Node {
    return this.parentNode;
  }

  // Implementing preconditions methods
  protected assertNodeConstructor(bn: string, pn: Directory): void {
    this.assertNodeBaseName(bn);
    IllegalArgumentException.assertIsNotNullOrUndefined(pn);
  }

  protected assertNodeBaseName(bn: string): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(bn);
    IllegalArgumentException.assertCondition(bn.length > 0, "base name is empty")
  }

  protected assertNodeSetBaseName(bn: string): void {
    this.assertNodeBaseName(bn);
  }

  protected assertNodeMove(to: Directory): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(to);
  }

  protected assertNodeRename(bn: string): void {
    this.assertNodeBaseName(bn);
  }
}
