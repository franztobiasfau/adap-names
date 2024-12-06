import { describe, it, expect } from "vitest";

import { Exception } from "../../../src/adap-b05/common/Exception";
import { InvalidStateException } from "../../../src/adap-b05/common/InvalidStateException";
import { ServiceFailureException } from "../../../src/adap-b05/common/ServiceFailureException";

import { StringName } from "../../../src/adap-b05/names/StringName";

import { Node } from "../../../src/adap-b05/files/Node";
import { File } from "../../../src/adap-b05/files/File";
import { BuggyFile } from "../../../src/adap-b05/files/BuggyFile";
import { Directory } from "../../../src/adap-b05/files/Directory";
import { RootNode } from "../../../src/adap-b05/files/RootNode";
import { Exception } from "../common/Exception";
import { InvalidStateException } from "../../../src/adap-b05/common/InvalidStateException";
import { ServiceFailureException } from "../../../src/adap-b05/common/ServiceFailureException";

function createFileSystem(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new File("ls", bin);
  let code: File = new File("code", bin);

  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new File(".bashrc", riehle);
  let wallpaper: File = new File("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

describe("Basic naming test", () => {
  let fs: RootNode = createFileSystem();
  let ls: Node = [...fs.findNodes("ls")][0];
  it("test name checking", () => {
    expect(ls.getFullName().isEqual(new StringName("/usr/bin/ls", "/")));
  });

  it("test name rename", () => {
    let ls: Node = [...fs.findNodes("wallpaper.jpg")][0];
    expect(ls.getFullName().isEqual(new StringName("/home/riehle/wallpaper.jpg", "/")));

    ls.rename("test.png");
    expect(ls.getFullName().isEqual(new StringName("/home/riehle/test.png", "/")))
  });

  it("test name move", () => {
    let ls: Node = [...fs.findNodes("code")][0];
    expect(ls.getFullName().isEqual(new StringName("/usr/bin/code", "/")))

    ls.move(new Directory("media", fs));
    expect(ls.getFullName().isEqual(new StringName("/media/code", "/")));
  });
});

function createBuggySetup(): RootNode {
  let rn: RootNode = new RootNode();

  let usr: Directory = new Directory("usr", rn);
  let bin: Directory = new Directory("bin", usr);
  let ls: File = new BuggyFile("ls", bin);
  let code: File = new BuggyFile("code", bin);

  let media: Directory = new Directory("media", rn);

  let home: Directory = new Directory("home", rn);
  let riehle: Directory = new Directory("riehle", home);
  let bashrc: File = new BuggyFile(".bashrc", riehle);
  let wallpaper: File = new BuggyFile("wallpaper.jpg", riehle);
  let projects: Directory = new Directory("projects", riehle);

  return rn;
}

describe("Buggy setup test", () => {
  it("test finding files", () => {
    let threwException: boolean = false;
    try {
      let fs: RootNode = createBuggySetup();
      fs.findNodes("ls");
    } catch (er) {
      threwException = true;
      let ex: Exception = er as Exception;
      expect(ex instanceof ServiceFailureException);
      expect(ex.hasTrigger());
      let tx: Exception = ex.getTrigger();
      expect(tx instanceof InvalidStateException);
    }
    expect(threwException);
  });
});

describe("Basic file test", () => {
  let root: RootNode = createFileSystem();
  let parentDir: Directory = new Directory("testDir", root);
  let fs: File = new File("testFile", parentDir);
  let node: Node = [...fs.findNodes("testFile")][0];

  it("should open and close the file", () => {
    expect(node.getFullName().isEqual(new StringName("/testDir/testFile")));

    fs.open();
    expect(() => fs["assertIsValidFileState"]()).not.toThrow();

    fs.close();
    expect(() => fs["assertIsValidFileState"]()).not.toThrow();
  });
});
