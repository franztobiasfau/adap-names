import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { MethodFailureException } from "../common/MethodFailureException";
import { InvalidStateException } from "../common/InvalidStateException";

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
        return new StringName("", ".");
    }
    
    public init(other: string) {
        this.name = other;
        this.noComponents = this.getNoComponents();
    }

    // methods for assertions (class invariants)
    protected assertStringNameIsValid() {
        super.assertAbstractNameIsValid();
        InvalidStateException.assertIsNotNullOrUndefined(this.name, "");
        InvalidStateException.assertIsNotNullOrUndefined(this.noComponents, "")

        const cond = this.noComponents === this.getNoComponents();
        InvalidStateException.assertCondition(cond, "");
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


    // methods for assertions (post-conditions)
    protected assertIsValidNameState(name: string): void {
        const cond = this.name === name;
        MethodFailureException.assertCondition(cond, "StringName validation failed");
    }
}