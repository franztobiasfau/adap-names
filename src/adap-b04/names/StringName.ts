import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { MethodFailureException } from "../common/MethodFailureException";
import { InvalidStateException } from "../common/InvalidStateException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        this.assertHasValidParameter(other, "other cannot be null or undefined");
        this.init(other)
        this.assertIsValidNameState(other);
    }

    public createOrigin(): Name {
        return new StringName("", DEFAULT_DELIMITER);
    }
    
    public init(other: string): void {
        this.name = other;
        this.noComponents = this.getNoComponents();
    }

    public reset(original: string, noComponents: number): void {
        this.name = original;
        this.noComponents = noComponents;
    }

    // methods for assertions (class invariants)
    protected assertStringNameIsValid(): void {
        super.assertAbstractNameIsValid();
        InvalidStateException.assertIsNotNullOrUndefined(this.name, "Name cannot be null or undefined");
        InvalidStateException.assertIsNotNullOrUndefined(this.noComponents, "noComponents cannot be null or undefined");

        const cond = this.noComponents === this.getNoComponents();
        InvalidStateException.assertCondition(cond, "noComponents is not === to the noComponents in Name");
    }

    public getNoComponents(): number {
        return this.asStringArrayName().length;
    }

    public getComponent(i: number): string {
        this.assertHasValidIndex(i);
        const component = this.asStringArrayName()[i];
        return component;
    }

    public setComponent(i: number, c: string) {
        this.assertHasValidIndex(i);
        this.assertHasValidParameter(c);

        const original = this.name;
        const noComponents = this.noComponents;

        const components = this.asStringArrayName();
        components[i] = c;
        this.name = this.asStringName(components); 

        this.assertIsValidComponent("set", c, i, original, noComponents);
    }

    public insert(i: number, c: string) {
        this.assertHasValidIndex(i);
        this.assertHasValidParameter(c);

        const original = this.name;
        const noComponents = this.noComponents;

        let components = this.asStringArrayName();
        components.splice(i, 0, c);
        this.name = this.asStringName(components);
        this.noComponents += 1;

        this.assertIsValidComponent("insert", c, i, original, noComponents);
    }

    public append(c: string) {
        this.assertHasValidParameter(c);
        const original = this.name;
        const noComponents = this.noComponents;

        this.name += this.getDelimiterCharacter() + c;
        this.noComponents += 1;

        this.assertIsValidComponent("append", c, null, original, noComponents);
    }

    public remove(i: number) {
        this.assertHasValidIndex(i);

        const original = this.name;
        const noComponents = this.noComponents;

        let components = this.asStringArrayName();
        components.splice(i, 1);
        this.name = this.asStringName(components);
        this.noComponents -= 1;

        this.assertIsValidComponent("remove", null, i, original, noComponents);
    }


    /** @methodtype helper-method */
    protected splitComponents(str: string, delimiter: string = this.getDelimiterCharacter()): string[] {
        const regex = this.createRegexForDelimiter(delimiter);
        return str.split(regex);
    }

    /** @methodtype helper-method */
    protected createRegexForDelimiter(delimiter: string): RegExp {
        const regexEscapedDelimiter = delimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        return new RegExp(`(?<!\\${ESCAPE_CHARACTER})${regexEscapedDelimiter}`, "g");
    }

    /** @methodtype helper-method */
    protected asStringArrayName(str: string = this.name): string[] {
        return this.splitComponents(str, this.getDelimiterCharacter());
    }

    /** @methodtype helper-method */
    protected asStringName(stringArrayName: string[], delimiter: string = this.getDelimiterCharacter()): string {
        return stringArrayName.join(delimiter);
    }

    // methods for assertions (preconditions)
    protected assertHasValidIndex(i: number): void {
        IllegalArgumentException.assertIsNotNullOrUndefined(i);
        const cond = (i >= 0 && i < this.getNoComponents());
        IllegalArgumentException.assertCondition(cond, "Index is out of bounds");
    }

    // methods for assertions (post-conditions)
    protected assertIsValidNameState(name: string): void {
        const cond = this.name === name;
        MethodFailureException.assertCondition(cond, "StringName validation failed");
    }

    protected assertIsValidComponent(
        operationType: "set" | "insert" | "append" | "remove",
        component: string | null,
        index: number | null,
        original: string,
        originalNoComponents: number
    ): void {
        const expectedNoComponents =
            operationType === "set" ? originalNoComponents :
            operationType === "insert" || operationType === "append" ? originalNoComponents + 1 :
            operationType === "remove" ? originalNoComponents - 1 :
            originalNoComponents;
    
        const stringArrayName = this.asStringArrayName();
        const origArrayName = this.asStringArrayName(original);

        if (this.noComponents !== expectedNoComponents) {
            this.reset(original, originalNoComponents);
            MethodFailureException.assertCondition(false, "Component validation failed");
        }

        for (let i_orig = 0, i_new = 0; i_orig < originalNoComponents; i_orig++, i_new++) {
            if (operationType === "insert" && i_orig === index) {
                if (stringArrayName[i_new] !== component) {
                    this.reset(original, originalNoComponents);
                    MethodFailureException.assertCondition(false, "Insert component validation failed");
                }
                i_new++; // Springe in der neuen Liste weiter
            } else if (operationType === "remove" && i_orig === index) {
                i_orig++; // Überspringe den removed Index in der alten Liste
            } else if (operationType === "set" && i_orig === index) {
                if (stringArrayName[i_new] !== component) {
                    this.reset(original, originalNoComponents);
                    MethodFailureException.assertCondition(false, "Set component validation failed");
                }
            } else if (stringArrayName[i_new] !== origArrayName[i_orig]) {
                this.reset(original, originalNoComponents);
                MethodFailureException.assertCondition(false, `Component mismatch after ${operationType}`);
            }
        }

        if (operationType === "append" && stringArrayName[originalNoComponents] !== component) {
            this.reset(original, originalNoComponents);
            MethodFailureException.assertCondition(false, "Append component validation failed");
        }
    }
    
}