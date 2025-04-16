# HCI-Final-Project-Task-Management-Website

A user-friendly task management platform built for our Human-Computer Interaction (HCI) final project. The website helps users manage daily tasks while optimizing schedules using the OpenAI API for smart task recommendations.

## Overview 

This web application provides a user-friendly interface for managing tasks, setting priorities, tracking deadlines, and receiving AI-driven recommendations to optimize productivity. It incorporates principles of HCI to ensure accessibility, usability, and intuitive user interaction.

## Features

1. Add, view, edit, and delete tasks
2. Sort tasks by priority and deadline
3. Track due dates
4. AI-powered task optimization and scheduling
5. Clean interface designed using HCI principles

## Tech Stack

- Frontend: HTML, CSS, JavaScript (React)
- Backend: Node.js
- AI: OpenAI GPT API
   
## Research Insights
| **Insight**                         | **Problem**                                                                                                                | **Solution**                                                                                                                                   |
|-------------------------------------|----------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| Difficulty in Task Prioritization** | - 60% of users struggle to rank tasks manually.  <br> - Most users rely on deadlines and difficulty, but AI could help.    | Introduce AI-based task ranking** incorporating deadlines, complexity, and personal interests.                                            |
| Need for Better Task Visualization** | - Users wanted a clearer way to track progress: <br> → Progress bars <br> → Color-coded categories for organization       | Implement visual task status indicators** to improve usability and progress tracking.                                                     |
| Smart Reminders and Analytics**    | - Users want tools to predict task completion** and suggest improvements.                                                | Integrate smart notifications** and data-driven insights** to support better decision making.                                          |
| Complexity of Existing Tools**     | - Some users stopped using task managers due to feature overload** and a high learning curve**.                        |  Offer simple and advanced modes** to accommodate users with different needs and experience levels.                                        |

---

## HCI Design Principles Applied

- Consistency: Uniform layout & styling
- Shortcuts: Top‑level “Optimize” & “Add” buttons
- Feedback: Real‑time progress bars
- Closure: Clear back flow after actions
- Error Handling: Inline validation messages
- Reversal: “Edit” & “Back” options
- Control: All actions user‑initiated
- Memory: Logical grouping of form fields

## Demo

https://hci-final-project-task-management-website.vercel.app/

**Before Optimization**
<img width="1151" alt="Screenshot 2025-04-16 at 17 21 13" src="https://github.com/user-attachments/assets/a8c2967d-d9ef-4bd7-9de7-2cf7573c714b" />

**After Optimization**
<img width="1157" alt="Screenshot 2025-04-16 at 17 21 30" src="https://github.com/user-attachments/assets/c9ac8312-2d65-4877-9547-7b74680cad8b" />

## Project Structure
<img width="602" alt="Screenshot 2025-04-15 at 08 40 50" src="https://github.com/user-attachments/assets/12de86bc-f635-45de-8dbf-db413653cfe9" />

## Setup Instructions

Clone the Repository
- git clone https://github.com/your-username/HCI-Final-Project-Task-Management-Website.git
- cd HCI-Final-Project-Task-Management-Website

Install Dependencies
- npm install
  
Setup a openAPI key:
- Visit OpenAI API Keys and generate a key.
- Create a .env file in the root directory and add:
  - OPENAI_API_KEY=your_openai_api_key

Run using static server
- python -m http.server 8000     # http://localhost:8000

Run backend AI optimization:
- node optimize-tasks.js

## References

- OpenAI API Documentation
- Nielsen's Usability Heuristics
- React Docs
  
## Future Improvements

1. AI-Powered Prioritization & Optimization: Leverage artificial intelligence to intelligently rank tasks based on urgency, complexity, and user behavior, enabling dynamic and adaptive scheduling.
2. Real-Time Tracking & Visualization: Integrate live progress updates with interactive dashboards and visual progress bars to offer users instant insights into their workflow.
3. Enhanced Customization: Allow users to tailor task attributes, set intelligent reminders, and personalize the interface to align with their unique work style and preferences.
4. Collaborative Workspace: Support team-based task management, enabling shared projects, delegated responsibilities, and real-time collaboration features.
5. Cross-Platform Accessibility: Deliver a unified user experience through synchronized mobile and web applications, ensuring productivity on the go.

## Conclusion

Our project reflects a strong integration of user-centered design principles and classroom concepts, resulting in a task management solution that is both intuitive and functional. By leveraging clean design, consistent navigation, and AI-powered optimization, we created a system that addresses common productivity challenges faced by users. 

The use of personas, usability heuristics, and real-time feedback mechanisms allowed us to continuously refine our design to better meet user needs. Overall, this project has been a valuable opportunity to apply theoretical knowledge in a practical context, reinforcing the importance of thoughtful design and user empathy in building impactful digital experiences.
   
## Contributors

Haoran Xu - xu.haoran2@northeastern.edu

Xingtong Zhang - zhang.xintong@northeastern.edu

Min Sun - sun.min1@northeastern.edu

Suchita Sharma - sharma.such@northeastern.edu



