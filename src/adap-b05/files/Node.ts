import {
  ExceptionType,
  AssertionDispatcher,
} from "../common/AssertionDispatcher";
import { Exception } from "../common/Exception";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {
  protected baseName: string = "";
  protected parentNode: Directory;

  constructor(bn: string, pn: Directory) {
    this.doSetBaseName(bn);
    this.parentNode = pn; // why oh why do I have to set this
    this.initialize(pn);

    this.assertClassInvariants();
  }

  protected initialize(pn: Directory): void {
    this.assertIsNotNullOrUndefined(pn, ExceptionType.PRECONDITION);
    this.parentNode = pn;
    this.parentNode.add(this);
  }

  public move(to: Directory): void {
    this.assertIsNotNullOrUndefined(to, ExceptionType.PRECONDITION);
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
    this.assertIsValidBaseName(bn, ExceptionType.PRECONDITION);
    this.doSetBaseName(bn);
  }

  protected doSetBaseName(bn: string): void {
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
    const result: Set<Node> = new Set<Node>();

    try {
      this.assertIsNotEmpty(bn, ExceptionType.PRECONDITION);

      if (this.getBaseName() === bn) {
        result.add(this);
      }

      this.assertClassInvariants();
    } catch (error) {
      throw new ServiceFailureException(
        `Failed to find nodes with basename '${bn}'`,
        error as Exception
      );
    }

    return result;
  }

  protected assertClassInvariants(): void {
    const bn: string = this.doGetBaseName();
    const pn: Directory = this.getParentNode();

    try {
      this.assertIsValidBaseName(bn, ExceptionType.CLASS_INVARIANT);
      this.assertIsNotNullOrUndefined(pn, ExceptionType.CLASS_INVARIANT);
    } catch (error) {
      if (error instanceof Exception) {
        throw new InvalidStateException("Class invariant violation", error);
      }
      throw error; // Unkown
    }
  }

  // methods for assertions (preconditions)
  protected assertIsValidBaseName(bn: string, et: ExceptionType): void {
    const condition: boolean = bn != "";
    AssertionDispatcher.dispatch(et, condition, "invalid base name for node");
  }

  protected assertIsNotNullOrUndefined(o: Object, et: ExceptionType): void {
    const condition: boolean = o !== null || o !== undefined;
    AssertionDispatcher.dispatch(et, condition, "cannot be null or undefined");
  }

  protected assertIsNotEmpty(bn: string, et: ExceptionType): void {
    const condition: boolean = bn.length > 0;
    AssertionDispatcher.dispatch(et, condition, "cennot be empty");
  }
}
