export class File {

    private open: boolean = false;
    private content: Object[] = [];

    constructor(initialContents: Object[] = []) {
      this.content = initialContents;
    }

    public isOpen(): boolean {
<<<<<<< HEAD
      return this.open;
    }
  
    public isClosed(): boolean {
        return !this.open;
=======
      throw new Error("incomplete example code");
    }
  
    public isClosed(): boolean {
        throw new Error("incomplete example code");
>>>>>>> e42a56b49aa591786b0ab19e98e56ff3d3fa09d5
    }
  
    public open(): void {
      this.assertIsClosedFile();
      throw new Error("incomplete example code");
    }

    public read(): Object[] {
      this.assertIsOpenFile();
<<<<<<< HEAD
      return [...this.content];
=======
      throw new Error("incomplete example code");
    }

    public write(data: Object[]): void {
      this.assertIsOpenFile();
      throw new Error("incomplete example code");
>>>>>>> e42a56b49aa591786b0ab19e98e56ff3d3fa09d5
    }
  
    public close(): void {
      this.assertIsOpenFile();
      throw new Error("incomplete example code");
    }

    public delete(): void {
      this.assertIsClosedFile();
<<<<<<< HEAD
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
=======
      throw new Error("incomplete example code");
    }

    protected assertIsOpenFile(): void {
        throw new Error("incomplete example code");
    }

    protected assertIsClosedFile(): void {
        throw new Error("incomplete example code");
>>>>>>> e42a56b49aa591786b0ab19e98e56ff3d3fa09d5
    }

}