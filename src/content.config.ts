import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

const notions = defineCollection({
	loader: glob({ pattern: '*.mdx', base: './src/content/notions' }),
	schema: z.object({
		titre: z.string(),
		numero: z.number().int().min(1),
		parcours: z.enum(['sujet', 'culture', 'connaissance', 'morale-politique']),
		question: z.string(),
		accroche: z.string(),
		auteurs: z.array(reference('auteurs')),
		courants: z.array(reference('courants')).default([]),
		liees: z.array(z.string()).default([]),
		essentiel: z.array(z.string()).min(3),
		cartes: z
			.array(z.object({ recto: z.string(), verso: z.string() }))
			.min(6),
		quiz: z
			.array(
				z.object({
					question: z.string(),
					choix: z.array(z.string()).min(2).max(5),
					bonne: z.number().int().min(0),
					explication: z.string(),
				}),
			)
			.min(4),
		sujets: z
			.array(
				z.object({
					intitule: z.string(),
					enjeu: z.string(),
					plan: z.array(z.string()).min(2).max(3),
				}),
			)
			.min(2),
		lectures: z
			.array(
				z.object({
					titre: z.string(),
					auteur: z.string(),
					annee: z.string().optional(),
					type: z.enum(['oeuvre', 'etude', 'article', 'en-ligne']),
					note: z.string(),
					url: z.url().optional(),
				}),
			)
			.min(3),
	}),
});

const auteurs = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/auteurs' }),
	schema: z.object({
		nom: z.string(),
		tri: z.string(),
		dates: z.string(),
		epoque: z.enum(['antiquite', 'moyen-age', 'renaissance', 'classique', 'lumieres', 'xixe', 'xxe']),
		courants: z.array(reference('courants')).default([]),
		resume: z.string(),
		idees: z.array(z.string()).min(2),
		oeuvres: z.array(z.object({ titre: z.string(), annee: z.string() })).min(1),
		citation: z.object({ texte: z.string(), source: z.string() }).optional(),
	}),
});

const courants = defineCollection({
	loader: glob({ pattern: '*.md', base: './src/content/courants' }),
	schema: z.object({
		nom: z.string(),
		periode: z.string(),
		ordre: z.number(),
		resume: z.string(),
		theses: z.array(z.string()).min(2),
	}),
});

const methode = defineCollection({
	loader: glob({ pattern: '*.mdx', base: './src/content/methode' }),
	schema: z.object({
		titre: z.string(),
		ordre: z.number(),
		resume: z.string(),
	}),
});

const lexique = defineCollection({
	loader: file('./src/content/lexique.yaml'),
	schema: z.object({
		terme: z.string(),
		definition: z.string(),
		etymologie: z.string().optional(),
		voir: z.array(z.string()).default([]),
	}),
});

export const collections = { notions, auteurs, courants, methode, lexique };
