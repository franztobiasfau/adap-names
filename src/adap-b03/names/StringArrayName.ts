import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {
  protected components: string[] = [];

  constructor(other: string[], delimiter?: string) {
    super(delimiter);
    this.init(other);
  }

  public createOrigin(): Name {
    return new StringArrayName(["", "cs", "fau", "Oh"], ".");
  }

  public init(other?: string[]): void {
    if (other != null || other != undefined) {
      if (other.length === 0) throw new Error("One component is required.");
      other = other.map((c) => this.unmaskComponent(c, this.delimiter)); // stored unmasked
      this.components = [...other];
    }

    public clone(): Name {
        throw new Error("needs implementation");
    }

    public asString(delimiter: string = this.delimiter): string {
        throw new Error("needs implementation");
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
        throw new Error("needs implementation");
    }

    public isEmpty(): boolean {
        throw new Error("needs implementation");
    }

    public getDelimiterCharacter(): string {
        throw new Error("needs implementation");
    }

    public getNoComponents(): number {
        throw new Error("needs implementation");
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

    public concat(other: Name): void {
        throw new Error("needs implementation");
    }
}
