#!/usr/bin/env node
import { program } from 'commander';
import { generateInputType } from '@actor-types/generator';
import { readFile, writeFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';

program
    .name('generate-input')
    .description('Generate input types from local schema')
    .version('1.0.0');

program
    .command('generate')
    .description('Generate input types from .actor/INPUT_SCHEMA.json')
    .action(async () => {
        try {
            const schemaPath = join(process.cwd(), '.actor', 'INPUT_SCHEMA.json');
            const outputPath = join(process.cwd(), 'src', 'typedef', 'input.ts');

            console.log(`Looking for schema at ${schemaPath}`);
            let schemaContent;
            try {
                schemaContent = await readFile(schemaPath, 'utf-8');
                console.log('Schema found!');
            } catch (error) {
                console.error('Could not find .actor/INPUT_SCHEMA.json file');
                process.exit(1);
            }

            console.log('Generating TypeScript type...');
            const generatedType = await generateInputType(schemaContent);

            // Ensure the typedef directory exists
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
