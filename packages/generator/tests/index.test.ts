import { describe, it, expect } from "vitest";
import { generateInputType, generateActorWrapper, generateActorCaller } from "../src";

describe("Generator", () => {
	const testSchema = JSON.stringify({
		type: "object",
		properties: {
			name: { type: "string" },
			age: { type: "number" },
		},
		required: ["name"],
	});

	describe("generateInputType", () => {
		it("should generate a valid TypeScript type", async () => {
			const result = await generateInputType(testSchema, "TestInput");
			expect(result).toContain("export interface TestInput");
			expect(result).toContain("name: string");
			expect(result).toContain("age?: number");
		});

		it("should throw on invalid JSON", async () => {
			await expect(generateInputType("invalid json")).rejects.toThrow("Invalid JSON schema input");
		});
	});

	describe("generateActorWrapper", () => {
		it("should generate a valid wrapper function", () => {
			const result = generateActorWrapper("test", "actor-id", "TestInput");
			expect(result).toContain("export async function callTest");
			expect(result).toContain("input: TestInput");
			expect(result).toContain("Actor.call('actor-id'");
		});
	});

	describe("generateActorCaller", () => {
		it("should generate both type and wrapper", async () => {
			const result = await generateActorCaller(testSchema, "test", "actor-id");
			expect(result).toContain("export interface TestInput");
			expect(result).toContain("export async function callTest");
		});
	});
});
