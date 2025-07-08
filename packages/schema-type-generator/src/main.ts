// build-schema.ts
import path from "path";
import { generateSchema, writeSchemaToFile } from "./generator.js";

async function main(): Promise<any> {
	try {
		const inputPath = path.join(process.cwd(), "src/schema.ts");
		const outputPath = path.join(process.cwd(), "./input_schema.json");

		const schema = await generateSchema(inputPath, "IMember");
		writeSchemaToFile(schema, outputPath);
		console.log(`Schema successfully generated and saved to ${outputPath}`);
		return schema;
	} catch (error) {
		console.error("Error generating schema:", error);
		process.exit(1);
	}
}

// Only call main when this file is executed directly
if (import.meta.url === import.meta.resolve("./main.js")) {
	main();
}

export { main };
