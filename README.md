# Blips

Blips is my (Ethan Marks) personal microblog. I use it for random updates, stream-of-consciousness notes, and the various interesting quotes and tidbits that I stumble upon.

<https://ethmarks.github.io/blips/>

## Tech Stack

- **Framework**: [SvelteKit](https://svelte.dev/)
- **Content Management System**: [Sanity](https://www.sanity.io/)
- **Hosting**: [GitHub Pages](https://docs.github.com/en/pages)

## Usage

This project really isn't intended to be used by anyone other than me, but if you insist, you can run Blips locally with the following commands.

```bash
git clone https://github.com/ethmarks/blips.git
cd blips
npm install
npm run dev
```

## SvelteKit

The frontend for Blips is built with SvelteKit. I chose it because I think that it's the best web framework and I wanted to learn to use it (this is actually the primary reason I created Blips in the first place: as a learning project for SvelteKit).

### Config

My [SvelteKit config](svelte.config.js) is fairly typical, with the two noteworthy features being:

- It imports [adapter-static](https://svelte.dev/docs/kit/adapter-static) to make SvelteKit prerender and build the project for GitHub Pages
- It sets `paths.base` equal to `"/blips"` to adjust for GitHub Pages' URL structure

### External Styles and Components

The vast majority of this project's styles are imported from [my main site](https://ethmarks.github.io/)'s global styles with the following line:

```html
<link
    rel="stylesheet"
    href="https://ethmarks.github.io/css/global.min.css"
/>
```

The header and footer are imported as Web Components from my main site through a process described in [this post](https://ethmarks.github.io/posts/partialtocomponent/).

### Markdown Processing

The Blip content is converted to HTML using the [`Marked`](https://www.npmjs.com/package/marked) library. It is further processed using a pipeline of custom JavaScript functions, including [`linkBlanker.js`](src/lib/linkBlanker.js)--which adds `target="_blank"` to external links--and [`blockquoteCitations.js`](src/lib/blockquoteCitations.js) which encases blockquote citations with `<cite>` tags.

## Sanity CMS

The backend for Blips is built with Sanity CMS. I chose it because it has a generous free tier and provides powerful tooling for writing Blips.

### Studio

This repo contains a [Sanity Studio](https://www.sanity.io/docs/studio) in the [`studio-ethmarks-blips/`](studio-ethmarks-blips/) directory. The studio is then deployed to Sanity's servers where it it accessible from the web on any device that's logged into my Sanity account.

The bulk of the studio's source code was auto-generated using the `npm create sanity@latest` command. The only pieces of custom code are the schemas, [`blip.ts`](studio-ethmarks-blips/schemaTypes/blip.ts) and [`index.ts`](studio-ethmarks-blips/schemaTypes/index.ts).

The studio can be run locally with the following commands (assuming you've already cloned the repo):

```bash
cd studio-ethmarks-blips
npm install
npm run dev
```

### Webhook

My Sanity project also utilizes a [webhook](https://www.sanity.io/docs/compute-and-ai/webhooks) that automatically triggers a site rebuild whenever a new blip is created. The configuration for the webhook is below.

| Field        | Value                                                                                 |
|--------------|---------------------------------------------------------------------------------------|
| Name         | GitHub Pages Deploy                                                                   |
| Description  | Automatically triggers a rebuild of the SvelteKit site upon content update            |
| URL          | https://api.github.com/repos/ethmarks/blips/dispatches                                |
| Dataset      | production                                                                            |
| Trigger on   | Create, Update, Delete                                                                |
| Projection   | {"event_type": "sanity-dispatch"}                                                     |
| HTTP method  | POST                                                                                  |
| HTTP headers | {"Accept": "application/vnd.github+json", "Authorization": "Bearer \<GITHUB TOKEN\>"} |
| API version  | v2021-03-25                                                                           |

The `<GITHUB TOKEN>` is a placeholder for the GitHub Personal Access Token, which is necessary for authorizing the webhook. The token has access to the `ethmarks/blips` repository and has its `Contents` permission set to `Read and write`.

## Deployment

The project is automatically deployed to GitHub Pages via the [`deploy.yml`](.github/workflows/deploy.yml) workflow. The workflow triggers on every push to the `main` branch and upon every dispatch from the [Sanity webhook](#webhook).

## License

Licensed under an Apache 2.0 License. See [LICENSE](LICENSE) for more information.
