# Swarohi wedding website

A responsive wedding landing page for Swathi & Rohithashva — 9 May 2027.

## Files
- `index.html` — page structure
- `style.css` — responsive styling
- `script.js` — editable event details, tab title and countdown behavior
- `wedding.json` — optional legacy backup of the details; the website no longer loads it
- `assets/logo.svg` — logo shown at the **top centre of the Swarohi meaning card**

## Before publishing
1. Open `script.js`.
2. Update the values in the `wedding` object: names, venue, time and date.
3. The ISO date is `wedding.isoDate` (currently `2027-05-09`); the countdown reads this value.
4. To use your own logo, replace `assets/logo.svg` while keeping the same file name, or update the image path in `index.html`.
5. Upload all files to the root of your Git repository.
6. Enable GitHub Pages (Settings → Pages) or connect the repository to your hosting provider.
