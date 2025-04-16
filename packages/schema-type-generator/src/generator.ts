import fs from "fs";
import path from "path";
import { Project } from "ts-morph";
import { extractCustomMetadata } from "./extraction.js";

/**
 * Generate a JSON schema for the given TypeScript interface.
 * This function will:
 *
 * 1. Parse the source file with ts-morph to extract custom JSDoc annotations.
 * 2. Generate the schema using ts-json-schema-generator.
 * 3. Merge the custom metadata into the generated schema.
 *
 * @param inputPath Absolute or relative path to the TypeScript file containing the interface.
 * @param interfaceName Name of the interface to generate the schema for.
 */
export async function generateSchema(
    inputPath: string,
    interfaceName: string = "Input"
): Promise<any> {
    if (!fs.existsSync(inputPath)) {
        throw new Error(`Input file does not exist: ${inputPath}`);
    }

    // Parse the source file to extract metadata.
    const project = new Project({
        tsConfigFilePath: path.join(process.cwd(), "tsconfig.json")
    });
    const sourceFile = project.addSourceFileAtPath(inputPath);
    const interfaceDeclaration = sourceFile.getInterfaceOrThrow(interfaceName);
    const customMetadata = extractCustomMetadata(interfaceDeclaration);

    try {
        const tsjModule = await import("ts-json-schema-generator");

        const config = {
            path: inputPath,
            tsconfig: path.join(process.cwd(), "tsconfig.json"),
            type: interfaceName,
            skipTypeCheck: false,
        };

        console.log("Generating schema using ts-json-schema-generator...");
        const generatedSchema = tsjModule.createGenerator(config).createSchema(config.type);
        let schema = generatedSchema.definitions?.[interfaceName];

        if (schema && typeof schema === 'object') {
            // Use type assertion to allow custom properties
            (schema as any).schemaVersion = 1;
            schema.additionalProperties = undefined;
            console.log(schema);

            // Merge the custom metadata into the generated schema.
            if (schema.properties) {
                for (const propName in customMetadata) {
                    if (schema.properties[propName]) {
                        Object.assign(schema.properties[propName], customMetadata[propName]);
                    }
                }
            } else {
                console.warn("Warning: Generated schema does not contain a 'properties' field.");
            }
        } else {
            console.warn("Warning: Schema not found in definitions or is not an object.");
            // Create a minimal schema if none was found
            schema = {
                type: "object",
                properties: {},
                schemaVersion: 1
            } as any;
        }

        return schema;
    } catch (error) {
        const errorMessage = error instanceof Error
            ? error.message
            : String(error);
        throw new Error(`Failed to generate schema: ${errorMessage}`);
    }
}

/**
 * Write the generated schema to the specified output file.
 * @param schema The schema object to write.
 * @param outputPath File path where the schema should be saved.
 */
export function writeSchemaToFile(schema: any, outputPath: string): void {
    const json = JSON.stringify(schema, null, 4);
    fs.writeFileSync(outputPath, json, "utf8");
    console.log(`Schema written to: ${outputPath}`);
}
