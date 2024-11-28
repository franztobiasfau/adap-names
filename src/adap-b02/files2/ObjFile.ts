import { File } from "./File";

export class ObjFile implements File {

    protected data: Object[] = [];
    protected length: number = 0;
    protected open: boolean = false;

    public isEmpty(): boolean {
      return this.length == 0;
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
      return [...this.data]
=======
      throw new Error("incomplete example code");
>>>>>>> e42a56b49aa591786b0ab19e98e56ff3d3fa09d5
    }

    public write(data: Object[]): void {
      this.assertIsOpenFile();
<<<<<<< HEAD
      this.data.push(...data);
=======
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
      this.data = []
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