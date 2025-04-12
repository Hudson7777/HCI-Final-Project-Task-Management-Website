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

Return ONLY the JSON array. No explanation, no markdown, no extra text.

Example of correct output:
[
  { "title": "Task A", "deadline": "...", ... },
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

  const rawText = openaiRes.status === 200 ? (await openaiRes.json()).choices[0].message.content : null;

  if (!rawText) {
    return res.status(500).json({ error: "No content returned from GPT." });
  }

  // get the first JSON array
  const jsonStart = rawText.indexOf('[');
  const jsonEnd = rawText.lastIndexOf(']');
  if (jsonStart === -1 || jsonEnd === -1) {
    throw new Error("Could not find JSON array in GPT response.");
  }

  const jsonText = rawText.slice(jsonStart, jsonEnd + 1);
  let sorted;

  try {
    sorted = JSON.parse(jsonText);
  } catch (e) {
    throw new Error("GPT response could not be parsed into JSON.");
  }

  // check whether the output format is correct
  if (
    !Array.isArray(sorted) ||
    !sorted[0] ||
    typeof sorted[0] !== 'object' ||
    !sorted[0].title ||
    !sorted[0].deadline
  ) {
    throw new Error("GPT response is not a valid task list.");
  }

  res.status(200).json({ tasks: sorted });
} catch (e) {
  console.error("Error from OpenAI:", e);
  res.status(500).json({ error: e.message });
}
}
