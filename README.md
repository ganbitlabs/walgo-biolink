<h1 align="center">Walgo Biolink</h1>

<p align="center">
  <strong>A link-in-bio <a href="https://gohugo.io">Hugo</a> theme for the decentralized web.</strong><br>
  Deploy your identity on-chain via <a href="https://walrus.xyz">Walrus</a> with <a href="https://github.com/selimozten/walgo">Walgo</a>.
</p>

<p align="center">
  <a href="#quick-start">Quick Start</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="#configuration">Configuration</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="exampleSite/hugo.toml">Example Config</a>&nbsp;&nbsp;|&nbsp;&nbsp;<a href="#license">License</a>
</p>

---

## Overview

Walgo Biolink is a single-page [Hugo](https://gohugo.io) theme designed for blockchain professionals, DAOs, and Web3 creators. It ships with five visual card styles, flexible section ordering, built-in wallet address support, and zero JavaScript dependencies beyond vanilla JS.

Optimized for deployment on [Walrus](https://walrus.xyz) decentralized storage via the [Walgo CLI](https://github.com/selimozten/walgo).

### Highlights

| | Feature | Details |
|---|---|---|
| **Styles** | 5 card styles | `default` · `glass` · `brutal` · `terminal` · `neon` |
| **Sections** | 7 section types | socials · badges · wallets · links · projects · text · image |
| **Socials** | 14 built-in icons | X · GitHub · Discord · Telegram · Farcaster · Lens · Mirror · YouTube · LinkedIn · Reddit · Instagram · Medium · Email · Website |
| **Chains** | 6 badge icons | Sui · Ethereum · Bitcoin · Solana · Polygon · Avalanche |
| **Wallets** | Copy & explore | One-click copy with block explorer deep links |
| **Theming** | Dark / light | Custom accent color, Google Fonts, background image |
| **Performance** | Zero deps | Vanilla JS · No frameworks · Walrus-optimized asset sizes |

---

## Quick Start

```bash
hugo new site my-biolink && cd my-biolink

git submodule add https://github.com/ganbitlabs/walgo-biolink themes/walgo-biolink

cp themes/walgo-biolink/exampleSite/hugo.toml .

hugo server
```

Open `http://localhost:1313` — you should see the example biolink page.

---

## Configuration

Everything lives in `hugo.toml` under `[params]`. The [example config](exampleSite/hugo.toml) is fully commented and ready to customize.

### Profile

```toml
[params]
  name         = "Your Name"
  title        = "Web3 Builder & Sui Developer"
  bio          = "Building on Sui and Walrus."
  avatar       = "/photo.jpg"       # empty string → initials fallback
  favicon      = "/favicon.svg"
  defaultTheme = "dark"             # "dark" | "light"
  accentColor  = "#00d4aa"
  cardStyle    = "default"          # default | glass | brutal | terminal | neon
```

### Section Ordering

Sections are fully composable. Reorder them, use the same type multiple times with different data, or remove what you don't need:

```toml
[[params.sections]]
  type = "socials"

[[params.sections]]
  type    = "badges"
  key     = "tech"          # reads from [[params.tech]] instead of [[params.badges]]
  marquee = true            # scrolling ticker
  title   = "Tech Stack"

[[params.sections]]
  type  = "links"
  title = "Projects"

[[params.sections]]
  type = "wallets"
```

> **Available types:** `socials` · `badges` · `wallets` · `links` · `projects` · `text` · `image`

### Social Links

```toml
[[params.socials]]
  platform = "x"
  url      = "https://x.com/yourhandle"
  label    = "X"
```

Built-in platforms: `x` · `github` · `discord` · `telegram` · `farcaster` · `lens` · `mirror` · `youtube` · `linkedin` · `reddit` · `instagram` · `medium` · `email` · `website`

Pass a file path or URL in the `icon` field for custom icons.

### Wallet Addresses

```toml
[[params.wallets]]
  chain    = "sui"
  label    = "Sui"
  address  = "0x1234..."
  explorer = "https://suiscan.xyz/mainnet/account/"
```

Built-in chain icons: `sui` · `ethereum` · `bitcoin` · `solana` · `polygon` · `avalanche`

### Custom Fonts

```toml
[params]
  customFonts = true
  fontFamily  = "Inter"             # any Google Font
  monoFont    = "JetBrains Mono"    # any Google Font mono
```

---

## Theme Structure

```
walgo-biolink/
├── archetypes/             Content templates
├── assets/
│   ├── css/main.css        Styles — CSS custom properties, 5 card variants
│   └── js/main.js          Vanilla JS — dark mode, pager, marquee, clipboard
├── data/
│   └── icons.yaml          SVG definitions for social & chain icons
├── exampleSite/            Complete working example
├── layouts/
│   ├── _default/           Base templates
│   ├── partials/           10 section components
│   ├── index.html          Home page
│   └── 404.html            Error page
└── static/
    └── favicon.svg
```

---

## Requirements

[Hugo](https://gohugo.io) **0.112.0** or later. Extended edition recommended for asset processing.

## Contributing

Contributions are welcome. Please open an issue or submit a pull request on [GitHub](https://github.com/ganbitlabs/walgo-biolink).

## License

[MIT](LICENSE)
