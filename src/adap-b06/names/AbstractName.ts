import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {
  protected readonly delimiter: string;

  constructor(delimiter: string = DEFAULT_DELIMITER) {
    this.assertHasValidDelimiter(delimiter);
    this.delimiter = delimiter;
    this.assertAbstractNameIsValid();
  }

  // methods for assertions (class invariants)
  protected assertAbstractNameIsValid() {
    InvalidStateException.assert(this.delimiter != null, "delimiter cannot be null or undefined");
  }

  public clone(): Name {
    // New instance based on the constructor of the derived class
    const cloned = new (this.constructor as { new(delimiter: string): Name})(this.getDelimiterCharacter());

    for (let i = 0; i < this.getNoComponents(); i++) {
      cloned.setComponent(i, this.getComponent(i)); //TODO: maybe not working -> addComponent(components: string[]): Name??
    }

    this.assertIsValidCloned(cloned);
    return cloned;
  }

  public asString(delimiter?: string): string {
    delimiter = delimiter ?? this.delimiter;
    this.assertHasValidDelimiter(delimiter); //pre-con

    const components: string[] = [];
    //TODO: refactor to more Array.from({}, () => {}) arrow-function-style?
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
    IllegalArgumentException.assert(
      other != null && !other.isEmpty(),
      "Other Name cannot be null or empty"
    );
    if (this.getNoComponents() !== other.getNoComponents()) return false;

    for (let i = 0; i < this.getNoComponents(); i++) {
      if (this.getComponent(i) !== other.getComponent(i)) return false;
    }

    this.assertIsValidHashCode(other);
    return true;
  }

  public getHashCode(): number {
    let hashCode: number = 0;
    const s: string = this.toString();
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
  abstract concat(other: Name): Name;

  // methods for assertions (preconditions)
  protected assertHasValidDelimiter(delimiter: string): void {
    IllegalArgumentException.assert(this.delimiter != null,
      "delimiter cannot be null or undefined"
    );
    const cond = delimiter.length === 1 && delimiter !== ESCAPE_CHARACTER;
    IllegalArgumentException.assert(
      cond,
      "delimiter must be a single char and cannot be the escape character"
    );
  }

  // methods for assertions (post-conditions)
  protected assertIsValidCloned(cloned: Name): void {
    MethodFailedException.assert(
      cloned.isEmpty(),
      "clone is empty"
    );
    MethodFailedException.assert((this.isEqual(cloned) && this !== cloned), "Clone validation failed");
  }

  protected assertIsValidHashCode(other: Name): void {
    MethodFailedException.assert((other.getHashCode() === this.getHashCode()), "HashCode validation failed");
  }

}
