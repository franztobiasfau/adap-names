import { File } from "./File";

export class ObjFile implements File {

    protected data: Object[] = [];
    protected length: number = 0;
    protected open: boolean = false;

    public isEmpty(): boolean {
      return this.length == 0;
    }

    public isOpen(): boolean {
      return this.open;
    }
  
    public isClosed(): boolean {
        return !this.open;
    }
  
    public read(): Object[] {
      this.assertIsOpenFile();
      return [...this.data]
    }

    public write(data: Object[]): void {
      this.assertIsOpenFile();
      this.data.push(...data);
    }
  
    public delete(): void {
      this.assertIsClosedFile();
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
    }

}