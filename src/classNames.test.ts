import classNames from "./classNames";

describe("classNames", () => {
  it("should handle empty array", () => {
    expect(classNames([])).toBe("");
  });

  it("should handle two class names", () => {
    expect(classNames(["classA", "classB"])).toBe("classA classB");
  });

  it("should handle a false value", () => {
    expect(classNames(["classA", false, "classB"])).toBe("classA classB");
  });

  it("should ignore undefined", () => {
    expect(classNames(["classA", undefined, "classB"])).toBe("classA classB");
  });
});
