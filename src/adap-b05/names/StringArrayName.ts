import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringArrayName extends AbstractName {
  private readonly components: string[];

  constructor(source: string[], delimiter?: string) {
    super(delimiter);
    IllegalArgumentException.assert(
      source != null,
      "source cannot be null or undefined"
    );
    this.components = [...source]; // copy to maintain immutability
    this.assertAbstractNameIsValid();
  }

  public clone(): Name {
    return new StringArrayName([...this.components], this.delimiter);
  }

  public getNoComponents(): number {
    return this.components.length;
  }

  public getComponent(i: number): string {
    this.assertHasValidIndex(i);
    return this.components[i];
  }

  public setComponent(i: number, c: string): StringArrayName {
    this.assertHasValidIndex(i);
    IllegalArgumentException.assert(c != null, "Component cannot be null");
    const newComponents = [...this.components];
    newComponents[i] = c;
    return new StringArrayName(newComponents, this.delimiter);
  }

  public insert(i: number, c: string): StringArrayName {
    this.assertHasValidIndex(i); //TODO: allowed at the end?
    IllegalArgumentException.assert(c != null, "Component cannot be null");
    const newComponents = [...this.components];
    newComponents.splice(i, 0, c);
    return new StringArrayName(newComponents, this.delimiter);
  }

  public append(c: string): StringArrayName {
    return this.insert(this.getNoComponents(), c);
  }

  public remove(i: number): StringArrayName {
    this.assertHasValidIndex(i);
    const newComponents = [...this.components];
    newComponents.splice(i, 1);
    return new StringArrayName(newComponents, this.delimiter);
  }

  public concat(other: Name): StringArrayName {
    IllegalArgumentException.assert(other != null, "Other cannot be null");
    IllegalArgumentException.assert(
      this.getDelimiterCharacter() === other.getDelimiterCharacter(),
      "Dellimiter chars must match for concatenation"
    );
    const otherComponents = Array.from(
      { length: other.getNoComponents() },
      (_, i) => other.getComponent(i)
    );
    return new StringArrayName(
      [...this.components, ...otherComponents],
      this.delimiter
    );
  }

  // methods for assertions (preconditions)
  protected assertHasValidIndex(i: number): void {
    IllegalArgumentException.assert(
      i != null && i !== undefined,
      "Index cannot be null or undefined"
    );
    const noComponents = this.getNoComponents();
    IllegalArgumentException.assert(
      i >= 0 && i < noComponents,
      `Index ${i} is out of bounds. Valid range: 0-${noComponents - 1}`
    );
  }
}
