import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailedException } from "../common/MethodFailedException";
import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {
  protected readonly delimiter: string;

  constructor(delimiter: string) {
    IllegalArgumentException.assert(
      delimiter.length === 1 && delimiter !== ESCAPE_CHARACTER,
      "delimiter must be a single char and cannot be the escape character"
    );

    this.delimiter = delimiter;

    InvalidStateException.assert(
      this.delimiter != null,
      "this.delimiter cannot be null or undefined"
    );
  }

  public asDataString(): string {
    let components: string[] = [];
    const escapeWithDelimiter = ESCAPE_CHARACTER + this.getDelimiterCharacter();

    for (let i = 0; i < this.getNoComponents(); i++) {
      const component = this.getComponent(i).replaceAll(
        this.getDelimiterCharacter(),
        escapeWithDelimiter
      );
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
  
  abstract clone(): Name; 

  abstract asString(delimiter?: string): string;
  abstract toString(): string;

  abstract getNoComponents(): number;

  abstract getComponent(i: number): string;
  abstract setComponent(i: number, c: string): Name;

  abstract insert(i: number, c: string): Name;
  abstract append(c: string): Name;
  abstract remove(i: number): Name;
  abstract concat(other: Name): Name;

  // methods for assertions (preconditions)
  protected assertHasValidDelimiter(delimiter: string): void {
    IllegalArgumentException.assert(
      delimiter != null,
      "delimiter cannot be null or undefined"
    );
  }

  // methods for assertions (post-conditions)
  protected assertIsValidCloned(cloned: Name): void {
    MethodFailedException.assert(cloned.isEmpty(), "clone is empty");
    MethodFailedException.assert(
      this.isEqual(cloned) && this !== cloned,
      "Clone validation failed"
    );
  }

  protected assertIsValidHashCode(other: Name): void {
    MethodFailedException.assert(
      other.getHashCode() === this.getHashCode(),
      "HashCode validation failed"
    );
  }
}
