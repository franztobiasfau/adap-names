import { describe, it, expect } from "vitest";

import { Name } from "../../../src/adap-b03/names/Name";
import { StringName } from "../../../src/adap-b03/names/StringName";
import { StringArrayName } from "../../../src/adap-b03/names/StringArrayName";

describe("Basic StringName function tests", () => {
  it("test getNoComponents", () => {
    let n: Name = new StringName("");
    expect(n.getNoComponents()).toBe(1);
  });
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    expect(n.getNoComponents()).toBe(3);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("[StringName] basic test insert", () => {
    let n: Name = new StringName("oss#fau#de", "#");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
  it("[StringArrayName] basic test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"], "#");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
  it("[StringName] basic test append", () => {
    let n: Name = new StringName("oss#cs#fau", "#");
    n.append("de");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
  it("[StringArrayName] basic test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"], "#");
    n.append("de");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
  it("[StringName] test remove", () => {
    let n: Name = new StringName("oss#cs#fau#de", "#");
    n.remove(0);
    expect(n.asString()).toBe("cs#fau#de");
  });
  it("[StringArrayName] test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"], "#");
    n.remove(0);
    expect(n.asString()).toBe("cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("[StringName] test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", "#");

    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");

    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
  it("[StringArrayName] test escape and delimiter boundary conditions", () => {
    let n: Name = new StringArrayName(["oss.cs.fau.de"], "#");
    
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");

    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });

  it("[StringName] test insert and remove components", () => {
    let n: Name = new StringName("oss.cs.fau", "#");

    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau");

    n.insert(1, "de");
    expect(n.getNoComponents()).toBe(2);
    expect(n.asString()).toBe("oss.cs.fau#de");

    n.remove(1);
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau");
  });

  it("[StringArrayName] test insert and remove components", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"], "#");
    expect(n.getNoComponents()).toBe(3);
    expect(n.asString()).toBe("oss#cs#fau");

    n.insert(1, "example");
    expect(n.getNoComponents()).toBe(4);
    expect(n.asString()).toBe("oss#example#cs#fau");

    n.remove(1);
    expect(n.getNoComponents()).toBe(3);
    expect(n.asString()).toBe("oss#cs#fau");
  });
});

describe("asString and asDataString methods", () => {
  it("[StringName] test asString and asDataString", () => {
    let n: Name = new StringName("oss.cs.fau", ".");
    expect(n.getNoComponents()).toBe(3);

    n.append("de");
    expect(n.getNoComponents()).toBe(4);
    expect(n.asString()).toBe("oss.cs.fau.de");
    expect(n.asDataString()).toBe("oss\\.cs\\.fau\\.de");

    n.append("example#");
    expect(n.getNoComponents()).toBe(5);
    expect(n.asString()).toBe("oss.cs.fau.de.example#");
    expect(n.asDataString()).toBe("oss\\.cs\\.fau\\.de\\.example#");
  });

  it("[StringArrayName] test asString and asDataString", () => {
    let n: Name = new StringArrayName(["oss.", "cs.", "fau."], "#");

    expect(n.getNoComponents()).toBe(3);
    expect(n.asString()).toBe("oss.#cs.#fau.");

    n.append("example");
    expect(n.getNoComponents()).toBe(4);
    expect(n.asDataString()).toBe("oss.\\#cs.\\#fau.\\#example");
  });
});
