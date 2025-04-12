export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Only POST allowed");
  }

  const tasks = req.body.tasks;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({ error: "Task list is empty or invalid." });
  }

  const prompt = `
You are an intelligent scheduling assistant. Given a list of tasks with properties like deadline, importance, and difficulty, reorder them from highest to lowest priority.

Consider the following rules:
- A task with a closer deadline should be prioritized.
- A task with higher importance should come earlier.
- For tasks with similar deadlines and importance, higher difficulty can raise its priority slightly.

Please return a JSON array of tasks in new priority order. Do NOT add explanations or suggestions. Do not change any task content.

Tasks:
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
        messages: [{ role: "user", content: prompt }],
        temperature: 0.3
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
