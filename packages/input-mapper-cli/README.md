# @actor-types/input-mapper-cli

A CLI tool to generate TypeScript types from local Apify actor schema files.

## Installation

```bash
# Install globally
npm install -g @actor-types/input-mapper-cli

# Or use npx
npx @actor-types/input-mapper-cli
```

## Usage

### Generate Types from Local Schema

```bash
generate-input generate
```

This will:
1. Look for a schema file at `.actor/INPUT_SCHEMA.json` in the current directory
2. Generate a TypeScript interface named `Input`
3. Save the generated type definition to `src/typedef/input.ts`

### Requirements

- The CLI expects to find a valid JSON schema file at `.actor/INPUT_SCHEMA.json`
- If the file is not found, the CLI will exit with an error
- The `src/typedef` directory will be created automatically if it doesn't exist

## Generated Code Example

For a schema like:

```json
{
  "title": "Input",
  "type": "object",
  "schemaVersion": 1,
  "properties": {
    "url": {
      "title": "URL",
      "type": "string",
      "description": "The URL to scrape"
    },
    "maxPages": {
      "title": "Max Pages",
      "type": "integer",
      "description": "Maximum number of pages to scrape"
    }
  },
  "required": ["url"]
}
```

The generated TypeScript will be:

```typescript
export interface Input {
  /**
   * The URL to scrape
   */
  url: string;
  /**
   * Maximum number of pages to scrape
   */
  maxPages?: number;
}
```

## Development

```bash
# Clone the repository
git clone <repo-url>

# Install dependencies
cd actor-types-generator
npm install

# Build the CLI
npm run build

# Run locally
npm run dev
```
