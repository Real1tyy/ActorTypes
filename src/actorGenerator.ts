import { compile } from 'json-schema-to-typescript';

/**
 * Generates TypeScript code that includes:
 *  - a generated Input type from the given JSON schema (named [actorName]Input)
 *  - and a function that applies default values to optional properties and calls the actor.
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

    // Override any preexisting required settings.
    schema.required = [];
    if (schema.properties) {
        for (const prop of Object.keys(schema.properties)) {
            if (schema.properties[prop].default === undefined) {
                schema.required.push(prop);
            }
        }
    }

    // Generate the type definition using the new naming pattern
    const inputType = await compile(schema, typeName, { unreachableDefinitions: true });

    // Create a mapping of default values for properties that have them.
    const defaults: { [key: string]: unknown } = {};
    for (const prop of Object.keys(schema.properties)) {
        if (schema.properties[prop].default !== undefined) {
            defaults[prop] = schema.properties[prop].default;
        }
    }

    // Build function name based on the provided actorName.
    // E.g., for actorName "google", this produces "callGoogle".
    const functionName = `call${actorName.charAt(0).toUpperCase() + actorName.slice(1)}`;

    // Generate the caller function that applies defaults and calls the actor.
    const functionCode = `
import { Actor } from 'apify';

/**
 * Calls the actor "${actorName}" after merging default values.
 * @param input - Must conform to the ${typeName} type.
 */
export async function ${functionName}(input: ${typeName}): Promise<unknown> {
    const defaults: Partial<${typeName}> = ${JSON.stringify(defaults, null, 4)};
    // Merge defaults with the provided input (input overrides defaults).
    const preparedInput: ${typeName} = { ...defaults, ...input };
    return Actor.call('${actorId}', preparedInput);
}
`;

    // Combine the generated type and function code.
    return `${inputType}\n${functionCode}`;
}
