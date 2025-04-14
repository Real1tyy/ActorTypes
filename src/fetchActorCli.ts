import * as fs from 'fs';
import { ApifyClient } from 'apify-client';
import { generateActorCaller } from './actorGenerator.js';

function printUsage() {
    console.log('Usage: generateActorCallerFromId <actorId> <outputLocation>');
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length !== 2) {
        printUsage();
        process.exit(1);
    }

    const [actorId, outputLocation] = args;

    try {
        // Initialize the Apify client
        const client = new ApifyClient();

        // Fetch actor information
        const actorInfo = await client.actor(actorId).get();
        if (!actorInfo) {
            console.error('Actor not found');
            process.exit(1);
        }

        const { name: actorName } = actorInfo;
        if (!actorName) {
            console.error('Actor name not found');
            process.exit(1);
        }

        // Get the default build and its input schema
        const { defaultRunOptions, taggedBuilds } = actorInfo;
        const defaultBuildTag = defaultRunOptions?.build;
        const buildObj = taggedBuilds?.[defaultBuildTag || ''];
        if (!buildObj) {
            console.error('No default build found for the actor');
            process.exit(1);
        }

        const { buildId } = buildObj;
        if (!buildId) {
            console.error('Build ID not found');
            process.exit(1);
        }

        const buildInfo = await client.build(buildId).get();
        if (!buildInfo) {
            console.error('Build info not found');
            process.exit(1);
        }

        const inputSchema = buildInfo.actorDefinition?.input;
        if (!inputSchema) {
            console.error('Input schema not found');
            process.exit(1);
        }

        // Generate the content using the existing generator
        const generatedContent = await generateActorCaller(
            JSON.stringify(inputSchema),
            actorName,
            actorId,
        );

        // Write the content to the output file
        fs.writeFileSync(outputLocation, generatedContent, 'utf8');
        console.log(`Generated file at ${outputLocation}`);
    } catch (err) {
        console.error('Error generating actor caller:', err);
        process.exit(1);
    }
}

await main();
