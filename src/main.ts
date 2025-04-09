#!/usr/bin/env node

import * as fs from 'fs';
import { generateActorCaller } from './actorGenerator.js';

function printUsage() {
    console.log(
        `Usage: generateActorCaller <inputSchemaFile> <actorName> <actorId> <outputLocation>`,
    );
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length !== 4) {
        printUsage();
        process.exit(1);
    }

    const [inputSchemaFile, actorName, actorId, outputLocation] = args;

    let inputSchemaString: string;
    try {
        inputSchemaString = fs.readFileSync(inputSchemaFile, 'utf8');
    } catch (err) {
        console.error('Error reading input schema file:', err);
        process.exit(1);
    }

    try {
        // Get the generated content from actorGenerator
        const generatedContent = await generateActorCaller(inputSchemaString, actorName, actorId);

        // Write the content to the output file
        fs.writeFileSync(outputLocation, generatedContent, 'utf8');
        console.log(`Generated file at ${outputLocation}`);
    } catch (err) {
        console.error('Error generating actor caller:', err);
        process.exit(1);
    }
}

await main();
