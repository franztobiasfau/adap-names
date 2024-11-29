import {
  ExceptionType,
  AssertionDispatcher,
} from "../common/AssertionDispatcher";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {
  protected baseName: string = "";
  protected parentNode: Directory;

  constructor(bn: string, pn: Directory) {
    this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);

    this.doSetBaseName(bn);
    this.parentNode = pn; // why oh why do I have to set this
    this.initialize(pn);

    this.assertClassInvariants();
  }

  protected initialize(pn: Directory): void {
    this.parentNode = pn;
    this.parentNode.add(this);

    console.log(
      `DEBUG: Initializing Node with baseName='${this.getBaseName()}' and parent='${this.getFullName()}'`
    );
  }

  public move(to: Directory): void {
    this.parentNode.remove(this);
    to.add(this);
    this.parentNode = to;
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
    this.doSetBaseName(bn);
  }

  protected doSetBaseName(bn: string): void {
    console.log(`DEBUG: doSetBaseName() to: '${bn}'`);
    this.baseName = bn;
  }

  public getParentNode(): Directory {
    return this.parentNode;
  }

  /**
   * Returns all nodes in the tree that match bn
   * @param bn basename of node being searched for
   */
  public findNodes(bn: string): Set<Node> {
    // Aktuelle Node
    console.log(`DEBUG: Current findNodes baseName: ${this.getBaseName()}`);
    const result: Set<Node> = new Set<Node>();

    if (this.getBaseName() === bn) {
      result.add(this);
    }
    // if (this instanceof Directory) {
    //     const directory = this as Directory;
    //     for (let child of directory.getChildNodes()) {
    //         for (let found of child.findNodes(bn)) {
    //             result.add(found);
    //         }
    //     }
    // }
    return result;
  }

  protected assertClassInvariants(): void {
    const bn: string = this.doGetBaseName();
    this.assertIsValidBaseName(bn, ExceptionType.CLASS_INVARIANT);
  }

  protected assertIsValidBaseName(bn: string, et: ExceptionType): void {
    const condition: boolean = bn != "";
    AssertionDispatcher.dispatch(et, condition, "invalid base name");
  }
}
