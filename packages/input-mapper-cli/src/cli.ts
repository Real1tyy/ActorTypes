#!/usr/bin/env node
import { program } from 'commander';
import { generateInputType } from '@actor-types/generator';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';

program
    .name('generate-input')
    .description('Generate input types from local schema')
    .version('1.0.1');

program
    .command('generate')
    .description('Generate input types from schema')
    .option('-s, --schema <path>', 'Path to the input schema file', join(process.cwd(), '.actor', 'INPUT_SCHEMA.json'))
    .option('-o, --output <path>', 'Path to output the generated type file', join(process.cwd(), 'src', 'typedef', 'input.ts'))
    .action(async (options) => {
        try {
            const schemaPath = options.schema;
            const outputPath = options.output;

            console.log(`Looking for schema at ${schemaPath}`);
            let schemaContent;
            try {
                schemaContent = await readFile(schemaPath, 'utf-8');
                console.log('Schema found!');
            } catch (error) {
                console.error(`Could not find schema file at ${schemaPath}`);
                process.exit(1);
            }

            console.log('Generating TypeScript type...');
            const generatedType = await generateInputType(schemaContent);

            // Ensure the output directory exists
            const outputDir = dirname(outputPath);
            console.log(`Creating output directory: ${outputDir}`);
            await mkdir(outputDir, { recursive: true });

            console.log(`Writing type definition to ${outputPath}`);
            await writeFile(outputPath, generatedType);
            console.log(`Successfully generated input types at ${outputPath}`);
        } catch (error) {
            console.error('Error:', error);
            process.exit(1);
        }
    });

program.parse();
