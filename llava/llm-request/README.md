# LLM Request

A TypeScript utility for making streaming requests to LLaVA, an open-source Large Language Model with visual capabilities. This utility provides a clean, modular interface for sending prompts and processing streaming responses.

## Features

- Makes API requests to LLaVA endpoints
- Handles streaming responses with proper chunking
- Self-signed certificate handling
- Clean TypeScript class-based architecture
- ESM module support

## Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager

## Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd llm-request
npm install
```

## Project Structure

```
llm-request/
├── src/
│   ├── index.ts            # Main application entry point
│   └── llava/
│       ├── index.ts        # Barrel file for easier imports
│       └── LlavaService.ts # Service class for Llava API
├── package.json
├── tsconfig.json
└── .gitignore
```

## Usage

### Building the Project

```bash
npm run build
```

This will compile TypeScript files into JavaScript in the `dist` directory.

### Running the Project

```bash
npm start
```

By default, the application sends a predefined prompt to the LLaVA API and displays the response.

### Clean Build

To perform a clean rebuild of the project:

```bash
npm run rebuild
```

This will remove the `dist` and `node_modules` directories, reinstall dependencies, and rebuild the project.

## Customizing

To change the prompt or API endpoint, modify the appropriate values in `src/index.ts` or `src/llava/LlavaService.ts`.

### Example:

```typescript
// src/index.ts
const prompt = 'What is the meaning of life?';
```

```typescript
// src/llava/LlavaService.ts
constructor(baseUrl: string = 'https://your-api-endpoint.com') {
  // ...
}
```

## Security Notes

This utility includes code to bypass SSL certificate validation for self-signed certificates. This is not recommended for production use. For production environments, use proper SSL certificates.

