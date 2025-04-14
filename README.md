# Actor Types Generator

A monorepo containing tools for generating TypeScript types from Apify actor schemas.

## Packages

### @actor-types/generator

The core package that provides the functionality to generate TypeScript types from JSON schemas and create actor wrapper functions.

### @actor-types/fetch-actor-cli

A CLI tool to fetch actor schemas from Apify and generate TypeScript types and wrapper functions.

### @actor-types/input-mapper-cli

A CLI tool to generate TypeScript types from a local `.actor/INPUT_SCHEMA.json` file.

## Installation

### From NPM

```bash
# Install the fetch-actor CLI globally
npm install -g @actor-types/fetch-actor-cli

# Install the input-mapper CLI globally
npm install -g @actor-types/input-mapper-cli
```

### From Source

```bash
# Clone the repository
git clone <repository-url>
cd actor-types-generator

# Install dependencies and build all packages
npm run setup

# Link packages globally
npm run link-all
```

## Usage

### Fetch Actor CLI

Generate types for an actor by its ID:

```bash
fetch-actor generate -i <actor-id> -n <actor-name> -o <output-path>
```

Example:
```bash
fetch-actor generate -i john-doe/my-actor -n myActor -o src/types/myActor.ts
```

### Input Mapper CLI

Generate types from a local schema file:

```bash
generate-input generate
```

This will look for `.actor/INPUT_SCHEMA.json` in the current directory and generate types in `src/typedef/input.ts`.

## Development

### Setup

```bash
# Install all dependencies
npm install

# Build all packages
npm run build

# Run tests
npm run test
```

### Testing Locally

```bash
# Run the fetch-actor CLI in development mode
npm run start:fetch-cli -- generate -i <actor-id> -n <actor-name> -o <output-path>

# Run the input-mapper CLI in development mode
npm run start:input-cli -- generate
```

### Debugging

If you encounter issues with fetching actor schemas:

1. Make sure the actor ID is correct and accessible
2. The CLI will try multiple methods to find the schema:
   - Direct API call to `/acts/{actorId}/input-schema`
   - Looking in various locations in the actor object

### Workspaces

This is a monorepo managed with npm workspaces. To run commands in a specific package:

```bash
# Run a command in a specific package
npm run <command> --workspace=@actor-types/generator

# Or change directory and run directly
cd packages/generator
npm run <command>
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

MIT
