# Swarohi wedding website

A responsive wedding landing page for Swathi & Rohithashva — 9 May 2027.

## Files
- `index.html` — page structure, countdown and RSVP behavior
- `style.css` — responsive styling
- `wedding.json` — editable event details, ISO date and logo path
- `assets/logo.svg` — logo shown at the **top centre of the Swarohi meaning card**

## Before publishing
1. Open `wedding.json`.
2. Add your venue, full address and ceremony time.
3. The ISO date path is `wedding.json → date → iso` (currently `2027-05-09`). The countdown reads this value.
4. To use your own logo, put it in `assets/` and change `wedding.json → site → logo`; the default is `assets/logo.svg`.
5. Upload all files to the root of your Git repository.
6. Enable GitHub Pages (Settings → Pages) or connect the repository to your hosting provider.
