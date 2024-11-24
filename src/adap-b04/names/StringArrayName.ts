import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailureException } from "../common/MethodFailureException";

export class StringArrayName extends AbstractName {
  protected components: string[] = [];

  constructor(other: string[], delimiter?: string) {
    super(delimiter);
    this.assertHasValidParameter(other, "other cannot be null or undefined");
    this.init(other);
    this.assertIsValidStringArrayNameState(other);
  }

  public createOrigin(): Name {
    return new StringArrayName(["", "cs", "fau", "Oh"], ".");
  }

  public init(other: string[]) {
    this.components = [...other];
  }

  // methods for assertions (class invariants)
  protected assertStringArrayNameisValid() {
    super.assertAbstractNameIsValid();
    InvalidStateException.assertIsNotNullOrUndefined(
      this.components,
      "components cannot be null or undefined"
    );

    this.components.forEach((c) => {
      InvalidStateException.assertIsNotNullOrUndefined(
        c,
        "A component in components is null or undefined"
      );
    });
  }

  public getNoComponents(): number {
    return this.components.length;
  }

  public getComponent(i: number): string {
    throw new Error("needs implementation");
  }

  public setComponent(i: number, c: string) {
    throw new Error("needs implementation");
  }

  public insert(i: number, c: string) {
    throw new Error("needs implementation");
  }

  public append(c: string) {
    throw new Error("needs implementation");
  }

  public remove(i: number) {
    throw new Error("needs implementation");
  }

  // methods for assertions (post-conditions)
  protected assertIsValidStringArrayNameState(components: String[]): void {
    const cond = components === this.components;
    MethodFailureException.assertCondition(
      cond,
      "StringArrayName validation failed"
    );
  }
}
