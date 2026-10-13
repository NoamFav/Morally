import { getCollection, type CollectionEntry } from 'astro:content';
import { typo } from './typo.mjs';

export type Notion = CollectionEntry<'notions'>;
export type ParcoursId = Notion['data']['parcours'];

export const PARCOURS: { id: ParcoursId; titre: string; livre: number; resume: string }[] = [
	{
		id: 'sujet',
		livre: 1,
		titre: 'Le sujet',
		resume: 'Ce que je suis, ce que je sais de moi, ce que je peux.',
	},
	{
		id: 'culture',
		livre: 2,
		titre: 'La culture',
		resume: 'Ce que l’humanité ajoute à la nature : parler, créer, produire, croire.',
	},
	{
		id: 'connaissance',
		livre: 3,
		titre: 'La connaissance',
		resume: 'Comment l’esprit atteint le vrai, et ce qui lui résiste.',
	},
	{
		id: 'morale-politique',
		livre: 4,
		titre: 'La morale et la politique',
		resume: 'Bien vivre, bien agir, et vivre ensemble.',
	},
];

export const parcoursDe = (id: ParcoursId) => PARCOURS.find((p) => p.id === id)!;

export async function notionsTriees() {
	const all = await getCollection('notions');
	return all.sort((a, b) => a.data.numero - b.data.numero);
}

export function romain(n: number): string {
	const table: [number, string][] = [
		[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
		[50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
	];
	let out = '';
	for (const [v, s] of table) {
		while (n >= v) {
			out += s;
			n -= v;
		}
	}
	return out;
}

/** Stable short id for a flashcard, so saved progress survives reordering. */
export function idCarte(notion: string, recto: string): string {
	let h = 5381;
	for (let i = 0; i < recto.length; i++) h = ((h << 5) + h + recto.charCodeAt(i)) | 0;
	return `${notion}:${(h >>> 0).toString(36)}`;
}

/** Lexicon ids referenced by <Def t="…"> in a lesson body. */
export function termesCites(body: string | undefined): string[] {
	if (!body) return [];
	const ids = new Set<string>();
	for (const m of body.matchAll(/<Def\s+t="([^"]+)"/g)) ids.add(m[1]);
	return [...ids];
}

export const EPOQUES: Record<string, string> = {
	antiquite: 'Antiquité',
	'moyen-age': 'Moyen Âge',
	renaissance: 'Renaissance',
	classique: 'Âge classique',
	lumieres: 'Lumières',
	xixe: 'XIXe siècle',
	xxe: 'XXe siècle',
};

export const TYPES_LECTURE: Record<string, string> = {
	oeuvre: 'Œuvre',
	etude: 'Étude',
	article: 'Article',
	'en-ligne': 'En ligne',
};

/** Apply French typography to every string of a frontmatter object. */
export function typoProfond<T>(v: T): T {
	if (typeof v === 'string') return typo(v) as T;
	if (Array.isArray(v)) return v.map(typoProfond) as T;
	if (v && typeof v === 'object' && !(v instanceof Date)) {
		return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, typoProfond(x)])) as T;
	}
	return v;
}

/** Reading time of a lesson body in minutes (about 200 words per minute, markup stripped). */
export function tempsDeLecture(body: string | undefined): number {
	if (!body) return 1;
	const mots = body.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.round(mots / 200));
}
