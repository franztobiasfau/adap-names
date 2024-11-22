import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailureException } from "../common/MethodFailureException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;

  constructor(delimiter: string = DEFAULT_DELIMITER) {
    this.assertValidDelimiter(delimiter); //pre
    if (delimiter !== undefined) {
      this.delimiter = delimiter;
    } else {
      this.delimiter = DEFAULT_DELIMITER;
    }
    this.assertCorrectDelimiter(delimiter); //post
  }

  public clone(): Name {
    throw new Error("needs implementation");
  }

  public asString(delimiter: string = this.delimiter): string {
    this.assertValidDelimiter(delimiter);

    let components: string[] = [];

    for (let i = 0; i < this.getNoComponents(); i++) {
      components.push(
        this.getComponent(i).replaceAll(
          `${ESCAPE_CHARACTER}${this.getDelimiterCharacter()}`,
          this.getDelimiterCharacter()
        )
      );
    }

    return components.join(delimiter);
  }

  public toString(): string {
    throw new Error("needs implementation");
  }

  public asDataString(): string {
    throw new Error("needs implementation");
  }

  public isEqual(other: Name): boolean {
    throw new Error("needs implementation");
  }

  public getHashCode(): number {
    let hashCode: number = 0;
    const s: string = this.asDataString();
    for (let i = 0; i < s.length; i++) {
      let c = s.charCodeAt(i);
      hashCode = (hashCode << 5) - hashCode + c;
      hashCode |= 0;
    }
    return hashCode;
  }

  public isEmpty(): boolean {
    return this.getNoComponents() === 0;
  }

  public getDelimiterCharacter(): string {
    return this.delimiter;
  }

  abstract getNoComponents(): number;

  abstract getComponent(i: number): string;
  abstract setComponent(i: number, c: string): void;

  abstract insert(i: number, c: string): void;
  abstract append(c: string): void;
  abstract remove(i: number): void;

  public concat(other: Name): void {
    throw new Error("needs implementation");
  }

  // methods for assertions (pre-conditions)
  protected assertValidDelimiter(delimiter: string): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(
      delimiter,
      "delimiter cannot be null or undefined"
    );
    const cond = delimiter.length === 1 && delimiter !== ESCAPE_CHARACTER;
    IllegalArgumentException.assertCondition(
      cond,
      "delimiter must be a single char and cannot be the escape character"
    );
  }

  protected assertParaNotNullOrUndefined(
    o: Object | null,
    msg: string = "null or undefined"
  ): void {
    IllegalArgumentException.assertIsNotNullOrUndefined(o, msg);
  }

  // methods for assertions (post-conditions)
  protected assertCorrectDelimiter(delimiter: string | undefined): void {
    const cond = (delimiter ? delimiter : DEFAULT_DELIMITER) === this.delimiter;
    MethodFailureException.assertCondition(cond, "Name is not correctly build");
  }
}
