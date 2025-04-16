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
| Smart Reminders and Analytics**    | - Users want tools to predict task completion** and suggest improvements.                                                | ✅ Integrate smart notifications** and data-driven insights** to support better decision making.                                          |
| Complexity of Existing Tools**     | - Some users stopped using task managers due to feature overload** and a high learning curve**.                        | ✅ Offer simple and advanced modes** to accommodate users with different needs and experience levels.                                        |

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

1. Mobile App Integration
2. Voice-based Task Input
3. Team Collaboration Features
4. Calendar View
   
## Contributors

Haoran Xu - xu.haoran2@northeastern.edu

Xingtong Zhang - zhang.xintong@northeastern.edu

Min Sun - sun.min1@northeastern.edu

Suchita Sharma - sharma.such@northeastern.edu



