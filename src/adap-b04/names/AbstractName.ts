import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailureException } from "../common/MethodFailureException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;

  constructor(delimiter: string = DEFAULT_DELIMITER) {
    this.assertHasValidDelimiter(delimiter);
    if (delimiter !== undefined) {
      this.delimiter = delimiter;
    } else {
      this.delimiter = DEFAULT_DELIMITER;
    }
    this.assertIsValidDelimiter(delimiter);
  }

  // methods for assertions (class invariants)
  protected assertAbstractNameIsValid() {
    InvalidStateException.assertIsNotNullOrUndefined(this.delimiter);
    this.assertIsValidDelimiter(this.delimiter);
  }

  public clone(): Name {
    const cloned = Object.create(Object.getPrototypeOf(this));
    cloned.delimiter = this.getDelimiterCharacter();

    for (let i = 0; i < this.getNoComponents(); i++) {
      cloned.append(this.getComponent(i));
    }

    this.assertIsValidCloned(cloned);
    return cloned;
  }

  public asString(delimiter?: string): string {
    delimiter = delimiter ?? this.delimiter;
    this.assertHasValidDelimiter(delimiter);

    const components: string[] = [];

    for (let i = 0; i < this.getNoComponents(); i++) {
        const component = this.getComponent(i);   
        components.push(component.replaceAll(`${ESCAPE_CHARACTER}${this.getDelimiterCharacter()}`, this.getDelimiterCharacter()));
    }

    return components.join(delimiter);
}
  
  public toString(): string {
    return this.asDataString();
  }

  public asDataString(): string {
    let components: string[] = [];
    const escapeWithDelimiter = ESCAPE_CHARACTER + this.getDelimiterCharacter();

    for (let i = 0; i < this.getNoComponents(); i++) {
      const component = this.getComponent(i)
        .replaceAll(this.getDelimiterCharacter(), escapeWithDelimiter);
      components.push(component);
    }

    const name = components.join(this.getDelimiterCharacter());

    // Return a JSON-encoded object
    const data = {
      dataString: name,
      delimiter: this.getDelimiterCharacter(),
    };

    return JSON.stringify(data); // To ensure it's a machine-readable JSON string
  }

  public isEqual(other: Name): boolean {
    this.assertHasValidParameter(other, "other cannot be null or undefined");
    if (this.getNoComponents() !== other.getNoComponents()) return false;

    for (let i = 0; i < this.getNoComponents(); i++) {
      if (this.getComponent(i) !== other.getComponent(i)) return false;
    }
    this.assertIsValidHashCode(other);
    return true;
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
    this.assertHasValidParameter(other, "other cannot be null or undefined");
    if (other.getDelimiterCharacter() !== this.getDelimiterCharacter()) {
      throw new Error("Delimiters do not match");
    }

    let copy = Object.create(Object.getPrototypeOf(this));
    copy.delimiter = this.getDelimiterCharacter();
    for (let i = 0; i < this.getNoComponents(); i++) {
      copy.append(this.getComponent(i));
    }

    for (let i = 0; i <= other.getNoComponents(); ++i) {
      this.append(other.getComponent(i));
    }

    this.assertIsValidConcatComponent(copy, other);
  }

  // methods for assertions (preconditions)
  protected assertHasValidDelimiter(delimiter: string): void {
    InvalidStateException.assertIsNotNullOrUndefined(
      delimiter,
      "delimiter cannot be null or undefined"
    );
    const cond = delimiter.length === 1 && delimiter !== ESCAPE_CHARACTER;
    InvalidStateException.assertCondition(
      cond,
      "delimiter must be a single char and cannot be the escape character"
    );
  }

  protected assertHasValidParameter(
    o: Object | null,
    msg: string = "null or undefined"
  ): void {
    InvalidStateException.assertIsNotNullOrUndefined(o, msg);
  }

  // methods for assertions (post-conditions)
  protected assertIsValidDelimiter(delimiter: string | undefined): void {
    const cond = (delimiter ? delimiter : DEFAULT_DELIMITER) === this.delimiter;
    MethodFailureException.assertCondition(cond, "Name validation failed");
  }

  protected assertIsValidCloned(cloned: Name): void {
    MethodFailureException.assertIsNotNullOrUndefined(
      cloned,
      "clone is null or undefined"
    );
    const cond = this.isEqual(cloned) && this !== cloned;
    MethodFailureException.assertCondition(cond, "Clone validation failed");
  }

  protected assertIsValidHashCode(other: Name): void {
    const cond = other.getHashCode() === this.getHashCode();
    MethodFailureException.assertCondition(cond, "HashCode validation failed");
  }

  protected assertIsValidConcatComponent(copy: Name, other: Name): void {
    const cond =
      this.getNoComponents() ===
      copy.getNoComponents() + other.getNoComponents();
    MethodFailureException.assertCondition(
      cond,
      "Concat Components validation failed"
    );
  }
}
