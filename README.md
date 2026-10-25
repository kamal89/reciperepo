# Our Recipe Box

A small recipe library for the household. Add recipes, sort them by meal, cuisine and tags, pick what you want to cook, and get one combined grocery list grouped by store section.

The app is a single page, `index.html`, with no build step and no dependencies. It is also an installable Android app (a Progressive Web App).

## Features

- **Recipe library** with a meal type (Breakfast, Lunch, Dinner, Side, Dessert, Snack), cuisine, tags, servings, time, steps and a source link.
- **Filters and search** by meal, cuisine, tag, recipe name or ingredient.
- **Ingredient parsing.** Enter ingredients one per line (`1 1/2 lb chicken thighs`, `3 cloves garlic, minced`, `Salt`). The amount and unit are read from the start of each line.
- **Meal picking with servings.** Change servings per meal and the amounts scale.
- **Combined grocery list.** Matching ingredients across meals are added together and grouped by aisle (Produce, Meat & Fish, Dairy & Eggs, Bakery, Pantry, Spices, Frozen, Other). Check items off while shopping and add extras.
- **Sharing.** Copy the list, open it in your email or Messages app, or save it as a `.txt` file.

## Running it

Serve the folder from any static host over HTTPS. With GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / root**. The site appears at `https://<user>.github.io/reciperepo/`.

You can also open `index.html` directly from disk, but installing and offline use need it to be served.

## Installing on Android

1. Open the site in **Chrome** on the phone.
2. Tap **Install app** in the app's header. If the button doesn't appear, use Chrome's menu (⋮) → **Add to Home screen** → **Install**.
3. Open **Recipe Box** from the home screen. It runs full-screen, works offline, and long-pressing the icon offers a shortcut straight to the grocery list.

App files:

| File | Purpose |
| --- | --- |
| `manifest.webmanifest` | App name, colors, icons and the grocery-list shortcut |
| `sw.js` | Service worker that caches the app so it opens offline |
| `icons/` | Home-screen, maskable and favicon icons |

When you change `index.html` or the icons, bump `VERSION` in `sw.js` so installed copies refresh their cache. Installed apps check for a new version each time they open with a connection.

## Where data is saved

| Where it runs | Storage |
| --- | --- |
| claude.ai artifact | Shared storage through the artifact's database. Everyone the page is shared with sees the same recipes and list. |
| Anywhere else (GitHub Pages, the installed Android app) | The browser's `localStorage`. Data stays on that one device. Five example recipes are loaded the first time. |

Clearing Chrome's site data or uninstalling the app erases the local copy. Shared storage through Firestore is planned so both phones see the same recipes.

## Customizing

All logic is in the `<script>` at the bottom of `index.html`:

- `MEALS` and `TAGS` set the default meal types and suggested tags.
- `AISLES` maps keywords to store sections. Add words to a pattern to change where an ingredient is sorted.
- `UNITS` lists the units the parser recognizes.
