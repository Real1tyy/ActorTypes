import type { PropertySignature, InterfaceDeclaration, JSDoc, JSDocTag } from "ts-morph";

// Extract custom metadata from JSDoc annotations in the interface.
export const extractCustomMetadata = (interfaceDeclaration: InterfaceDeclaration) => {
	const customMetadata: Record<string, any> = {};

	interfaceDeclaration.getProperties().forEach((prop: PropertySignature) => {
		const propName = prop.getName();
		const jsDocs = prop.getJsDocs();
		jsDocs.forEach((doc: JSDoc) => {
			const tags = doc.getTags();
			let meta: Record<string, any> = {};

			tags.forEach((tag: JSDocTag) => {
				const tagName = tag.getTagName();
				const comment = tag.getComment() || "";
				meta[tagName] = comment;
			});
			if (Object.keys(meta).length > 0) {
				customMetadata[propName] = meta;
			}
		});
	});
	return customMetadata;
};
