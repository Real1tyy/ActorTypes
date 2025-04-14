import { compile } from 'json-schema-to-typescript';

/**
 * Generates TypeScript type definition from a JSON schema
 * @param schemaString - JSON schema as a string
 * @param typeName - Name of the generated type
 * @returns Generated TypeScript type definition as a string
 */
export async function generateInputType(
    schemaString: string,
    typeName: string = 'Input'
): Promise<string> {
    let schema;
    try {
        schema = JSON.parse(schemaString);
    } catch (err) {
        throw new Error('Invalid JSON schema input.');
    }

    schema.title = typeName;
    return await compile(schema, typeName, { unreachableDefinitions: true });
}

/**
 * Generates a wrapper function that calls an actor
 * @param actorName - Name of the actor
 * @param actorId - The actor identifier
 * @param inputTypeName - Name of the input type
 * @returns Generated TypeScript code for the wrapper function
 */
export function generateActorWrapper(
    actorName: string,
    actorId: string,
    inputTypeName: string
): string {
    const functionName = `call${actorName.charAt(0).toUpperCase() + actorName.slice(1)}`;

    return `
import { Actor, type CallOptions } from 'apify';

/**
 * Calls the actor "${actorName}" with the provided input.
 * @param input - Must conform to the ${inputTypeName} type.
 * @param runOptions - Optional run options to pass to the actor.
 */
export async function ${functionName}(input: ${inputTypeName}, runOptions?: CallOptions): Promise<unknown> {
    return Actor.call('${actorId}', input, runOptions);
}
`;
}

/**
 * Generates both the input type and wrapper function
 * @param schemaString - JSON schema as a string
 * @param actorName - Name of the actor
 * @param actorId - The actor identifier
 * @returns Combined generated TypeScript code
 */
export async function generateActorCaller(
    schemaString: string,
    actorName: string,
    actorId: string
): Promise<string> {
    const typeName = `${actorName.charAt(0).toUpperCase() + actorName.slice(1)}Input`;
    const inputType = await generateInputType(schemaString, typeName);
    const wrapperCode = generateActorWrapper(actorName, actorId, typeName);

    return `${inputType}\n${wrapperCode}`;
}
