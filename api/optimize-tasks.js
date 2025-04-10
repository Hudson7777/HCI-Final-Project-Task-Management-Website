export default async function handler(req, res) {
    if (req.method !== "POST") {
      return res.status(405).end("Only POST allowed");
    }
  
    const tasks = req.body.tasks;
  
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return res.status(400).json({ error: "Task list is empty or invalid." });
    }
  
    const prompt = `
  Reorder the following tasks from highest to lowest priority based on importance, deadline, and difficulty.
  Output JSON array without explanation:
  ${JSON.stringify(tasks)}
    `;
  
    try {
      const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [{ role: "user", content: prompt }]
        })
      });
  
      const json = await openaiRes.json();
      const sorted = JSON.parse(json.choices[0].message.content);
      res.status(200).json({ tasks: sorted });
  
    } catch (e) {
      console.error("Error from OpenAI:", e);
      res.status(500).json({ error: e.message });
    }
  }
  