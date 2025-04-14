import { describe, it, expect } from 'vitest';
import { generateActorCaller } from '../src/actorGenerator';

describe('generateActorCaller', () => {
    it('should handle empty schema correctly', async () => {
        const schemaString = JSON.stringify({
            type: 'object',
            properties: {}
        });

        const result = await generateActorCaller(schemaString, 'empty', 'emptyId');

        expect(result).toContain('export interface EmptyInput');
        expect(result).toContain('export async function callEmpty');
    });

    it('should throw error on invalid JSON schema', async () => {
        const invalidSchema = '{invalid: json}';

        await expect(generateActorCaller(invalidSchema, 'broken', 'brokenId'))
            .rejects.toThrow('Invalid JSON schema input.');
    });
});
