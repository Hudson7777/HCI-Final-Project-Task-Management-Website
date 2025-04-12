export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end("Only POST allowed");
  }

  const tasks = req.body.tasks;

  if (!Array.isArray(tasks) || tasks.length === 0) {
    return res.status(400).json({ error: "Task list is empty or invalid." });
  }

  // get current date
  const today = new Date().toISOString().split("T")[0]; // eg: "2025-04-12"

  const prompt = `
You are an intelligent task prioritization assistant.

Today is ${today}.
You will be given a list of tasks in JSON format. Each task contains:
- title
- deadline (ISO 8601 string)
- type
- importance ("low", "normal", "high")
- difficulty ("easy", "medium", "hard")
- description
- progress (0-100, percent completed)

Your job is to:
1. For each task, calculate a priority score using this formula:

priority_score =
  (10 / (days_until_deadline + 1)) +
  importance_score × 3 +
  difficulty_score × 1 +
  (100 - progress) / 20

Where:
- days_until_deadline = max(0, deadline - today) in days
- importance_score: "low"=1, "normal"=2, "high"=3
- difficulty_score: "easy"=1, "medium"=2, "hard"=3

2. Sort the tasks by descending priority_score.

⚠️ STRICT RULES:
- Output ONLY the JSON array of tasks.
- DO NOT include any intro, explanation, or comments.
- DO NOT change any task fields or data.
- DO NOT include priority scores in the output.

Input tasks:
${JSON.stringify(tasks)}

Return the sorted array below:
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

    // get JSON array
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

    // check whether output is valid
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
