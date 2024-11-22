import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

  constructor(other: string, delimiter?: string) {
    this.name = other;
    this.delimiter = delimiter ?? DEFAULT_DELIMITER; // Providing Fallback with the ?? Operator
    this.length = this.getNoComponents();
  }

  public asString(delimiter: string = this.delimiter): string {
    return this.name.split(this.delimiter).join(delimiter);
  }

  public asDataString(): string {
    return this.name
      .split(this.delimiter) // Split into components
      .map(
        (component) =>
          component
            .split("") // Split component into characters for checking ESCAPE_CHARACTER
            .map((char) =>
              char === ESCAPE_CHARACTER
                ? ESCAPE_CHARACTER + char // Double ESCAPE_CHARACTER if it appears
                : char
            )
            .join("") // Rejoin component after escaping ESCAPE_CHARACTER
      ).join(this.delimiter); // Rejoin components with delimiter
  }

    public getDelimiterCharacter(): string {
        throw new Error("needs implementation");
    }

    public isEmpty(): boolean {
        throw new Error("needs implementation");
    }

  public getNoComponents(): number {
    return this.name.length > 0 ? this.name.split(this.delimiter).length : 0;
  }

  public getComponent(x: number): string {
    const components = this.name.split(this.delimiter);
    if (x < 0 || x >= components.length) {
      throw new Error("Index out of bounds");
    }
    return components[x];
  }

  public setComponent(n: number, c: string): void {
    const components = this.name.split(this.delimiter);
    if (n < 0 || n >= components.length) {
      throw new Error("Index out of bounds");
    }
    components[n] = c;
    this.name = components.join(this.delimiter);
    this.length = components.length; // Update length
  }

  public insert(n: number, c: string): void {
    const components = this.name.split(this.delimiter);
    if (n < 0 || n > components.length) {
      throw new Error("Index out of bounds");
    }
    components.splice(n, 0, c);
    this.name = components.join(this.delimiter);
    this.length = components.length; // Update length
  }

  public append(c: string): void {
    if (this.name.length > 0) {
      this.name += this.delimiter; // Append the delimiter only if the name is not empty
    }
    this.name += c; // Append the new component
    this.length++; // Increment length
  }

  public remove(n: number): void {
    const components = this.name.split(this.delimiter);
    if (n < 0 || n >= components.length) {
      throw new Error("Index out of bounds");
    }
    components.splice(n, 1);
    this.name = components.join(this.delimiter);
    this.length = components.length; // Update length
  }

  public concat(other: Name): void {
    if (other.isEmpty()) return;

    const otherComponents: string[] = [];
    for (let i = 0; i < other.getNoComponents(); i++) {
      otherComponents.push(other.getComponent(i));
    }

    if (this.name.length > 0) {
      this.name += this.delimiter; // Append delimiter if name is not empty
    }

    this.name += otherComponents.join(this.delimiter);
    this.length += otherComponents.length; // Update length
  }
}
