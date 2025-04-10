document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    const taskContainer = document.getElementById("tasks");
    const optimizeBtn = document.getElementById("optimize");
  
    // New task adding
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
  
        const title = document.getElementById("task-title").value;
        const deadline = document.getElementById("deadline").value;
        const type = document.getElementById("task-type").value;
        const difficulty = document.getElementById("difficulty").value;
        const importance = document.getElementById("importance").value;
        const description = document.getElementById("description").value;
  
        if (!title || !deadline || !type || !difficulty || !importance) {
          alert("Please fill in all required fields.");
          return;
        }
  
        const newTask = {
          title,
          deadline,
          type,
          difficulty,
          importance,
          description
        };
  
        const taskList = JSON.parse(localStorage.getItem("tasks") || "[]");
        taskList.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(taskList));
  
        alert("Task added!");
        form.reset();
      });
    }
  
    // Show the list of tasks
    if (taskContainer) {
      const taskList = JSON.parse(localStorage.getItem("tasks") || "[]");
      taskContainer.innerHTML = "<h2>Upcoming Tasks</h2>";
  
      taskList.forEach(task => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task-item";
        taskDiv.innerHTML = `
          <div class="task-title">${task.title}</div>
          <div>Deadline: ${task.deadline}</div>
          <div>Importance: ${task.importance}, Difficulty: ${task.difficulty}</div>
        `;
        taskContainer.appendChild(taskDiv);
      });
    }
  
    // Click the "Optimize with GPT" button and reorder the tasks
    if (optimizeBtn) {
      optimizeBtn.addEventListener("click", async () => {
        const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  
        try {
          const response = await fetch("https://你的-vercel-url.vercel.app/api/optimize-tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tasks })
          });
  
          const data = await response.json();
          localStorage.setItem("tasks", JSON.stringify(data.tasks));
          alert("Tasks sorted! Refresh the page to see new order.");
        } catch (err) {
          console.error("API error:", err);
          alert("Failed to sort tasks. Check console for details.");
        }
      });
    }
  });
  