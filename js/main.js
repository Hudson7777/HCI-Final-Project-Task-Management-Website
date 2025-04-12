document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.getElementById("task-form");
  const taskContainer = document.getElementById("tasks");
  const optimizeBtn = document.getElementById("optimize");
  const submitBtn = document.getElementById("submit-btn");

  // Set current date as minimum value for deadline input
  const setMinDeadline = () => {
    const deadlineInput = document.getElementById("deadline");
    if (deadlineInput) {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      const minDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
      deadlineInput.min = minDateTime;

      // If no value is set, set the default to tomorrow
      if (!deadlineInput.value) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tYear = tomorrow.getFullYear();
        const tMonth = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const tDay = String(tomorrow.getDate()).padStart(2, '0');
        deadlineInput.value = `${tYear}-${tMonth}-${tDay}T12:00`;
      }
    }
  };

  // Calculate time remaining for a deadline
  const getTimeRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const timeRemaining = deadlineDate - now;

    // Return formatted time remaining
    if (timeRemaining <= 0) {
      return "Overdue!";
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} ${hours} hour${hours !== 1 ? 's' : ''} remaining`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} remaining`;
    } else {
      const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      return `${minutes} minute${minutes !== 1 ? 's' : ''} remaining`;
    }
  };

  // AI suggestion for the task. Returns the suggession to task-details.html. Right now it's a placeholder, need more work later.
  const generateSuggestion = (task) => {
    let suggestion = "Just a place holder for now.";
    return suggestion;
  };

  // ===== TASK FORM HANDLING =====
  if (taskForm) {
    setMinDeadline();

    // Check if editing an existing task
    const urlParams = new URLSearchParams(window.location.search);
    const editTaskId = urlParams.get('edit');

    if (editTaskId !== null) {
      const taskList = JSON.parse(localStorage.getItem("tasks") || "[]");
      const taskToEdit = taskList[editTaskId];

      if (taskToEdit) {
        // Update page title and button text
        document.querySelector("header p").textContent = "Edit Task";
        submitBtn.textContent = "Update Task";

        // Fill form with existing task data
        document.getElementById("task-title").value = taskToEdit.title;
        document.getElementById("deadline").value = taskToEdit.deadline;
        document.getElementById("task-type").value = taskToEdit.type;
        document.getElementById("difficulty").value = taskToEdit.difficulty;
        document.getElementById("importance").value = taskToEdit.importance;
        document.getElementById("description").value = taskToEdit.description || '';
      }
    }

    // Form submission handler
    taskForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form data
      const title = document.getElementById("task-title").value;
      const deadline = document.getElementById("deadline").value;
      const type = document.getElementById("task-type").value;
      const difficulty = document.getElementById("difficulty").value;
      const importance = document.getElementById("importance").value;
      const description = document.getElementById("description").value;

      // Validate required fields
      if (!title || !deadline || !type || !difficulty || !importance) {
        alert("Please fill in all required fields.");
        return;
      }

      // Get current task list
      const taskList = JSON.parse(localStorage.getItem("tasks") || "[]");

      // Create task object
      const newTask = {
        title,
        deadline,
        type,
        difficulty,
        importance,
        description,
        progress: editTaskId !== null && taskList[editTaskId] ? (taskList[editTaskId].progress || 0) : 0
      };

      // Update or add task
      if (editTaskId !== null) {
        const taskIndex = parseInt(editTaskId, 10);
        if (taskIndex >= 0 && taskIndex < taskList.length) {
          taskList[taskIndex] = newTask;
          localStorage.setItem("tasks", JSON.stringify(taskList));
          alert("Task updated successfully!");
        } else {
          alert("Error: Invalid task ID");
          console.error("Invalid task index for update:", taskIndex);
        }
      } else {
        taskList.push(newTask);
        localStorage.setItem("tasks", JSON.stringify(taskList));
        alert("Task added successfully!");
      }
      // Redirect to index page
      window.location.href = "index.html";
    });
  }

  // ===== TASKS LIST DISPLAY =====
  if (taskContainer) {
    const taskList = JSON.parse(localStorage.getItem("tasks") || "[]");

    // Clear and set up the container
    taskContainer.innerHTML = "<h2>Upcoming Tasks</h2>";

    // Display message if no tasks
    if (taskList.length === 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "No tasks yet. Click 'Add New Task' to get started!";
      taskContainer.appendChild(emptyMsg);
    } else {
      // Sort tasks by deadline (nearest first)
      taskList.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

      // Create and append task elements
      taskList.forEach((task, index) => {
        const taskDiv = document.createElement("div");
        taskDiv.className = "task-item";

        // Format deadline
        const deadlineDate = new Date(task.deadline);
        const formattedDate = deadlineDate.toLocaleDateString();
        const formattedTime = deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Get progress value (default to 0)
        const progress = task.progress || 0;

        // Create task HTML
        taskDiv.innerHTML = `
          <a href="task-details.html?id=${index}" class="task-title">${task.title}</a>
          <div>Deadline: ${formattedDate} at ${formattedTime}</div>
          <div>Type: ${task.type} | Importance: ${task.importance} | Difficulty: ${task.difficulty}</div>
          <div>${getTimeRemaining(task.deadline)}</div>
          <div class="progress-bar">
            <div class="progress" style="width: ${progress}%;"></div>
          </div>
          <div>${progress}% completed</div>
        `;

        taskContainer.appendChild(taskDiv);
      });
    }
  }

  // ===== TASK DETAILS PAGE =====
  const taskTitle = document.getElementById("task-title");
  const taskDeadline = document.getElementById("task-deadline");
  const taskType = document.getElementById("task-type");
  const taskDifficulty = document.getElementById("task-difficulty");
  const taskImportance = document.getElementById("task-importance");
  const taskDescription = document.getElementById("task-description");
  const taskProgress = document.getElementById("task-progress");
  const progressText = document.getElementById("progress-text");
  const progressInput = document.getElementById("progress-input");
  const updateProgressBtn = document.getElementById("update-progress");
  const aiSuggestion = document.getElementById("ai-suggestion");
  const editTaskLink = document.getElementById("edit-task-link");
  const deleteTaskBtn = document.getElementById("delete-task");

  // If on task details page
  if (taskTitle && taskDeadline) {
    const urlParams = new URLSearchParams(window.location.search);
    const taskId = urlParams.get('id');

    if (taskId !== null) {
      const taskList = JSON.parse(localStorage.getItem("tasks") || "[]");
      const task = taskList[taskId];

      if (task) {
        // Update page with task details
        taskTitle.textContent = task.title;

        // Format deadline
        const deadlineDate = new Date(task.deadline);
        taskDeadline.textContent = `${deadlineDate.toLocaleDateString()} at ${deadlineDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

        // Update other details
        taskType.textContent = task.type;
        taskDifficulty.textContent = task.difficulty;
        taskImportance.textContent = task.importance;
        taskDescription.textContent = task.description || 'No description provided.';

        // Set progress
        const progress = task.progress || 0;
        taskProgress.style.width = `${progress}%`;
        progressText.textContent = `${progress}% completed`;
        progressInput.value = progress;

        // Update edit link
        editTaskLink.href = `add-task.html?edit=${taskId}`;

        // Generate and display AI suggestion
        aiSuggestion.textContent = generateSuggestion(task);

        // Handle progress update
        if (updateProgressBtn) {
          updateProgressBtn.addEventListener("click", () => {
            const newProgress = parseInt(progressInput.value);

            // Update task progress
            taskList[taskId].progress = newProgress;
            localStorage.setItem("tasks", JSON.stringify(taskList));

            // Update display
            taskProgress.style.width = `${newProgress}%`;
            progressText.textContent = `${newProgress}% completed`;

            alert("Progress updated!");
          });
        }

        // Handle task deletion
        if (deleteTaskBtn) {
          deleteTaskBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to delete this task?")) {
              taskList.splice(taskId, 1);
              localStorage.setItem("tasks", JSON.stringify(taskList));
              window.location.href = "index.html";
            }
          });
        }
      } else {
        // Task not found
        taskTitle.textContent = "Task not found";
        alert("The requested task could not be found.");
        setTimeout(() => {
          window.location.href = "index.html";
        }, 2000);
      }
    }
  }

  // Click the "Optimize with GPT" button and reorder the tasks
  if (optimizeBtn) {
    optimizeBtn.addEventListener("click", async () => {
      const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

      try {
        const response = await fetch("https://hci-final-project-task-management-website.vercel.app/api/optimize-tasks", {
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