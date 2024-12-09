import { describe, it, expect } from "vitest";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";

describe("StringName and StringArrayName - asString and asDataString Tests", () => {
    describe("StringName", () => {
      it("should escape the delimiter in asString()", () => {
        const name = new StringName("a.b.c", ".");
        expect(name.asString()).toBe("a\\.b\\.c");
      });
  
      it("should not escape the escape character in asString()", () => {
        const name = new StringName("a\\b\\c", ".");
        expect(name.asString()).toBe("a\\b\\c");
      });
  
      it("should handle mixed delimiters and escape characters in asString()", () => {
        const name = new StringName("a.b\\c.d", ".");
        expect(name.asString()).toBe("a\\.b\\c\\.d");
      });
  
      it("should use a custom delimiter for asString()", () => {
        const name = new StringName("a,b;c", ",");
        expect(name.asString()).toBe("a,b;c");
      });
  
      it("should handle components with no delimiters in asString()", () => {
        const name = new StringName("abc", ".");
        expect(name.asString()).toBe("abc");
      });
    });
  
    describe("StringArrayName", () => {
      it("should escape the delimiter in asString()", () => {
        const name = new StringArrayName(["a.b", "c.d"], ".");
        expect(name.asString()).toBe("a\\.b.c\\.d");
      });
  
      it("should not escape the escape character in asString()", () => {
        const name = new StringArrayName(["a\\b", "c\\d"], ".");
        expect(name.asString()).toBe("a\\b.c\\d");
      });
  
      it("should handle components with mixed delimiters and escape characters in asString()", () => {
        const name = new StringArrayName(["a.b", "c\\d.e"], ".");
        expect(name.asString()).toBe("a\\.b.c\\d\\.e");
      });
  
      it("should use a custom delimiter for asString()", () => {
        const name = new StringArrayName(["a;b", "c,d"], ",");
        expect(name.asString()).toBe("a;b;c\\,d");
      });
  
      it("should handle components with no delimiters in asString()", () => {
        const name = new StringArrayName(["abc", "def"], ".");
        expect(name.asString()).toBe("abc.def");
      });
    });
  
    describe("General edge cases", () => {
      it("should escape delimiters in a single-component StringName", () => {
        const name = new StringName("a.b", ".");
        expect(name.asString()).toBe("a\\.b");
      });
  
      it("should escape delimiters in a single-component StringArrayName", () => {
        const name = new StringArrayName(["a.b"], ".");
        expect(name.asString()).toBe("a\\.b");
      });
  
      it("should handle an empty StringName", () => {
        const name = new StringName("", ".");
        expect(name.asString()).toBe("");
      });
  
      it("should handle an empty StringArrayName", () => {
        const name = new StringArrayName([], ".");
        expect(name.asString()).toBe("");
      });
  
      it("should escape a component that is the delimiter itself", () => {
        const name = new StringArrayName(["."], ".");
        expect(name.asString()).toBe("\\.");
      });
    });
  });
  




// import { describe, it, expect } from "vitest";
// import { StringName } from "../../src/adap-b04/names/StringName";
// import { StringArrayName } from "../../src/adap-b04/names/StringArrayName";
// import { ESCAPE_CHARACTER } from "../../src/adap-b04/common/Printable";

// describe("StringName and StringArrayName - asString and asDataString Tests", () => {
//   describe("StringName", () => {
//     it("should return components joined by the default delimiter with asString()", () => {
//       const name = new StringName("a.b.c", ".");
//       expect(name.asString()).toBe("a.b.c");
//     });

//     it("should use a custom delimiter for asString()", () => {
//       const name = new StringName("a.b.c", ".");
//       expect(name.asString("-")).toBe("a-b-c");
//     });

//     it("should escape delimiter and escape character in asString()", () => {
//       const name = new StringName(`a..b.c`, ".");
//       expect(name.asString()).toBe(`a\\..b.c`);
//     });

//     it("should return valid JSON from asDataString()", () => {
//       const name = new StringName("a.b.c", ".");
//       const expected = JSON.stringify({
//         dataString: "a.b.c",
//         delimiter: ".",
//       });
//       expect(name.asDataString()).toBe(expected);
//     });

//     it("should escape components correctly in asDataString()", () => {
//       const name = new StringName(`a..b.c`, ".");
//       const escapedComponent = `a${ESCAPE_CHARACTER}${ESCAPE_CHARACTER}..b.c`;
//       const expected = JSON.stringify({
//         dataString: escapedComponent,
//         delimiter: ".",
//       });
//       expect(name.asDataString()).toBe(expected);
//     });
//   });

//   describe("StringArrayName", () => {
//     it("should return components joined by the default delimiter with asString()", () => {
//       const name = new StringArrayName(["a", "b", "c"], ".");
//       expect(name.asString()).toBe("a.b.c");
//     });

//     it("should use a custom delimiter for asString()", () => {
//       const name = new StringArrayName(["a", "b", "c"], ".");
//       expect(name.asString("-")).toBe("a-b-c");
//     });

//     it("should escape delimiter and escape character in asString()", () => {
//       const name = new StringArrayName([`a${ESCAPE_CHARACTER}`, "b", "c"], ".");
//       expect(name.asString()).toBe(`a${ESCAPE_CHARACTER}${ESCAPE_CHARACTER}.b.c`);
//     });

//     it("should return valid JSON from asDataString()", () => {
//       const name = new StringArrayName(["a", "b", "c"], ".");
//       const expected = JSON.stringify({
//         dataString: "a.b.c",
//         delimiter: ".",
//       });
//       expect(name.asDataString()).toBe(expected);
//     });

//     it("should escape components correctly in asDataString()", () => {
//       const name = new StringArrayName([`a${ESCAPE_CHARACTER}`, "b", "c"], ".");
//       const escapedComponent = `a${ESCAPE_CHARACTER}${ESCAPE_CHARACTER}.b.c`;
//       const expected = JSON.stringify({
//         dataString: escapedComponent,
//         delimiter: ".",
//       });
//       expect(name.asDataString()).toBe(expected);
//     });
//   });
// });
