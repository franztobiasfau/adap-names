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
    super(delimiter);
    IllegalArgumentException.assert(
      name != null,
      "name cannot be null or undefined"
    );
    this.name = name;
    this.noComponents = this.splitComponents(this.name, this.delimiter).length;
    this.assertIsValidNameState(this.name);
  }

  // methods for assertions (class invariants)
  protected assertStringNameIsValid(): void {
    super.assertAbstractNameIsValid();
    InvalidStateException.assert(
      this.name != null,
      "Name cannot be null or undefined"
    );
    InvalidStateException.assert(
      this.noComponents != null,
      "noComponents cannot be null or undefined"
    );
    InvalidStateException.assert(
      this.noComponents === this.getNoComponents(),
      "noComponents is not === to the noComponents in Name"
    );
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
    const newName = this.asStringName(components);

    this.assertIsValidComponent("set", c, i, this.name, this.noComponents);
    return new StringName(newName, this.delimiter);
  }

  public insert(i: number, c: string): Name {
    this.assertHasValidIndex(i);
    IllegalArgumentException.assert(
      c != null,
      "Component cannot be null or undefined"
    );

    const components = this.splitComponents(this.name, this.delimiter);
    components.splice(i, 0, c);
    const newName = this.asStringName(components);

    this.assertIsValidComponent("insert", c, i, this.name, this.noComponents);
    return new StringName(newName, this.delimiter);
  }

  public append(c: string): Name {
    IllegalArgumentException.assert(
      c != null,
      "Component cannot be null or undefined"
    );

    const newName = this.name + this.getDelimiterCharacter() + c;
    this.assertIsValidComponent(
      "append",
      c,
      undefined,
      this.name,
      this.noComponents
    );
    return new StringName(newName, this.delimiter);
  }

  public remove(i: number): Name {
    this.assertHasValidIndex(i);

    const components = this.splitComponents(this.name, this.delimiter);
    components.splice(i, 1);
    const newName = this.asStringName(components);

    this.assertIsValidComponent("remove", null, i, this.name, this.noComponents);
    return new StringName(newName, this.delimiter);
  }

  public concat(other: Name): Name {
    IllegalArgumentException.assert(other != null, "Other cannot be null or undefined");
    IllegalArgumentException.assert(this.getDelimiterCharacter() === other.getDelimiterCharacter(), "Dellimiter chars must match for concatenation");
    
    const combinedName = this.name + this.getDelimiterCharacter() + other.asString();

    return new StringName(combinedName, this.delimiter);
  }

  /** @methodtype mutable-method to split components into array using a delimiter */
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

  /** @methodtype helper-method to create a string array anme */
  protected asStringArrayName(str: string = this.name): string[] {
    return this.splitComponents(str, this.getDelimiterCharacter());
  }

  /** @methodtype helper-method to combine string array into a delimited string */
  protected asStringName(
    stringArrayName: string[],
    delimiter: string = this.getDelimiterCharacter()
  ): string {
    return stringArrayName.join(delimiter);
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


  // methods for assertions (post-conditions)
  protected assertIsValidNameState(name: string): void {
    const cond = this.name === name;
    MethodFailedException.assert(cond, "StringName validation failed");
  }

  protected assertIsValidComponent(
    operationType: "set" | "insert" | "append" | "remove",
    component: string | null,
    index: number | undefined,
    original: string,
    originalNoComponents: number
  ): void {
    const originalComponents = this.asStringArrayName(original); //TODO: Changed concept to undefined
    const currentComponents = this.asStringArrayName();
    const expectedNoComponents =
      operationType === "set"
        ? originalNoComponents
        : operationType === "insert" || operationType === "append"
        ? originalNoComponents + 1
        : operationType === "remove"
        ? originalNoComponents - 1
        : originalNoComponents;

    if (currentComponents.length !== expectedNoComponents) {
      MethodFailedException.assert(false, "Component count validation failed");
    }

    switch (operationType) {
      case "set":
        if (index !== undefined && currentComponents[index] !== component) {
          MethodFailedException.assert(
            false,
            "Set component validation failed"
          );
        }
        break;

      case "insert":
        if (
          index === undefined ||
          index < 0 ||
          index >= currentComponents.length
        ) {
          MethodFailedException.assert(false, "Insert index is invalid");
        }
        break;

      case "remove":
        if (index === undefined || index < 0 || index >= originalNoComponents) {
          MethodFailedException.assert(false, "Remove index is invalid");
        }
        break;

      case "append":
        if (currentComponents[originalNoComponents] !== component) {
          MethodFailedException.assert(
            false,
            "Append component validation failed"
          );
        }
        break;

      default:
        MethodFailedException.assert(false, "Unknown operation type");
    }
  }
}
