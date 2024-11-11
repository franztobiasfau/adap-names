export class File {

    private open: boolean = false;
    private content: Object[] = [];

    constructor(initialContents: Object[] = []) {
      this.content = initialContents;
    }

    public isOpen(): boolean {
      return this.open;
    }
  
    public isClosed(): boolean {
        return !this.open;
    }
  
    public read(): Object[] {
      this.assertIsOpenFile();
      return [...this.content];
    }
  
    public delete(): void {
      this.assertIsClosedFile();
      this.content = [];
    }

    protected assertIsOpenFile(): void {
        if (!this.isOpen()) {
          throw new Error("File must be open to perform this operation");
      }
    }

    protected assertIsClosedFile(): void {
        if (!this.isClosed()) {
          throw new Error("File must be closed to perform this operation");
      }
    }

}