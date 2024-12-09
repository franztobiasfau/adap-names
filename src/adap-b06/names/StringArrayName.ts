import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {
  private readonly components: string[];

  constructor(source: string[], delimiter?: string) {
    IllegalArgumentException.assert(
      source != null,
      "source cannot be null or undefined"
    );

    super(delimiter || DEFAULT_DELIMITER);
    this.components = [...source]; // copy to maintain immutability

    InvalidStateException.assert(
      this.components != null,
      "Components cannot be null or undefined"
    );
  }

  public clone(): Name {
    return new StringArrayName([...this.components], this.getDelimiterCharacter());
  }

  public toString(): string {
    return this.components.join(this.getDelimiterCharacter());
  }

  // use escape logic
  public asString(): string {
    return this.joinWithEscape(this.components);
  }

  public getNoComponents(): number {
    return this.components.length;
  }

  public getComponent(i: number): string {
    this.assertHasValidIndex(i);
    return this.components[i];
  }

  public setComponent(i: number, c: string): Name {
    this.assertHasValidIndex(i);
    IllegalArgumentException.assert(c != null, "Component cannot be null");

    const newComponents = [...this.components];
    newComponents[i] = this.escapeDelimiter(c);

    return new StringArrayName(newComponents, this.delimiter);
  }

  public insert(i: number, c: string): Name {
    this.assertHasValidIndex(i);
    IllegalArgumentException.assert(c != null, "Component cannot be null");

    const newComponents = [...this.components];
    newComponents.splice(i, 0, this.escapeDelimiter(c));

    return new StringArrayName(newComponents, this.delimiter);
  }

  public append(c: string): Name {
    IllegalArgumentException.assert(c != null, "Component cannot be null");

    const newComponents = [...this.components];
    newComponents.push(this.escapeDelimiter(c));

    return new StringArrayName(newComponents, this.delimiter);
  }

  public remove(i: number): Name {
    this.assertHasValidIndex(i);

    const newComponents = [...this.components];
    newComponents.splice(i, 1);

    return new StringArrayName(newComponents, this.delimiter);
  }

  public concat(other: Name): Name {
    IllegalArgumentException.assert(other != null, "Other cannot be null");
    IllegalArgumentException.assert(
      this.getDelimiterCharacter() === other.getDelimiterCharacter(),
      "Dellimiter chars must match for concatenation"
    );
    const otherComponents = Array.from(
      { length: other.getNoComponents() },
      (_, i) => this.escapeDelimiter(other.getComponent(i))
    );
    return new StringArrayName(
      [...this.components, ...otherComponents],
      this.delimiter
    );
  }

  /** @methodtype helper-methods to split components using a delimiter */
  protected escapeDelimiter(str: string): string {
    const escapedDelimiter = this.getDelimiterCharacter().replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(escapedDelimiter, "g");
    return str.replace(
      regex,
      `${ESCAPE_CHARACTER}${this.getDelimiterCharacter()}`
    );
  }

  /** @methodtype helper-methods to split components using a delimiter */
  protected joinWithEscape(components: string[]): string {
    return components
      .map((c) =>
        c.replace(
          new RegExp(`${ESCAPE_CHARACTER}${this.getDelimiterCharacter()}`, "g"),
          `${ESCAPE_CHARACTER}${this.getDelimiterCharacter()}`
        )
      )
      .join(this.getDelimiterCharacter());
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
