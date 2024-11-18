import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
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
  }

  public getNoComponents(): number {
    return this.components.length;
  }

  public getComponent(i: number): string {
    if (i < 0 || i >= this.getNoComponents())
      throw new Error("Index out of bounds");
    return this.components[i];
  }

  public setComponent(i: number, c: string): void {
    if (i < 0 || i >= this.getNoComponents())
      throw new Error("Index out of bounds");
    this.components[i] = this.unmaskComponent(c, this.delimiter);
  }

  public insert(i: number, c: string): void {
    if (i < 0 || i > this.getNoComponents())
      throw new Error("Index out of bounds");
    this.components.splice(i, 0, this.unmaskComponent(c, this.delimiter));
  }

  public append(c: string): void {
    this.components.push(this.unmaskComponent(c, this.delimiter));
  }

  public remove(i: number): void {
    if (i < 0 || i >= this.getNoComponents())
      throw new Error("Index out of bounds");
    this.components.splice(i, 1);
  }
}
