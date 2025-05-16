const getNotionTextFromUrl = async (url) => {
  const response = await fetch(url);
  const html = await response.text();

  // string match method to match against RegExps 
  const match = html.match(
    /<script id="__NEXT_DATA__" type="application\/json">(.+?)<\/script>/
  );

  if (!match || match.length < 2) {
    throw new Error("Failed to find embedded Notion JSON data :(");
  }

  const notionData = JSON.parse(match[1]);

  // Find the nested blocks and recordMap properties, optional chain
  const recordMap = notionData.props?.pageProps?.recordMap;

  if (!recordMap || !recordMap.block) {
    throw new Error("Failed to find data block in Notion JSON :(");
  }

  const blocks = recordMap.block;
  const extractedText = [];

  // get the actual block data from each element with blockId and title if there is 
  for (const blockId in blocks) {
    const block = blocks[blockId].value;
    const title = block?.properties?.title;
    if (title && Array.isArray(title)) {
      // join the parts of title arrays that have multiples
      const text = title.map((t) => t[0].join(""));
      extractedText.push(text);
    }
  }
  return extractedText.join("\n");
};

export default getNotionTextFromUrl;
