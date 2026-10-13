// French typography: glue punctuation to the word it belongs to, so that
// « and » never end up alone at a line break and ; : ? ! never start a line.

const NBSP = ' '; // before « » and :
const NNBSP = ' '; // narrow, before ; ? !

/** @param {string} s */
export function typo(s) {
	return s
		.replace(/« /g, `«${NBSP}`)
		.replace(/ »/g, `${NBSP}»`)
		.replace(/ :/g, `${NBSP}:`)
		.replace(/ ([;?!])/g, `${NNBSP}$1`)
		.replace(/ — /g, `${NBSP}— `);
}

/** Rehype plugin applying typo() to every text node outside code. */
export function rehypeTypo() {
	/** @param {any} node */
	const walk = (node) => {
		if (node.type === 'text') node.value = typo(node.value);
		if (node.tagName === 'code' || node.tagName === 'pre') return;
		node.children?.forEach(walk);
	};
	return walk;
}
