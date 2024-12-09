import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { MethodFailedException } from "../common/MethodFailedException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringName extends AbstractName {
  private readonly name: string;
  private readonly noComponents: number;

  constructor(name: string, delimiter?: string) {
    InvalidStateException.assert(
      name != null,
      "Name cannot be null or undefined"
    );

    super(delimiter || DEFAULT_DELIMITER);
    this.name = name;
    this.noComponents = this.splitComponents(this.name, this.delimiter).length;

    InvalidStateException.assert(
      this.noComponents != null,
      "noComponents cannot be null or undefined"
    );
    InvalidStateException.assert(
      this.noComponents === this.getNoComponents(),
      "noComponents is not === to the noComponents in Name"
    );
  }

  public clone(): Name {
    return new StringName(this.name, this.getDelimiterCharacter());
  }

  public toString(): string {
    return this.joinWithEscape(this.splitComponents(this.name));
  }

  // use escape logic
  public asString(delimiter?: string): string {
    delimiter = delimiter ?? this.getDelimiterCharacter();
    this.assertHasValidDelimiter(delimiter);
    return this.escapeDelimiter(this.name);
  }

  public getNoComponents(): number {
    return this.splitComponents(this.name, this.delimiter).length;
  }

  public getComponent(i: number): string {
    this.assertHasValidIndex(i);
    const component = this.splitComponents(this.name, this.delimiter);
    return component[i];
  }

  public setComponent(i: number, c: string): Name {
    this.assertHasValidIndex(i);
    IllegalArgumentException.assert(
      c != null,
      "Component cannot be null or undefined"
    );

    const components = this.splitComponents(this.name, this.delimiter);
    components[i] = c;

    // Postcondition Validation for value-type-objects
    const expectedComponents = [...components];
    if (expectedComponents[i] !== c) {
      throw new MethodFailedException("Set component validation failed");
    }

    return new StringName(
      this.joinWithEscape(components),
      this.getDelimiterCharacter()
    );
  }

  public insert(i: number, c: string): Name {
    this.assertHasValidIndex(i);
    IllegalArgumentException.assert(
      c != null,
      "Component cannot be null or undefined"
    );

    const components = this.splitComponents(this.name, this.delimiter);
    components.splice(i, 0, c);

    // Postcondition Validation
    if (
      components[i] !== c ||
      components.length !== this.getNoComponents() + 1
    ) {
      throw new MethodFailedException("Insert component validation failed");
    }

    return new StringName(
      this.joinWithEscape(components),
      this.getDelimiterCharacter()
    );
  }

  public append(c: string): Name {
    IllegalArgumentException.assert(
      c != null,
      "Component cannot be null or undefined"
    );
    const newName = this.name + this.getDelimiterCharacter() + c;

    // Postcondition Validation
    const newComponents = this.splitComponents(
      newName,
      this.getDelimiterCharacter()
    );
    if (
      newComponents[newComponents.length - 1] !== c ||
      newComponents.length !== this.noComponents + 1
    ) {
      throw new MethodFailedException("Append component validation failed");
    }

    return new StringName(
      this.escapeDelimiter(newName),
      this.getDelimiterCharacter()
    );
  }

  public remove(i: number): Name {
    this.assertHasValidIndex(i);

    const components = this.splitComponents(
      this.name,
      this.getDelimiterCharacter()
    );
    const removedComponent = components.splice(i, 1);

    // Postcondition Validation
    if (
      components.includes(removedComponent[0]) ||
      components.length !== this.noComponents - 1
    ) {
      throw new MethodFailedException("Remove component validation failed");
    }

    return new StringName(
      this.joinWithEscape(components),
      this.getDelimiterCharacter()
    );
  }

  public concat(other: Name): Name {
    IllegalArgumentException.assert(
      other != null,
      "Other cannot be null or undefined"
    );
    IllegalArgumentException.assert(
      this.getDelimiterCharacter() === other.getDelimiterCharacter(),
      "Dellimiter chars must match for concatenation"
    );

    const combinedName =
      this.name + this.getDelimiterCharacter() + other.asString();

    return new StringName(combinedName, this.delimiter);
  }

  /** @methodtype helper-methods to split components using a delimiter */
  protected splitComponents(
    str: string,
    delimiter: string = this.getDelimiterCharacter()
  ): string[] {
    const regexEscapedDelimiter = delimiter.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    );
    const regex = new RegExp(
      `(?<!\\${ESCAPE_CHARACTER})${regexEscapedDelimiter}`,
      "g"
    );
    return str.split(regex);
  }

  /** @methodtype helper-methods to split components using a delimiter */
  protected joinWithEscape(components: string[]): string {
    return components
      .map((c) =>
        c.replace(
          this.getDelimiterCharacter(),
          `${ESCAPE_CHARACTER}${this.getDelimiterCharacter()}`
        )
      )
      .join(this.getDelimiterCharacter());
  }

  /** @methodtype helper-methods to split components using a delimiter */
  protected escapeDelimiter(str: string): string {
    // Dynamisch den aktuellen Delimiter escapen
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
