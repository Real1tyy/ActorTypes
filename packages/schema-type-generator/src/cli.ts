#!/usr/bin/env node
import { program } from "commander";
import fs from "fs";
import path from "path";
import { generateSchema, writeSchemaToFile } from "./generator.js";

program.name("schema-type-generator").description("Generate JSON schema from TypeScript types").version("1.0.0");

program
	.command("generate")
	.description("Generate JSON schema from TypeScript interface")
	.option(
		"-i, --input <path>",
		"Path to the TypeScript file containing the interface",
		path.join(process.cwd(), "src/typedefs/input.ts"),
	)
	.option(
		"-o, --output <path>",
		"Path to output the generated schema",
		path.join(process.cwd(), "actor/input_schema.json"),
	)
	.option("-n, --interface-name <name>", "Name of the interface to generate schema from", "Input")
	.action(async (options) => {
		try {
			const inputPath = options.input;
			const outputPath = options.output;
			const interfaceName = options.interfaceName;

			// Check if input file exists
			if (!fs.existsSync(inputPath)) {
				console.error(`Input file not found at ${inputPath}`);
				process.exit(1);
			}

			// Ensure output directory exists
			const outputDir = path.dirname(outputPath);
			if (!fs.existsSync(outputDir)) {
				fs.mkdirSync(outputDir, { recursive: true });
			}

			console.log(`Generating schema from ${inputPath}`);
			const schema = await generateSchema(inputPath, interfaceName);
			writeSchemaToFile(schema, outputPath);
			console.log(`Schema successfully generated and saved to ${outputPath}`);
		} catch (error) {
			console.error("Error:", error);
			process.exit(1);
		}
	});

program.parse();
