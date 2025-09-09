# BoostHomes Site (Static)

A fast, static landing site for Kyle Kleinman (South Florida real estate). Built with vanilla HTML/CSS/JS, deploys automatically to **GitHub Pages** using Actions.

## Quick Start

1. **Create a repo** on GitHub (e.g., `boosthomes-site`).
2. Upload these files (or push via git).
3. Go to **Settings → Pages**, make sure "Source: GitHub Actions" is selected.
4. The included workflow will publish to Pages. Your site will be live at `https://<your-username>.github.io/<repo-name>/`.

### Local Dev
Just open `index.html` in a browser. No build step required.

### Contact Form
Form is set with `data-netlify="true"` so it works out of the box if you deploy on Netlify. On GitHub Pages, swap to a form backend (Formspree, Basin) or remove `data-netlify` and embed your preferred form provider.

### Customize
- Edit content in `index.html`
- Styles in `css/styles.css`
- Behavior in `js/site.js`

