# @actor-types/input-mapper-cli

A CLI tool to generate TypeScript types from Apify actor schema files.

## Installation

```bash
# Install globally
npm install -g @actor-types/input-mapper-cli

# Or use npx
npx @actor-types/input-mapper-cli
```

## Usage

### Generate Types from Schema

```bash
# Using default paths
generate-input generate

# Custom schema path
generate-input generate --schema ./path/to/schema.json

# Custom output path
generate-input generate --output ./path/to/output.ts

# Custom schema and output paths
generate-input generate -s ./path/to/schema.json -o ./path/to/output.ts
```

By default, the CLI will:
1. Look for a schema file at `.actor/INPUT_SCHEMA.json` in the current directory
2. Generate a TypeScript interface named `Input`
3. Save the generated type definition to `src/typedefs/input.ts`

### Command Options

| Option     | Alias | Description                            | Default                      |
| ---------- | ----- | -------------------------------------- | ---------------------------- |
| `--schema` | `-s`  | Path to the input schema file          | `./.actor/INPUT_SCHEMA.json` |
| `--output` | `-o`  | Path to output the generated type file | `./src/typedefs/input.ts`     |

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

## License

MIT
