import { generateActorCaller } from "@actor-types/generator";
import { ApifyClient } from "apify-client";
import { program } from "commander";
import { mkdir, writeFile } from "fs/promises";
import { dirname } from "path";

/**
 * Converts a kebab-case string to camelCase
 */
const kebabToCamelCase = (str: string): string => {
	// First convert to lowercase and then transform
	return str.toLowerCase().replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
};

const client = new ApifyClient();

program
	.name("fetch-actor")
	.description("CLI to fetch actor schemas from Apify and generate TypeScript types and wrapper functions")
	.version("1.0.4");

program
	.command("generate")
	.description("Generate types for an actor")
	.argument("<actor-id>", 'Actor ID (e.g. "john-doe/my-actor")')
	.argument("<output>", 'Output file path (e.g. "src/types/myActor.ts")')
	.action(async (actorId, output) => {
		try {
			console.log(`Fetching actor ${actorId}...`);

			// Fetch actor information
			const actorInfo = await client.actor(actorId).get();
			if (!actorInfo) {
				console.error("Actor not found");
				process.exit(1);
			}

			const { name: actorName } = actorInfo;
			if (!actorName) {
				console.error("Actor name not found");
				process.exit(1);
			}

			console.log(`Found actor: ${actorName}`);
			const camelCaseActorName = kebabToCamelCase(actorName);
			console.log(`Transformed name: ${camelCaseActorName}`);

			// Get the default build and its input schema
			const { defaultRunOptions, taggedBuilds } = actorInfo;
			const defaultBuildTag = defaultRunOptions?.build;
			const buildObj = taggedBuilds?.[defaultBuildTag || ""];

			if (!buildObj) {
				console.error("No default build found for the actor");
				process.exit(1);
			}

			const { buildId } = buildObj;
			if (!buildId) {
				console.error("Build ID not found");
				process.exit(1);
			}

			const buildInfo = await client.build(buildId).get();
			if (!buildInfo) {
				console.error("Build info not found");
				process.exit(1);
			}

			const inputSchema = buildInfo.actorDefinition?.input;
			if (!inputSchema) {
				console.error("Input schema not found");
				process.exit(1);
			}

			console.log("Successfully fetched input schema");
			console.log("Generating TypeScript code...");

			const generatedCode = await generateActorCaller(JSON.stringify(inputSchema), camelCaseActorName, actorId);

			// Ensure the output directory exists
			const outputDir = dirname(output);
			await mkdir(outputDir, { recursive: true });

			await writeFile(output, generatedCode);
			console.log(`Successfully generated types for ${camelCaseActorName} at ${output}`);
		} catch (error) {
			console.error("Error:", error);
			process.exit(1);
		}
	});

program.parse();
