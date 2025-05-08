📍 PlanIt! Venue Recommender Web App

A web app that takes natural language queries (e.g., "fun things to do in Chicago this weekend") and returns smart venue suggestions using OpenAI and the Google Places API.

🚀 Features

🔍 Accepts free-form natural language queries from users

💬 Uses OpenAI to interpret the query and extract intent

📍 Fetches relevant venues using Google Places API

🖼️ Displays venue images and GPT-generated descriptions

🧠 React frontend + Express backend

🛠️ Tech Stack

Frontend: React, CSS

Backend: Express (Node.js)

APIs: OpenAI, Google Places API, Google Places Photos API

Hosting: Local development

📦 Setup Instructions

1. Clone the repo

git clone https://github.com/kendrickgolden/activity-planner.git
cd activity-planner-chatbot

2. Install dependencies

Frontend

cd client
npm install

Backend

cd server
npm install

3. Set up environment variables

Create .env files in both client/ and server/ directories.

server/.env:

OPENAI_API_KEY=your-openai-key
GOOGLE_MAPS_API_KEY=your-google-api-key

client/.env:

4. Run the app locally

Start backend

cd server
npm run dev

Start frontend

cd client
npm start
