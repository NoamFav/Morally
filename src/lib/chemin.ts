/**
 * The site is served under a sub-path on GitHub Pages (/Morally/), so every
 * internal link goes through here. Works in templates and in browser scripts.
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');

export function chemin(p: string): string {
	return p.startsWith('/') ? `${BASE}${p}` : p;
}

/** Current path without the base, for "is this nav item active" checks. */
export function sansBase(p: string): string {
	return BASE && p.startsWith(BASE) ? p.slice(BASE.length) || '/' : p;
}
