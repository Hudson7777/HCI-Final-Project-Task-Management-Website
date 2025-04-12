export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Only POST allowed");
  }

  const tasks = req.body.tasks;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({ error: "Task list is empty or invalid." });
  }

  const prompt = `
You are a task prioritization assistant.

You will be given a list of tasks in JSON format. Each task contains the following fields: title, deadline, type, importance, difficulty, description, and progress.

Your job is to:
1. Reorder the tasks from highest to lowest priority.
2. Priority should be based on:
   - Sooner deadline → higher priority
   - Higher importance → higher priority
   - For tasks with similar deadlines and importance, higher difficulty gets higher priority.

⚠️ IMPORTANT: Do not change any field.
⚠️ Output ONLY a valid JSON array of tasks, with the same fields and structure as the input.
⚠️ Do NOT add any explanation, comment, markdown, or intro. Output pure JSON only.

Input:
${JSON.stringify(tasks)}

Return:
[
  { ...task1... },
  { ...task2... },
  ...
]
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
