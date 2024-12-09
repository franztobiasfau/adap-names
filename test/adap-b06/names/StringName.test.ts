import { describe, it, expect } from "vitest";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { IllegalArgumentException } from "../../../src/adap-b06/common/IllegalArgumentException";
import { InvalidStateException } from "../../../src/adap-b06/common/InvalidStateException";

describe("StringName Tests", () => {
  describe("Initialization", () => {
    it("should initialize with a valid name string", () => {
      const name = new StringName("a.b.c", ".");
      expect(name.getNoComponents()).toBe(3);
    });

    it("should throw if initialized with null name", () => {
      expect(() => new StringName(null as any, ".")).toThrow(InvalidStateException);
    });

    it("should throw if initialized with undefined name", () => {
      expect(() => new StringName(undefined as any, ".")).toThrow(InvalidStateException);
    });

    it("should throw if delimiter is invalid", () => {
      expect(() => new StringName("a.b.c", null as any)).toThrow(InvalidStateException);
    });

    it("As Value-Type-Object it should not allow external modifications of name string", () => {
      const source = "a.b.c";
      const name = new StringName(source, ".");
      source.slice(1);

      expect(name.toString()).toBe("a.b.c");
    });
  });

  describe("getComponent", () => {
    it("should return the correct component", () => {
      const name = new StringName("a.b.c", ".");
      expect(name.getComponent(1)).toBe("b");
    });

    it("should throw for invalid index", () => {
      const name = new StringName("a.b.c", ".");
      expect(() => name.getComponent(-1)).toThrow(IllegalArgumentException);
      expect(() => name.getComponent(3)).toThrow(IllegalArgumentException);
    });
  });

  describe("setComponent", () => {
    it("should return a new instance with the updated component", () => {
      const name = new StringName("a.b.c", ".");
      const newName = name.setComponent(1, "x");

      expect(newName.getComponent(1)).toBe("x");
      expect(name.getComponent(1)).toBe("b"); // Original bleibt unverändert
      expect(newName).not.toBe(name); // Neue Instanz
    });

    it("should throw for invalid index", () => {
      const name = new StringName("a.b.c", ".");
      expect(() => name.setComponent(-1, "x")).toThrow(IllegalArgumentException);
      expect(() => name.setComponent(3, "x")).toThrow(IllegalArgumentException);
    });

    it("should throw for invalid component", () => {
      const name = new StringName("a.b.c", ".");
      expect(() => name.setComponent(1, null as any)).toThrow(IllegalArgumentException);
    });
  });

  describe("insert", () => {
    it("should return a new instance with the inserted component", () => {
      const name = new StringName("a.b.c", ".");
      const newName = name.insert(1, "x");
      expect(newName.getComponent(1)).toBe("x");
      expect(newName.getNoComponents()).toBe(4);
      expect(newName.getComponent(2)).toBe("b");
      expect(name.getNoComponents()).toBe(3);
    });

    it("should throw for invalid index", () => {
      const name = new StringName("a.b.c", ".");
      expect(() => name.insert(-1, "x")).toThrow(IllegalArgumentException);
      expect(() => name.insert(4, "x")).toThrow(IllegalArgumentException);
    });

    it("should throw for invalid component", () => {
      const name = new StringName("a.b.c", ".");
      expect(() => name.insert(1, null as any)).toThrow(IllegalArgumentException);
    });
  });

  describe("append", () => {
    it("should return a new instance with the appended component", () => {
      const name = new StringName("a.b.c", ".");
      const newName = name.append("x");
      expect(newName.getComponent(3)).toBe("x");
      expect(newName.getNoComponents()).toBe(4);
      expect(name.getNoComponents()).toBe(3);
    });

    it("should throw for invalid component", () => {
      const name = new StringName("a.b.c", ".");
      expect(() => name.append(null as any)).toThrow(IllegalArgumentException);
    });
  });

  describe("remove", () => {
    it("should return a new instance with the component removed", () => {
      const name = new StringName("a.b.c", ".");
      const newName = name.remove(1);
      expect(newName.getNoComponents()).toBe(2);
      expect(newName.getComponent(1)).toBe("c");
      expect(name.getNoComponents()).toBe(3);
    });

    it("should throw for invalid index", () => {
      const name = new StringName("a.b.c", ".");
      expect(() => name.remove(-1)).toThrow(IllegalArgumentException);
      expect(() => name.remove(3)).toThrow(IllegalArgumentException);
    });
  });

  describe("AbstractName Tests", () => {
    it("clone() should create a deep copy", () => {
      const original = new StringName("a.b.c.d", ".");
      const clone = original.clone();
  
      expect(clone).not.toBe(original); // Ensure they are different objects
      expect(clone.isEqual(original)).toBe(true);
    });
  
    it("isEqual() should return true for identical names", () => {
      const name1 = new StringName("a.b.c.d", ".");
      const name2 = new StringName("a.b.c.d", ".");
  
      expect(name1.isEqual(name2)).toBe(true);
    });
  
    it("isEqual() should return false for different names", () => {
      const name1 = new StringName("a.b.c.d", ".");
      const name2 = new StringName("e.f.g.h", ".");
  
      expect(name1.isEqual(name2)).toBe(false);
    });
  });
  
  describe("Invariant validation", () => {
    it("should validate the state after multiple operations", () => {
      const name = new StringName("a.b.c", ".");
      const newName = name
        .setComponent(1, "x")
        .insert(2, "y")
        .append("z")
        .remove(0);

      expect(newName.getNoComponents()).toBe(4);
      expect(newName.getComponent(0)).toBe("x");
      expect(newName.getComponent(1)).toBe("y");
      expect(newName.getComponent(2)).toBe("c");
      expect(newName.getComponent(3)).toBe("z");

      // Original bleibt unverändert
      expect(name.getComponent(0)).toBe("a");
    });

    it("should restore state on failed assertions", () => {
      const name = new StringName("a.b.c", ".");
      expect(() => name.setComponent(3, "x")).toThrow(IllegalArgumentException);
      expect(name.getNoComponents()).toBe(3); // State should be intact
      expect(name.getComponent(0)).toBe("a");
      expect(name.getComponent(1)).toBe("b");
      expect(name.getComponent(2)).toBe("c");
    });
  });
});
