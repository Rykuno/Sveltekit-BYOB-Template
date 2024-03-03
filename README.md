# Sveltekit - Starter BYOB (Bring your own Backend)

Sveltekit is awesome. File-based routing, SSG/SSR, and having the ability to have a backend attatched to your frontend saves incredible amounts of time and effort.

But that backend sometimes isn't enough. There are some projects that require more powerful and feature rich backends. I'm talking Middleware, guards, pipes, interceptors, testing, event-emitters, task scheduling, route versioning, and so on.

People tend to think that Sveltekit/NextJS are a backend with a frontend attached. **This notion is rediculous** and I'm unsure why its circulated so much. The backend for these frameworks are to facilitate the features in which their frontends promote and make them so powerful. 

So whats the answer? 

We want to maintain simplicity, elegancy, and a solid DX. Why not just use what appears to be silenly infered to do from the docs? Create a catch-all route and attatch a fully featured api onto the node-process sveltekit already runs on.

`/api/[...slugs]`
```ts
import app from '$lib/api';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = ({ request }) => app.fetch(request);
export const PUT: RequestHandler = ({ request }) => app.fetch(request);
export const DELETE: RequestHandler = ({ request }) => app.fetch(request);
export const POST: RequestHandler = ({ request }) => app.fetch(request);
```

## Library Selection

My selection of libraries are just what I've found success, **stable**  and high cohesion with. This repo should just serve as a guide as to whats possible; not what libary is the best.

#### Auth
* **[Lucia](https://lucia-auth.com)**: Hits the right level of abstraction for me. Hand me the tools to build a secure authentication system and let me implement it to suite my needs

#### Database
* [Drizzle](https://orm.drizzle.team/) - Drizzle advertises itself as an ORM but I think its deceptive. Its a query builder with a migration client. Everytime I've used an ORM, I find myself fighting it for sometimes the simplist of use cases. Drizzle just gives you type-safety while querying SQL in a native fashion. Learn SQL, not ORMs.

#### Backend
* **[Hono](https://hono.dev/)**: Fast, lightweight, and built on web standards; meaning it can run anywhere you're Sveltekit app can. It's essentially a better, newer, and ironically more stable Express.JS. This provides us an extreemely good foundation to cleanly build ontop of without having to teardown first. It has a zod adapter for validating DTO's which can be shared with the frontend too. 

## Backend Architecture (OOP)

The example boilerplate for the backend follows "Clean Architecture" in an Object Oriented Programming(OOP) manner.

For the majority of apps I create, this is how I like to define my business logic and have most success with maintaning.

```
└─── app
│   │   index.js // 5. Framework
│   │   register-providers.ts // import providers to be registered by the container
│   │
│   └─── common // slam things here that will be used throughout all modules
│   │   │   interfaces
│   │   │   guards
│   │   │   ...
│   │
│   └─── modules // business logic.
│   │   │   accounts
│   │   └───  accounts.repository.ts // db queries 
│   │       │ accounts.service.ts // business logic 
│   │       │ accounts.model.ts // db model
│   │   
└─── ...
```

### Functional Programming(FP) Approcah

If you prefer a more funcitonal programming approach I've had success with an approach similar to the architecture below.

```
└─── api
│   │   app.js 
│   │   database.js
│   │   ...
|   |  
│   └─── models 
│   │   │   accounts.model.ts
│   │   │   users.model.ts
│   │   │   ...
│   │
│   └─── repositories 
│   │   │   accounts.repository.ts
│   │   │   users.repository.ts
│   │   │   ...
│   │
│   └─── use-cases 
│   │   └─── accounts
│   │   │   │   post-account.js
│   │   │   │   get-account-by-email.js
│   │   │   │   ...
│   │   └─── ...
│   │
│   └─── controllers // 3) Interface Adapters
│   │   │   accounts.controller.js
│   │   │   users.controller.js
│   │   │   ...
│   
└─── ...
