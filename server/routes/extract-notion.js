import puppeteer from "puppeteer";
import { htmlToText } from "html-to-text";

const getTextFromNotion = async (notionUrl) => {
  // launch browser instance in headless mode i.e. no UI
  const browser = await puppeteer.launch({
    headless: "new",
    // security-related flags
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  // open a new page
  const page = await browser.newPage();

  // user-agent so Notion hopefully wont detect us
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
  );

  // set viewport size to help fake real browser
  await page.setViewport({ width: 1280, height: 800 });

  // go to notionUrl
  await page.goto(notionUrl, { waitUntil: "networkidle0" });

  // wait for content on Notion page to render in DOM
  await page.waitForSelector(".notion-page-content", { timeout: 10000 });

  // fake delays pls don't detect us mr. Notion
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.floor(Math.random() * 2000)));

  // extract inner html from Notions page content element 
  const html = await page.$eval(".notion-page-content", (el) => el.innerHTML); //!!! This is not robust - class name can change!
  const text = htmlToText(html, {
    wordwrap: false,
    selectors: [
      { selector: "a", options: { ignoreHref: true } },
      { selector: "img", format: "skip" },
    ],
  });

  await browser.close();
  return text;
};
export default getTextFromNotion;

// Test
// const notionnotionUrl =
//   "https://www.notion.so/Teorihandbok-del-1-Avancerad-NET-1b6a11b2b40c80f1b91cf2313cf34c11";

// getTextFromNotion(notionnotionUrl)
//   .then((text) => {
//     console.log(text);
//   })
//   .catch((err) => {
//     console.error("Failed to extract Notion text:", err);
//   });

