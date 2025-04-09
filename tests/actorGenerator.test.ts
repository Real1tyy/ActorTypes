import { describe, it, expect } from 'vitest';
import { generateActorCaller } from '../src/actorGenerator';

describe('generateActorCaller', () => {
    it('should generate properly named TypeScript types and functions', async () => {
        // Simple schema for testing
        const schemaString = JSON.stringify({
            type: 'object',
            properties: {
                requiredProp: { type: 'string' },
                optionalProp: { type: 'number', default: 42 }
            }
        });

        const actorName = 'test';
        const actorId = 'testId123';

        const result = await generateActorCaller(schemaString, actorName, actorId);

        // Check type name is correctly generated (PascalCase)
        expect(result).toContain('export interface TestInput');

        // Check function name is correctly generated (camelCase with 'call' prefix)
        expect(result).toContain('export async function callTest');

        // Check for proper type references in the function
        expect(result).toContain('(input: TestInput)');
        expect(result).toContain('const defaults: Partial<TestInput>');
        expect(result).toContain('const preparedInput: TestInput');

        // Check actor ID is used correctly
        expect(result).toContain(`Actor.call('${actorId}'`);

        // Check default values are included
        expect(result).toContain('"optionalProp": 42');
    });

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

    it('should properly handle complex schema with multiple properties', async () => {
        const complexSchema = JSON.stringify({
            type: 'object',
            properties: {
                required1: { type: 'string' },
                required2: { type: 'number' },
                optional1: { type: 'boolean', default: true },
                optional2: { type: 'array', items: { type: 'string' }, default: [] },
                optional3: { type: 'object', properties: { key: { type: 'string' } }, default: {} }
            }
        });

        const result = await generateActorCaller(complexSchema, 'complex', 'complexId');

        // Check type name
        expect(result).toContain('export interface ComplexInput');

        // Check function name
        expect(result).toContain('export async function callComplex');

        // Check defaults
        expect(result).toContain('"optional1": true');
        expect(result).toContain('"optional2": []');
        expect(result).toContain('"optional3": {}');
    });

    it('should override the schema title with actorName-based type', async () => {
        // Schema with a title that would normally be used for interface name
        const schemaString = JSON.stringify({
            title: 'GoogleSearchScraperInput',
            type: 'object',
            properties: {
                query: { type: 'string' },
                optional: { type: 'boolean', default: false }
            }
        });

        const actorName = 'googleSearch';
        const actorId = 'googleSearchId';

        const result = await generateActorCaller(schemaString, actorName, actorId);

        // Check that we're using our custom naming instead of the schema title
        expect(result).toContain('export interface GoogleSearchInput');
        expect(result).not.toContain('GoogleSearchScraperInput');

        // Check function references our custom type name
        expect(result).toContain('(input: GoogleSearchInput)');
        expect(result).toContain('const defaults: Partial<GoogleSearchInput>');
        expect(result).toContain('const preparedInput: GoogleSearchInput');
    });
});
