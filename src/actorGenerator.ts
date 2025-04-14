import { compile } from 'json-schema-to-typescript';

/**
 * Generates TypeScript code that includes:
 *  - a generated Input type from the given JSON schema (named [actorName]Input)
 *  - and a function that calls the actor with the provided input.
 *
 * @param inputSchemaString - JSON schema as a string.
 * @param actorName - Used to construct the caller function name and type name.
 * @param actorId - The actor identifier to pass to Actor.call.
 * @returns The generated TypeScript code as a string.
 */
export async function generateActorCaller(
    inputSchemaString: string,
    actorName: string,
    actorId: string,
): Promise<string> {
    let schema;
    try {
        schema = JSON.parse(inputSchemaString);
    } catch (err) {
        throw new Error('Invalid JSON schema input.');
    }

    // Create the type name based on actorName
    const typeName = `${actorName.charAt(0).toUpperCase() + actorName.slice(1)}Input`;

    schema.title = typeName;

    // Generate the type definition using the new naming pattern
    const inputType = await compile(schema, typeName, { unreachableDefinitions: true });

    // Build function name based on the provided actorName.
    // E.g., for actorName "google", this produces "callGoogle".
    const functionName = `call${actorName.charAt(0).toUpperCase() + actorName.slice(1)}`;

    // Generate the caller function that calls the actor.
    const functionCode = `
import { Actor, type CallOptions } from 'apify';

/**
 * Calls the actor "${actorName}" with the provided input.
 * @param input - Must conform to the ${typeName} type.
 * @param runOptions - Optional run options to pass to the actor.
 */
export async function ${functionName}(input: ${typeName}, runOptions?: CallOptions): Promise<unknown> {
    return Actor.call('${actorId}', input, runOptions);
}
`;

    // Combine the generated type and function code.
    return `${inputType}\n${functionCode}`;
}
