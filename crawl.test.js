const { normalizeURL, getURLsFromHTML } = require("./crawl.js");
const { test, expect } = require("@jest/globals");

test("normalizeURL stripe protocol", () => {
  const input = "https://blog.boot.dev/path";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";

  expect(actual).toEqual(expected);
});

test("normalizeURL stripe trailing slash", () => {
  const input = "https://blog.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";

  expect(actual).toEqual(expected);
});

test("normalizeURL capitals", () => {
  const input = "https://BLOG.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";

  expect(actual).toEqual(expected);
});

test("normalizeURL stripe http", () => {
  const input = "http://blog.boot.dev/path/";
  const actual = normalizeURL(input);
  const expected = "blog.boot.dev/path";

  expect(actual).toEqual(expected);
});

test("getURLsFromHTML absolute", () => {
  const inputHTMLBody = `
<html>
<body>
  <header>
    <h1>Welcome to my Website</h1>
    <nav>
      <ul>
        <li><a href="https://blog.boot.dev/path/">Boot.dev Blog</a></li>
      </ul>
    </nav>
  </header>
</body>
</html>
 `;
  const inputBaseURL = "https://blog.boot.dev/path/";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = ["https://blog.boot.dev/path/"];

  expect(actual).toEqual(expected);
});

test("getURLsFromHTML relative", () => {
  const inputHTMLBody = `
<html>
<body>
  <header>
    <h1>Welcome to my Website</h1>
    <nav>
      <ul>
        <li><a href="/home/">Home</a></li>
        <li><a href="/about/">About us</a></li>
      </ul>
    </nav>
  </header>
</body>
</html>
 `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [
    "https://blog.boot.dev/home/",
    "https://blog.boot.dev/about/",
  ];

  expect(actual).toEqual(expected);
});

test("getURLsFromHTML invalid", () => {
  const inputHTMLBody = `
<html>
<body>
  <header>
    <h1>Welcome to my Website</h1>
    <nav>
      <ul>
        <li><a href="invalid">Home</a></li>
      </ul>
    </nav>
  </header>
</body>
</html>
 `;
  const inputBaseURL = "https://blog.boot.dev";
  const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL);
  const expected = [];

  expect(actual).toEqual(expected);
});
