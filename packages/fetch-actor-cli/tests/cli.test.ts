import { describe, it, expect, vi, beforeEach } from 'vitest';
import { join } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { existsSync } from 'fs';

// Mock the dependencies
vi.mock('commander', () => {
    const mockProgram = {
        name: vi.fn().mockReturnThis(),
        description: vi.fn().mockReturnThis(),
        version: vi.fn().mockReturnThis(),
        command: vi.fn().mockReturnThis(),
        requiredOption: vi.fn().mockReturnThis(),
        action: vi.fn().mockReturnThis(),
        parse: vi.fn().mockReturnThis(),
    };
    return { program: mockProgram };
});

vi.mock('apify-client', () => {
    return {
        ApifyClient: vi.fn().mockImplementation(() => ({
            actor: vi.fn().mockImplementation(() => ({
                get: vi.fn().mockResolvedValue({
                    defaultRunOptions: {
                        build: {
                            inputSchema: {
                                type: 'object',
                                properties: {
                                    test: { type: 'string' }
                                }
                            }
                        }
                    }
                })
            }))
        }))
    };
});

vi.mock('@actor-types/generator', () => {
    return {
        generateActorCaller: vi.fn().mockResolvedValue('// Generated code')
    };
});

vi.mock('fs/promises', () => {
    return {
        writeFile: vi.fn().mockResolvedValue(undefined),
        mkdir: vi.fn().mockResolvedValue(undefined)
    };
});

// Don't actually run the CLI when importing it for tests
vi.mock('../src/cli', () => {
    return {};
});

describe('fetch-actor-cli', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should exist as a module', () => {
        const cliPath = join(__dirname, '../src/cli.ts');
        expect(existsSync(cliPath)).toBe(true);
    });
});
