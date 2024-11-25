import { describe, it, expect } from "vitest";
import { StringArrayName } from "../../src/adap-b04/names/StringArrayName";
import { IllegalArgumentException } from "../../src/adap-b04/common/IllegalArgumentException";
import { MethodFailureException } from "../../src/adap-b04/common/MethodFailureException";
import { InvalidStateException } from "../../src/adap-b04/common/InvalidStateException";

describe("StringArrayName Tests", () => {
  describe("Initialization", () => {
    it("should initialize with valid components", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(name.getNoComponents()).toBe(3);
    });

    it("should throw if initialized with null components", () => {
      expect(() => new StringArrayName(null as any, ".")).toThrow(InvalidStateException);
    });

    it("should throw if initialized with undefined components", () => {
      expect(() => new StringArrayName(undefined as any, ".")).toThrow(InvalidStateException);
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
      name.setComponent(1, "x");
      expect(name.getComponent(1)).toBe("x");
      expect(name.getNoComponents()).toBe(3);
    });

    it("should throw for invalid index", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(() => name.setComponent(-1, "x")).toThrow(IllegalArgumentException);
      expect(() => name.setComponent(3, "x")).toThrow(IllegalArgumentException);
    });

    it("should throw for invalid component", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(() => name.setComponent(1, null as any)).toThrow(InvalidStateException);
    });
  });

  describe("insert", () => {
    it("should insert a component at the correct position", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      name.insert(1, "x");
      expect(name.getComponent(1)).toBe("x");
      expect(name.getNoComponents()).toBe(4);
      expect(name.getComponent(2)).toBe("b");
    });

    it("should throw for invalid index", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(() => name.insert(-1, "x")).toThrow(IllegalArgumentException);
      expect(() => name.insert(4, "x")).toThrow(IllegalArgumentException);
    });

    it("should throw for invalid component", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(() => name.insert(1, null as any)).toThrow(InvalidStateException);
    });
  });

  describe("append", () => {
    it("should append a component at the end", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      name.append("x");
      expect(name.getComponent(3)).toBe("x");
      expect(name.getNoComponents()).toBe(4);
    });

    it("should throw for invalid component", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(() => name.append(null as any)).toThrow(InvalidStateException);
    });
  });

  describe("remove", () => {
    it("should remove a component at the correct position", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      name.remove(1);
      expect(name.getNoComponents()).toBe(2);
      expect(name.getComponent(1)).toBe("c");
    });

    it("should throw for invalid index", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(() => name.remove(-1)).toThrow(IllegalArgumentException);
      expect(() => name.remove(3)).toThrow(IllegalArgumentException);
    });
  });

  describe("Invariant validation", () => {
    it("should validate the state after operations", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      name.setComponent(1, "x");
      name.insert(2, "y");
      name.append("z");
      name.remove(0);

      expect(name.getNoComponents()).toBe(4);
      expect(name.getComponent(0)).toBe("x");
      expect(name.getComponent(1)).toBe("y");
      expect(name.getComponent(2)).toBe("c");
      expect(name.getComponent(3)).toBe("z");
    });

    it("should restore state on failed assertions", () => {
      const name = new StringArrayName(["a", "b", "c"], ".");
      expect(() => name.setComponent(3, "x")).toThrow(IllegalArgumentException);
      expect(name.getNoComponents()).toBe(3); // State should be intact
      expect(name.getComponent(0)).toBe("a");
      expect(name.getComponent(1)).toBe("b");
      expect(name.getComponent(2)).toBe("c");
    });
  });
});
