import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export abstract class AbstractName implements Name {
  protected delimiter: string = DEFAULT_DELIMITER;

  constructor(delimiter: string = DEFAULT_DELIMITER) {
    this.delimiter = delimiter;
  }

  public asString(delimiter: string = this.delimiter): string {
    let result = "";
    for (let i = 0; i < this.getNoComponents(); i++) {
      if (result.length == 0) {
        result += this.getComponent(i); 
      } else {
        result += delimiter; // Füge Delimiter zwischen Komponenten ein
        result += this.getComponent(i);
      }
    }
    return result; // Unmaskierter String z.B. "oss.cs.fau.de"
  }

  public toString(): string {
    return this.asDataString();
  }

  public asDataString(): string {
    return this.asString(ESCAPE_CHARACTER + this.delimiter);
  }

  public isEqual(other: Name): boolean {
    if (this.getNoComponents() !== other.getNoComponents()) return false;
    for (let i = 0; i < this.getNoComponents(); i++) {
      if (this.getComponent(i) !== other.getComponent(i)) return false;
    }
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

  public clone(): Name {
    return Object.create(this);
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
    if (other.getDelimiterCharacter() != this.delimiter) {
      throw new Error("Delimiters do not match");
    }
    for (let i = 0; i <= other.getNoComponents(); ++i) {
      this.append(other.getComponent(i));
    }
  }

  /** @methodtype helper-method */
  protected maskComponent(component: string, delimiter: string): string {
    const regex = new RegExp(delimiter, "g");
    return component.replace(regex, ESCAPE_CHARACTER + delimiter);
  }

  /** @methodtype helper-method */
  protected unmaskComponent(component: string, delimiter: string): string {
    const regex = new RegExp(ESCAPE_CHARACTER + delimiter, "g");
    return component.replace(regex, delimiter);
  }
}
