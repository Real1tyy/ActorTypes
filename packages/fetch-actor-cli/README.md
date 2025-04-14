# @actor-types/fetch-actor-cli

A CLI tool to fetch actor schemas from Apify and generate TypeScript types and wrapper functions.

## Installation

```bash
# Install globally
npm install -g @actor-types/fetch-actor-cli

# Or use npx
npx @actor-types/fetch-actor-cli
```

## Usage

### Generate Types for an Actor

```bash
fetch-actor generate -i <actor-id> -n <actor-name> -o <output-path>
```

#### Options

- `-i, --actor-id <id>`: Actor ID (required)
- `-n, --actor-name <name>`: Actor name (required)
- `-o, --output <path>`: Output file path (required)

#### Example

```bash
# Generate types for an actor
fetch-actor generate -i john-doe/my-actor -n myActor -o src/types/myActor.ts
```

This will:
1. Fetch the input schema for the actor "john-doe/my-actor"
2. Generate a TypeScript interface called "MyActorInput"
3. Generate a wrapper function called "callMyActor"
4. Write the resulting TypeScript code to "src/types/myActor.ts"

## Generated Code Example

```typescript
export interface MyActorInput {
  url: string;
  maxPages?: number;
}

import { Actor, type CallOptions } from 'apify';

/**
 * Calls the actor "myActor" with the provided input.
 * @param input - Must conform to the MyActorInput type.
 * @param runOptions - Optional run options to pass to the actor.
 */
export async function callMyActor(input: MyActorInput, runOptions?: CallOptions): Promise<unknown> {
    return Actor.call('john-doe/my-actor', input, runOptions);
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
