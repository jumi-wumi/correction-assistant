// Helper function 
export const assistant = async({
  assignment,
  notionUrl,
}) => {
    try {
      // The text extracted from Notion
      let textDescription = "";

      // if there is Notion url, fetch the text
      if (notionUrl) {
        const notionResp = await fetch("http://localhost:3000/notion-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: notionUrl }),
        });

        if (!notionResp.ok) {
          const text = await notionResp.text();
          throw new Error(`Notion API error: ${text}`);
        }

        // parse the response 
        const notionData = await notionResp.json();

        if (!notionData.success) {
          throw new Error(notionData.error);
        }
        textDescription = notionData.text;
      }

      // send post request to /correct with the extracted text 
      const response = await fetch("http://localhost:3000/correct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: textDescription,
          assignment,
        }),
      });

      // parse response from /correct
      const data = await response.json();
      // log response data for debugging
      console.log("Response:", data);

      // return the corrected text
     return data.output[0]?.content[0]?.text;
    } catch (error) {
      console.error(error);
    } 
  };

