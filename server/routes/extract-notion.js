import puppeteer from "puppeteer";
import { htmlToText } from "html-to-text";

const getTextFromNotion = async (url) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });

  // wait for content on Notion page to render
  await page.waitForSelector(".notion-page-content", { timeout: 10000 });

  const html = await page.$eval(".notion-page-content", (el) => el.innerHTML);
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

// Test
const notionUrl =
  "https://www.notion.so/Teorihandbok-del-1-Avancerad-NET-1b6a11b2b40c80f1b91cf2313cf34c11";

getTextFromNotion(notionUrl)
  .then((text) => {
    console.log(text);
  })
  .catch((err) => {
    console.error("Failed to extract Notion text:", err);
  });
