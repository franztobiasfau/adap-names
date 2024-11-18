import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {
  protected name: string = "";
  protected length: number = 0;

  constructor(other: string, delimiter?: string) {
    super(delimiter);
    this.init(other);
  }

  public createOrigin(): Name {
    return new StringName("", ".");
  }

  public init(other?: string) {
    if (other != null || other != undefined) {
      this.name = this.unmaskComponent(other, this.delimiter); // stored unsmasked
    }
    this.length = this.splitComponents(this.name, this.delimiter).length;
  }

  public getNoComponents(): number {
    return this.length;
  }

  public getComponent(i: number): string {
    let components = this.splitComponents(this.name, this.delimiter);
    if (i < 0 || i >= this.length) throw new Error("Index out of bounds");
    return components[i];
  }

  public setComponent(i: number, c: string) {
    const components = this.splitComponents(this.name, this.delimiter);
    if (i < 0 || i >= this.length) throw new Error("Index out of bounds");
    components[i] = c;

    this.name = components.join(this.delimiter);
  }

  public insert(i: number, c: string) {
    const components = this.splitComponents(this.name, this.delimiter);
    if (i < 0 || i > this.length) throw new Error("Index out of bounds");
    components.splice(i, 0, c);
    this.name = components.join(this.delimiter);
    this.length += 1;
  }

  public append(c: string) {
    this.name += this.delimiter + c;
    this.length += 1;
  }

  public remove(i: number) {
    const components = this.splitComponents(this.name, this.delimiter);
    if (i < 0 || i >= this.length) throw new Error("Index out of bounds");
    components.splice(i, 1);
    this.name = components.join(this.delimiter);
    this.length -= 1;
  }

  /** @methodtype helper-method */
  protected splitComponents(components: string, delimiter: string) {
    const unmasked = this.unmaskComponent(components, delimiter); // Unmaskiere die Eingabe
    const regex = new RegExp(`(?<!\\${ESCAPE_CHARACTER})\\${delimiter}`);
    return unmasked.split(regex);
  }
  
}
