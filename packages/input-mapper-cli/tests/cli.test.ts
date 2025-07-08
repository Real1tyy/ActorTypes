import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import { join } from "path";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock the dependencies
vi.mock("commander", () => {
	const mockProgram = {
		name: vi.fn().mockReturnThis(),
		description: vi.fn().mockReturnThis(),
		version: vi.fn().mockReturnThis(),
		command: vi.fn().mockReturnThis(),
		action: vi.fn().mockReturnThis(),
		parse: vi.fn().mockReturnThis(),
	};
	return { program: mockProgram };
});

vi.mock("@actor-types/generator", () => {
	return {
		generateInputType: vi.fn().mockResolvedValue("// Generated type"),
	};
});

vi.mock("fs/promises", () => {
	return {
		readFile: vi.fn().mockResolvedValue('{"type":"object","properties":{"test":{"type":"string"}}}'),
		writeFile: vi.fn().mockResolvedValue(undefined),
		mkdir: vi.fn().mockResolvedValue(undefined),
	};
});

// Don't actually run the CLI when importing it for tests
vi.mock("../src/cli", () => {
	return {};
});

describe("input-mapper-cli", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("should exist as a module", () => {
		const cliPath = join(__dirname, "../src/cli.ts");
		expect(existsSync(cliPath)).toBe(true);
	});
});
