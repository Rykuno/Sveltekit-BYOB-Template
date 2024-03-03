import type { Hono } from 'hono';

export interface Controller {
	routes(): Hono<any, any>;
}
