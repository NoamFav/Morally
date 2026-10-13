/**
 * Everything the reader does is kept in localStorage under one key.
 * Shape is versioned so we can migrate later without losing notes.
 */

export interface EtatCarte {
	/** Leitner box, 1 (new / missed) to 5 (known for a long time) */
	boite: number;
	/** ISO date (yyyy-mm-dd) from which the card is due again */
	due: string;
	vues: number;
}

export interface EtatNotion {
	lue?: string;
	quiz?: { score: number; total: number; date: string };
	visite?: string;
}

export interface Donnees {
	version: 1;
	notions: Record<string, EtatNotion>;
	cartes: Record<string, EtatCarte>;
	notes: Record<string, { texte: string; maj: string }>;
	derniere?: string;
}

const CLE = 'morally:v1';
const INTERVALLES = [0, 1, 3, 7, 16, 35];

const vide = (): Donnees => ({ version: 1, notions: {}, cartes: {}, notes: {} });

export function charger(): Donnees {
	try {
		const brut = localStorage.getItem(CLE);
		if (!brut) return vide();
		const d = JSON.parse(brut);
		if (d?.version !== 1) return vide();
		return { ...vide(), ...d };
	} catch {
		return vide();
	}
}

export function enregistrer(d: Donnees) {
	try {
		localStorage.setItem(CLE, JSON.stringify(d));
		window.dispatchEvent(new CustomEvent('morally:maj'));
	} catch {
		/* storage full or blocked: the app keeps working for this visit */
	}
}

export function modifier(fn: (d: Donnees) => void) {
	const d = charger();
	fn(d);
	enregistrer(d);
	return d;
}

/** Local calendar date, so a card due "today" flips at the reader's midnight, not UTC's. */
const jour = (t: Date) =>
	`${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;

export const aujourdhui = () => jour(new Date());

function dansJours(n: number) {
	const t = new Date();
	t.setDate(t.getDate() + n);
	return jour(t);
}

/** Leitner step: known → next box, missed → back to box 1, due again today. */
export function noterCarte(id: string, connue: boolean) {
	modifier((d) => {
		const c = d.cartes[id] ?? { boite: 0, due: aujourdhui(), vues: 0 };
		c.boite = connue ? Math.min(5, Math.max(1, c.boite + 1)) : 1;
		c.due = connue ? dansJours(INTERVALLES[c.boite]) : aujourdhui();
		c.vues += 1;
		d.cartes[id] = c;
	});
}

export function estDue(c: EtatCarte | undefined) {
	return !c || c.due <= aujourdhui();
}

export function estMaitrisee(c: EtatCarte | undefined) {
	return !!c && c.boite >= 3;
}

export function exporter(): string {
	return JSON.stringify(charger(), null, 2);
}

export function importer(json: string): boolean {
	try {
		const d = JSON.parse(json);
		if (d?.version !== 1 || typeof d.notions !== 'object') return false;
		enregistrer({ ...vide(), ...d });
		return true;
	} catch {
		return false;
	}
}

export function toutEffacer() {
	enregistrer(vide());
}
