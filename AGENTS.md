# AGENTS.md

Instructions for coding agents working in this repo.

walgo-biolink is a single-page link-in-bio [Hugo](https://gohugo.io) theme (Hugo >= 0.112.0), built for deployment to Walrus with the walgo CLI. Users install it as `themes/walgo-biolink` and configure everything under `[params]` in their `hugo.toml`.

## Layout

- `layouts/index.html`, `layouts/_default/`: the page shell; `layouts/partials/`: one partial per section (profile, social-row, badges, wallets, links, projects, text, image, slider) plus head and footer.
- `assets/css/main.css`, `assets/js/main.js`: the stylesheet and main script, inlined by the templates. `layouts/_default/baseof.html` also inlines a small script that restores the saved light/dark theme before paint. No frameworks or external JS.
- `data/icons.yaml`: SVG icons for socials and chain badges.
- `static/`: favicon and self-hosted fonts. External font CSS loads only when a user opts in with `customFonts` (Google Fonts or `fontUrl`).
- `exampleSite/`: a fully commented demo config (`exampleSite/hugo.toml`) and content.
- `theme.toml`: theme metadata.

## Commands

There is no test suite. Check changes by building the example site:

```bash
cd exampleSite
hugo server --themesDir ../..   # live preview
hugo --themesDir ../..          # one-off build into exampleSite/public (gitignored)
```

`--themesDir ../..` works when this repo is checked out in a directory named `walgo-biolink`.

## Care points

- `[params]` keys, section types, card style names, and icon names are a public contract with users' existing `hugo.toml` files. Keep old keys working; document new ones in `exampleSite/hugo.toml` and the README.
- Keep the theme dependency-free and small; it is served from decentralized storage.

## Agent skills

### Issue tracker

GitHub Issues in `ganbitlabs/walgo-biolink`, through the `gh` CLI. See [`docs/agents/issue-tracker.md`](docs/agents/issue-tracker.md).

### Triage labels

The five canonical defaults: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See [`docs/agents/triage-labels.md`](docs/agents/triage-labels.md).

### Domain docs

Single-context: `GLOSSARY.md` + `docs/adr/` at the repo root, created lazily as terms and decisions get resolved. See [`docs/agents/domain.md`](docs/agents/domain.md).
