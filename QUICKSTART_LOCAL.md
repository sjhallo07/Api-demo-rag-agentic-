# BITA Quick Start Guide (Local Development)

This guide helps you set up the BITA Financial Intelligence Terminal on your local machine.

## Prerequisites
- Node.js 18.x or higher
- A Google Gemini API Key (get one at [aistudio.google.com](https://aistudio.google.com))

## Setup Instructions

1. **Clone/Download the project** to your local drive.
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Configure Environment Variables**:
   - Create a `.env` file in the root directory.
   - Add your Gemini API Key:
     ```env
     GEMINI_API_KEY="your_actual_api_key_here"
     ```
4. **Start the Development Server**:
   ```bash
   npm run dev
   ```
5. **Open the Application**:
   - Navigate to `http://localhost:3000` in your browser.

## Key Features
- **RAG-Agentic Orchestration**: Uses Gemini to analyze uploaded documents and the investment universe.
- **MCP Servers (Simulated)**: Interactive CLI commands for universe filtering and factor research.
- **Dynamic Portfolio Construction**: Build and backtest strategies in real-time.

## Troubleshooting
- **API Errors**: Ensure your `GEMINI_API_KEY` is correct. Check the terminal logs for specific backend errors.
- **Port Conflicts**: BITA defaults to port 3000. Ensure no other process is using it.
