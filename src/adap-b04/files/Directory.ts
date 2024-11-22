import { Node } from "./Node";
import { IllegalArgumentException } from "../common/IllegalArgumentException";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public add(cn: Node): void {
        this.assertDirectoryNodeAdd(cn);
        this.childNodes.add(cn);
    }

    public remove(cn: Node): void {
        this.assertDirectoryNodeRemove(cn);
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    // Implementing preconditions methods
    protected assertDirectoryNodeAdd(cn: Node) {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);
    }

    protected assertDirectoryNodeRemove(cn: Node) {
        IllegalArgumentException.assertIsNotNullOrUndefined(cn);
        IllegalArgumentException.assertCondition(this.childNodes.has(cn),"Node does not exist in childNodes");
    }

}