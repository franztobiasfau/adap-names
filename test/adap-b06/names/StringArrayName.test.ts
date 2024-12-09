import { describe, it, expect } from "vitest";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";
import { IllegalArgumentException } from "../../../src/adap-b06/common/IllegalArgumentException";
import { InvalidStateException } from "../../../src/adap-b06/common/InvalidStateException";

describe("StringArrayName Tests", () => {
  describe("Initialization", () => {
    it("should initialize with valid components", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(name.getNoComponents()).toBe(3);
    });

    it("should throw if initialized with null components", () => {
      expect(() => new StringArrayName(null as any, ".")).toThrow(IllegalArgumentException);
    });

    it("should throw if initialized with undefined components", () => {
      expect(() => new StringArrayName(undefined as any, ".")).toThrow(IllegalArgumentException);
    });

    it("As Value-Type-Object it should not allow external modification of components", () => {
      const source = ["a", "b", "c"];
      const name = new StringArrayName(source, ".");
      source[0] = "x"; // Mutation
      expect(name.getComponent(0)).toBe("a"); // Original soll unverändert bleiben
    });

    it("As Value-Type-Object it should return a new instance with updated components", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      const newName = name.setComponent(1, "x");
      
      expect(newName.getComponent(1)).toBe("x");
      expect(name.getComponent(1)).toBe("b"); // Original
      expect(newName).not.toBe(name); // Neue Instanz
    });
  });

  describe("getComponent", () => {
    it("should return the correct component", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(name.getComponent(1)).toBe("b");
    });

    it("should throw for invalid index", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(() => name.getComponent(-1)).toThrow(IllegalArgumentException);
      expect(() => name.getComponent(3)).toThrow(IllegalArgumentException);
    });
  });
  
  describe("setComponent", () => {
    it("should update the correct component", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      const newName = name.setComponent(1, "x");
      expect(newName.getComponent(1)).toBe("x");
      expect(name.getComponent(1)).toBe("b");
      expect(name.getNoComponents()).toBe(3); // Original
    });

    it("should throw for invalid index", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(() => name.setComponent(-1, "x")).toThrow(IllegalArgumentException);
      expect(() => name.setComponent(3, "x")).toThrow(IllegalArgumentException);
    });

    it("should throw for invalid component", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(() => name.setComponent(1, null as any)).toThrow(IllegalArgumentException);
    });
  });

  describe("insert", () => {
    it("should return a new instance with the component inserted", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      const newName = name.insert(1, "x");
      expect(newName.getComponent(1)).toBe("x");
      expect(newName.getNoComponents()).toBe(4);
      expect(name.getNoComponents()).toBe(3); // Original
    });
    
    it("should throw for invalid index", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(() => name.insert(-1, "x")).toThrow(IllegalArgumentException);
      expect(() => name.insert(4, "x")).toThrow(IllegalArgumentException);
    });

    it("should throw for invalid component", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(() => name.insert(1, null as any)).toThrow(IllegalArgumentException);
    });
  });

  describe("append", () => {
    it("should append a component at the end", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      const newName = name.append("x");
      expect(newName.getComponent(4)).toBe("x");
      expect(newName.getNoComponents()).toBe(4);
      expect(name.getNoComponents()).toBe(3);
    });

    it("should throw for invalid component", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(() => name.append(null as any)).toThrow(IllegalArgumentException);
    });
  });

  describe("remove", () => {
    it("should remove a component at the correct position", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      const newName = name.remove(1);

      expect(newName.getNoComponents()).toBe(2);
      expect(newName.getComponent(1)).toBe("c");

      expect(name.getNoComponents()).toBe(3);
      expect(name.getComponent(1)).toBe("b");
    });

    it("should throw for invalid index", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(() => name.remove(-1)).toThrow(IllegalArgumentException);
      expect(() => name.remove(3)).toThrow(IllegalArgumentException);
    });
  });

  describe("AbstractName Tests", () => {
    it("clone() should create a deep copy", () => {
      const original = new StringArrayName(["a", "b", "c"], ".");
      const clone = original.clone();
  
      expect(clone).not.toBe(original); // Ensure they are different objects
      expect(clone.isEqual(original)).toBe(true);
    });
  
    it("isEqual() should return true for identical names", () => {
      const name1 = new StringArrayName(["a", "b", "c"], ".");
      const name2 = new StringArrayName(["a", "b", "c"], ".");
  
      expect(name1.isEqual(name2)).toBe(true);
    });
  
    it("isEqual() should return false for different names", () => {
      const name1 = new StringArrayName(["a", "b", "c"], ".");
      const name2 = new StringArrayName(["x", "y", "z"], ".");
  
      expect(name1.isEqual(name2)).toBe(false);
    });
  });

  describe("Invariant validation", () => {
    it("should restore state on failed assertions", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(() => name.setComponent(3, "x")).toThrow(IllegalArgumentException);
      expect(name.getNoComponents()).toBe(3); // State should be intact
    });
  })
});
