import { Node } from "./Node";
import { Directory } from "./Directory";
import { MethodFailedException } from "../common/MethodFailedException";
import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";

enum FileState {
    OPEN,
    CLOSED,
    DELETED        
};

export class File extends Node {

    protected state: FileState = FileState.CLOSED;

    constructor(baseName: string, parent: Directory) {
        super(baseName, parent);
    }

    public open(): void {
        this.assertIsValidFileState();
        // do something
    }

    public read(noBytes: number): Int8Array {
        this.assertIsValidFileState();
        let result: Int8Array = new Int8Array(noBytes);
        // do something

        return result;
    }

    protected readNextByte(): number {
        return 0; // @todo
    }

    public close(): void {
        this.assertIsValidFileState();
        // do something
    }

    protected doGetFileState(): FileState {
        return this.state;
    }

    public findNodes(bn: string): Set<Node> {
        return super.findNodes(bn);
    }

    // methods for assertions (preconditions)
    protected assertIsValidFileState(): void {
        const condition: boolean = (this.state === this.doGetFileState());
        AssertionDispatcher.dispatch(ExceptionType.CLASS_INVARIANT, condition, "invalid file state");
      }
}