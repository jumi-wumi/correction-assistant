export const assistant = async({
  assignment,
  notionUrl,
  prompt
}) => {
    try {
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

        const notionData = await notionResp.json();

        if (!notionData.success) {
          throw new Error(notionData.error);
        }
        textDescription = notionData.text;
      }

      const response = await fetch("http://localhost:3000/correct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt,
          description: textDescription,
          assignment,
        }),
      });

      const data = await response.json();
      console.log("Response:", data);
     return data.output[0]?.content[0]?.text;
    } catch (error) {
      console.error(error);
    } 
  };

