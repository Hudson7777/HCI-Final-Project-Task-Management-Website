function getImportanceValue(level) {
  switch (level) {
    case "low": return 1;
    case "normal": return 2;
    case "high": return 3;
    default: return 2;
  }
}

function getDifficultyValue(level) {
  switch (level) {
    case "easy": return 1;
    case "medium": return 2;
    case "hard": return 3;
    default: return 2;
  }
}

function scoreTask(task) {
  const today = new Date();
  const deadline = new Date(task.deadline);
  const daysUntilDeadline = Math.max(0, Math.floor((deadline - today) / (1000 * 60 * 60 * 24)));

  const importanceScore = getImportanceValue(task.importance);
  const difficultyScore = getDifficultyValue(task.difficulty);
  const progressScore = (100 - (parseInt(task.progress) || 0)) / 20;

  const score = (10 / (daysUntilDeadline + 1)) + (importanceScore * 3) + (difficultyScore) + progressScore;
  return score;
}

// Get task icon based on type
function getTaskIcon(type) {
  switch (type) {
    case "study":
      return '<i class="fas fa-book"></i>';
    case "work":
      return '<i class="fas fa-briefcase"></i>';
    case "personal":
      return '<i class="fas fa-user"></i>';
    default:
      return '<i class="fas fa-tasks"></i>';
  }
}

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
        submitBtn.innerHTML = '<i class="fas fa-save"></i> Update Task';

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
      // Create and append task elements
      taskList.forEach((task, index) => {
        const taskDiv = document.createElement("div");
        taskDiv.className = `task-item type-${task.type}`;

        // Format deadline
        const deadlineDate = new Date(task.deadline);
        const year = deadlineDate.getFullYear();
        const month = String(deadlineDate.getMonth() + 1).padStart(2, '0');
        const day = String(deadlineDate.getDate()).padStart(2, '0');
        const hours = deadlineDate.getHours();
        const minutes = String(deadlineDate.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = String(hours % 12 || 12); // Convert 0 to 12 for 12 AM

        const formattedDate = `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;

        // Get progress value (default to 0)
        const progress = task.progress || 0;

        // Create task HTML with icon
        taskDiv.innerHTML = `
          <div class="task-icon">
            ${getTaskIcon(task.type)}
          </div>
          <div class="task-content">
            <a href="task-details.html?id=${index}" class="task-title">${task.title}</a>
            <div class="task-details">
              <span class="task-type-label ${task.type}-label">${task.type}</span>
              <span><i class="far fa-clock"></i> Deadline: ${formattedDate}</span>
            </div>
            <div class="task-details">
              <span><i class="fas fa-chart-bar"></i> Difficulty: ${task.difficulty}</span> | 
              <span><i class="fas fa-exclamation-circle"></i> Importance: ${task.importance}</span>
            </div>
            <div class="progress-bar">
              <div class="progress" style="width: ${progress}%;"></div>
            </div>
            <div class="progress-text">${progress}% completed</div>
          </div>
          <div class="task-meta">
            ${getTimeRemaining(task.deadline)}
          </div>
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
        const year = deadlineDate.getFullYear();
        const month = String(deadlineDate.getMonth() + 1).padStart(2, '0');
        const day = String(deadlineDate.getDate()).padStart(2, '0');
        const hours = deadlineDate.getHours();
        const minutes = String(deadlineDate.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = String(hours % 12 || 12); // Convert 0 to 12 for 12 AM

        const formattedDeadline = `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;

        // Update deadline display
        taskDeadline.textContent = formattedDeadline;

        // Update other details
        taskType.textContent = task.type;
        taskDifficulty.textContent = task.difficulty;
        taskImportance.textContent = task.importance;
        taskDescription.textContent = task.description || 'No description provided.';

        // Color the progress bar according to task type
        if (taskProgress) {
          taskProgress.className = `progress ${task.type}-color`;
        }

        // Update edit link
        editTaskLink.href = `add-task.html?edit=${taskId}`;

        // Generate and display AI suggestion
        aiSuggestion.textContent = generateSuggestion(task);

        // Handle draggable progress bar
        const progressBar = document.getElementById("draggable-progress-bar");
        if (progressBar && updateProgressBtn) {
          // Set initial progress
          const progress = task.progress || 0;
          taskProgress.style.width = `${progress}%`;
          progressText.textContent = `${progress}% completed`;
          
          let isDragging = false;
          let currentProgress = progress;
          
          // Function to update progress display
          const updateProgressDisplay = (event) => {
            // Calculate percentage based on mouse position
            const rect = progressBar.getBoundingClientRect();
            let x = event.clientX - rect.left;
            let percentage = Math.round((x / rect.width) * 100);
            
            // Clamp percentage between 0 and 100
            percentage = Math.max(0, Math.min(100, percentage));
            
            // Update the progress bar and text
            taskProgress.style.width = `${percentage}%`;
            progressText.textContent = `${percentage}% completed`;
            
            // Store the current progress value
            currentProgress = percentage;
          };
          
          // Mouse down event (start dragging)
          progressBar.addEventListener("mousedown", (event) => {
            isDragging = true;
            updateProgressDisplay(event);
          });
          
          // Mouse move event (update while dragging)
          document.addEventListener("mousemove", (event) => {
            if (isDragging) {
              updateProgressDisplay(event);
            }
          });
          
          // Mouse up event (stop dragging)
          document.addEventListener("mouseup", () => {
            isDragging = false;
          });
          
          // Click event for immediate updates
          progressBar.addEventListener("click", (event) => {
            updateProgressDisplay(event);
          });
          
          // Handle save button
          updateProgressBtn.addEventListener("click", () => {
            // Update task progress in localStorage
            taskList[taskId].progress = currentProgress;
            localStorage.setItem("tasks", JSON.stringify(taskList));
            
            alert("Progress updated!");
          });
        }

        // Handle task deletion
        if (deleteTaskBtn) {
          deleteTaskBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to delete this task?")) {
              // Get latest task list from localStorage to ensure we have current data
              const currentTaskList = JSON.parse(localStorage.getItem("tasks") || "[]");
              
              // Convert taskId to a number to ensure proper array indexing
              const taskIndex = parseInt(taskId, 10);
              
              // Make sure the index is valid
              if (taskIndex >= 0 && taskIndex < currentTaskList.length) {
                // Remove the task at the specified index
                currentTaskList.splice(taskIndex, 1);
                
                // Save the updated list back to localStorage
                localStorage.setItem("tasks", JSON.stringify(currentTaskList));
                
                console.log("Task deleted. Remaining tasks:", currentTaskList.length);
                
                // Redirect back to the main page
                window.location.href = "index.html";
              } else {
                // Handle invalid index
                alert("Error: Task not found!");
                console.error("Invalid task index:", taskIndex, "List length:", currentTaskList.length);
                window.location.href = "index.html";
              }
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

  // Click the "" button and reorder the tasks
  if (optimizeBtn) {
    optimizeBtn.addEventListener("click", async () => {
      const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      let loadingIndicator = document.getElementById("loading-indicator");
      let statusMessage = document.getElementById("status-message");

      if (!loadingIndicator) {
        loadingIndicator = document.createElement("div");
        loadingIndicator.id = "loading-indicator";
        loadingIndicator.style.color = "#666";
        loadingIndicator.style.marginTop = "10px";
        taskContainer.parentElement.insertBefore(loadingIndicator, taskContainer);
      }

      if (!statusMessage) {
        statusMessage = document.createElement("div");
        statusMessage.id = "status-message";
        statusMessage.style.display = "none";
        statusMessage.style.marginTop = "10px";
        statusMessage.style.padding = "10px";
        statusMessage.style.borderRadius = "5px";
        statusMessage.style.fontWeight = "bold";
        taskContainer.parentElement.insertBefore(statusMessage, taskContainer);
      }

      // ✅ start of the request
      loadingIndicator.innerHTML = `🔄 Optimizing tasks with GPT... <span class="dot-flash">...</span>`;
      loadingIndicator.style.display = "block";
      statusMessage.style.display = "none";

      // ✅disable the optimize button in case errors
      optimizeBtn.disabled = true;
      optimizeBtn.style.opacity = 0.6;
      optimizeBtn.style.cursor = "not-allowed";
      try {
        const response = await fetch("https://hci-final-project-task-management-website.vercel.app/api/optimize-tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tasks })
        });
  
        const data = await response.json();
        console.log("Return output from GPT", data.tasks);
  
        // check if valid
        if (
          Array.isArray(data.tasks) &&
          data.tasks.length > 0 &&
          data.tasks.every(task => task.title && task.deadline)
        ) {
          // sort the tasks based on scores(replaced from GPT)
          const sorted = data.tasks.sort((a, b) => scoreTask(b) - scoreTask(a));

          // modify the refresh logic, to get a more elegant UI effect
          localStorage.setItem("tasks", JSON.stringify(sorted));
            if (taskContainer) {
              taskContainer.innerHTML = "<h2>Upcoming Tasks</h2>";
            
              sorted.forEach((task, index) => {
                const taskDiv = document.createElement("div");
                taskDiv.className = `task-item type-${task.type}`;
              
                const deadlineDate = new Date(task.deadline);
                const year = deadlineDate.getFullYear();
                const month = String(deadlineDate.getMonth() + 1).padStart(2, '0');
                const day = String(deadlineDate.getDate()).padStart(2, '0');
                const hours = deadlineDate.getHours();
                const minutes = String(deadlineDate.getMinutes()).padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const formattedHours = String(hours % 12 || 12);
                const formattedDate = `${year}-${month}-${day} ${formattedHours}:${minutes} ${ampm}`;
                const progress = task.progress || 0;
              
                const iconHTML = getTaskIcon(task.type);
              
                taskDiv.innerHTML = `
                  <div class="task-icon">${iconHTML}</div>
                  <div class="task-content">
                    <a href="task-details.html?id=${index}" class="task-title">${task.title}</a>
                    <div class="task-details">
                      <span class="task-type-label ${task.type}-label">${task.type}</span>
                      <span><i class="far fa-clock"></i> Deadline: ${formattedDate}</span>
                    </div>
                    <div class="task-details">
                      <span><i class="fas fa-chart-bar"></i> Difficulty: ${task.difficulty}</span> | 
                      <span><i class="fas fa-exclamation-circle"></i> Importance: ${task.importance}</span>
                    </div>
                    <div class="progress-bar">
                      <div class="progress" style="width: ${progress}%;"></div>
                    </div>
                    <div class="progress-text">${progress}% completed</div>
                  </div>
                  <div class="task-meta">${getTimeRemaining(task.deadline)}</div>
                `;
              
                taskContainer.appendChild(taskDiv);
              });
              
            
              // ✅ change the location of progress bar
              loadingIndicator.style.display = "none";
              statusMessage.textContent = "✅ Tasks sorted by GPT!";
              statusMessage.style.backgroundColor = "#d4edda";
              statusMessage.style.color = "#155724";
              statusMessage.style.border = "1px solid #c3e6cb";
              statusMessage.style.display = "block";

              optimizeBtn.disabled = false;
              optimizeBtn.style.opacity = 1;
              optimizeBtn.style.cursor = "pointer";
            
              // taskContainer.parentElement.insertBefore(statusMessage, taskContainer);
            }
        } else {
          alert("⚠️ AI returned invalid task data. Sorting skipped.");
          console.error("Invalid GPT response:", data);
          optimizeBtn.disabled = false;
          optimizeBtn.style.opacity = 1;
          optimizeBtn.style.cursor = "pointer";
        }
  
      } catch (err) {
        console.error("API error:", err);
        loadingIndicator.style.display = "none";
        statusMessage.textContent = "❌ Failed to contact GPT.";
        statusMessage.style.backgroundColor = "#f8d7da";
        statusMessage.style.color = "#721c24";
        statusMessage.style.border = "1px solid #f5c6cb";
        statusMessage.style.display = "block";

        optimizeBtn.disabled = false;
        optimizeBtn.style.opacity = 1;
        optimizeBtn.style.cursor = "pointer";
      }
    });
  }
});