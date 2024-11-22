import { Node } from "./Node";
import { Directory } from "./Directory";
import { InvalidStateException } from "../common/InvalidStateException";

enum FileState {
  OPEN,
  CLOSED,
  DELETED,
}

export class File extends Node {
  protected state: FileState = FileState.CLOSED;

  constructor(baseName: string, parent: Directory) {
    super(baseName, parent);
  }

  public open(): void {
    this.assertFileOpen();
    // do something
  }

  public close(): void {
    this.assertFileClosed();
    // do something
  }

  protected doGetFileState(): FileState {
    return this.state;
  }

  // Implementing preconditions methods
  protected assertFileOpen(): void {
    InvalidStateException.assertCondition(
      this.doGetFileState() === FileState.CLOSED,
      "A file that is already open or deleted cannot be open!"
    );
  }

  protected assertFileClosed(): void {
    InvalidStateException.assertCondition(
      this.doGetFileState() === FileState.OPEN,
      "A file that is already closed or deleted cannot be closed!"
    );
  }
}
