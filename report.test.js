const { sortPages } = require("./report.js");
const { test, expect } = require("@jest/globals");

test("sortPages", () => {
  const input = {
    "http://wagslane.dev": 1,
    "http://wagslane.dev": 3,
  };
  const actual = sortPages(input);
  const expected = [["http://wagslane.dev", 3]];

  expect(actual).toEqual(expected);
});

test("sortPages 5 pages", () => {
  const input = {
    "http://wagslane.dev": 1,
    "http://wagslane.dev/path3": 3,
    "http://wagslane.dev/path5": 5,
    "http://wagslane.dev/path2": 2,
    "http://wagslane.dev/path9": 9,
  };
  const actual = sortPages(input);
  const expected = [
    ["http://wagslane.dev/path9", 9],
    ["http://wagslane.dev/path5", 5],
    ["http://wagslane.dev/path3", 3],
    ["http://wagslane.dev/path2", 2],
    ["http://wagslane.dev", 1],
  ];

  expect(actual).toEqual(expected);
});
