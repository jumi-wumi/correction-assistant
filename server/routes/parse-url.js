// this file defines functionality to parse text from live Notion pages based on Notion's class names, using Cheerio library
import * as cheerio from "cheerio"

const getNotionTextFromUrl =  async (url) => {
    // fetch the content from url from input by user
    const response = await fetch(url); 
    // get raw HTML from response 
    const html = await response.text();

    console.log(html); 

    // jQuery-like parsing. Load HTML into Cheerio
    const $ = cheerio.load(html);

    // select all divs with notion's text class. Cheerio should find nested text
    const textBlocksFromClass = $("div.notion-selectable"); 

    const combinedTextBlocks = textBlocksFromClass 
    // map over selected elements, extract and trim text
    .map((i, el) => $(el).text().trim())
    // convert to normal array
    .get()
    // join blocks on new lines
    .join("\n"); 

    return combinedTextBlocks;
};

getNotionTextFromUrl()

export default getNotionTextFromUrl;
