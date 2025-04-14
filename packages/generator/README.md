# @actor-types/generator

Core library for generating TypeScript types and wrappers from Apify actor schemas.

## Installation

```bash
npm install @actor-types/generator
```

## Usage

### Generate Input Type Only

```typescript
import { generateInputType } from '@actor-types/generator';
import { readFile, writeFile } from 'fs/promises';

async function generateType() {
  const schemaString = await readFile('schema.json', 'utf-8');

  // Generate TypeScript interface from schema
  const typeDefinition = await generateInputType(schemaString, 'MyInput');

  await writeFile('MyInput.ts', typeDefinition);
}
```

### Generate Actor Wrapper Function

```typescript
import { generateActorWrapper } from '@actor-types/generator';

function generateWrapper() {
  // Generate a function to call an actor with the specified input type
  const wrapperCode = generateActorWrapper(
    'myActor',           // Actor name
    'john-doe/my-actor', // Actor ID
    'MyActorInput'       // Input type name
  );

  return wrapperCode;
}
```

### Generate Both Type and Wrapper

```typescript
import { generateActorCaller } from '@actor-types/generator';
import { readFile, writeFile } from 'fs/promises';

async function generateAll() {
  const schemaString = await readFile('schema.json', 'utf-8');

  // Generate both the input type and wrapper function
  const code = await generateActorCaller(
    schemaString,
    'myActor',
    'john-doe/my-actor'
  );

  await writeFile('myActor.ts', code);
}
```

## API Reference

### `generateInputType(schemaString, typeName = 'Input'): Promise<string>`

Generates a TypeScript interface from a JSON schema string.

### `generateActorWrapper(actorName, actorId, inputTypeName): string`

Generates a TypeScript function that calls an Apify actor with typed input.

### `generateActorCaller(schemaString, actorName, actorId): Promise<string>`

Combines both functions to generate a complete TypeScript file with both the input type and wrapper function.
