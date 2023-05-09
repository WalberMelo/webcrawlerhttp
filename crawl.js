const { JSDOM } = require("jsdom");
const axios = require("axios");

async function crawlPage(baseURL, currentURL, pages) {
  try {
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);

    if (baseURLObj.hostname !== currentURLObj.hostname) {
      return pages;
    }

    const normalizedCurrentURL = normalizeURL(currentURL);
    if (pages[normalizedCurrentURL] > 0) {
      pages[normalizedCurrentURL]++;
      return pages;
    }

    pages[normalizedCurrentURL] = 1;

    console.log(`actively crawling: ${currentURL}`);

    const res = await axios.get(currentURL);
    if (res.status > 399) {
      console.log(
        `error in fetch with status code: ${res.status} on page: ${currentURL}`
      );
      return pages;
    }

    const contentType = res.headers["content-type"];
    if (!contentType.includes("text/html")) {
      console.log(
        `No html response, content type: ${contentType}, on page: ${currentURL}`
      );
      return pages;
    }

    const htmlBody = res.data;
    const nextURLs = getURLsFromHTML(htmlBody, baseURL);

    for (const nextURL of nextURLs) {
      pages = await crawlPage(baseURL, nextURL, pages);
    }
  } catch (error) {
    console.log(`error in fetch: ${error.message}, on page: ${currentURL}`);
  }
  return pages;
}

// Rest of the code remains the same

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll("a");
  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === "/") {
      //relative
      try {
        const urlObj = new URL(`${baseURL}${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`error with relative url:  ${err.message}`);
      }
    } else {
      // absolute
      try {
        const urlObj = new URL(`${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (err) {
        console.log(`error with absolute url:  ${err.message}`);
      }
    }
  }
  return urls;
}

function normalizeURL(urlString) {
  const urlObj = new URL(urlString);
  const hostPath = `${urlObj.hostname}${urlObj.pathname}`;
  if (hostPath.length > 0 && hostPath.slice(-1) == "/") {
    return hostPath.slice(0, -1);
  }
  return hostPath;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
