# Recipe Repo

A small recipe library for the household. Add recipes, sort them by meal, cuisine and tags, pick what you want to cook, and get one combined grocery list grouped by store section.

The app is a single page, `index.html`, with no build step. Recipes and the grocery list are stored in Cloud Firestore behind Google sign-in, so everyone with access sees the same data. It is also an installable Android app (a Progressive Web App).

## Features

- **Recipe library** with a meal type (Breakfast, Lunch, Dinner, Side, Dessert, Snack), cuisine, tags, servings, time, steps and a source link.
- **Filters and search** by meal, cuisine, tag, recipe name or ingredient.
- **Ingredient parsing.** Enter ingredients one per line (`1 1/2 lb chicken thighs`, `3 cloves garlic, minced`, `Salt`). The amount and unit are read from the start of each line.
- **Meal picking with servings.** Change servings per meal and the amounts scale.
- **Combined grocery list.** Matching ingredients across meals are added together and grouped by aisle (Produce, Meat & Fish, Dairy & Eggs, Bakery, Pantry, Spices, Frozen, Other). Check items off while shopping and add extras.
- **Sharing.** Copy the list, open it in your email or Messages app, or save it as a `.txt` file.
- **Unit combining.** Teaspoons, tablespoons and cups of the same ingredient are added together (2 tbsp + ½ cup olive oil → ½ cup + 2 tbsp), as are ounces and pounds, grams and kilograms, and milliliters and liters.
- **Pantry staples.** Items you always have (salt, black pepper, olive oil by default) move to a "Probably have already" section and stay off the copied list, which ends with a reminder to check them. Edit the staples at the bottom of the list.
- **Backup and restore.** **Back up recipes** saves every recipe to a `.json` file. **Restore from backup** loads one back, adding new recipes and replacing ones with the same id. Recipes not in the file are kept.
- **Keep screen on.** A toggle on each recipe stops the phone from going dark while you cook (Android Chrome and most desktop browsers).

## Running it

Serve the folder from any static host over HTTPS. With GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / root**. The site appears at `https://<user>.github.io/reciperepo/`.

You can also open `index.html` directly from disk, but installing and offline use need it to be served.

## Installing on Android

1. Open the site in **Chrome** on the phone.
2. Tap **Install app** in the app's header. If the button doesn't appear, use Chrome's menu (⋮) → **Add to Home screen** → **Install**.
3. Open **Recipe Repo** from the home screen. It runs full-screen, works offline, and long-pressing the icon offers a shortcut straight to the grocery list.

App files:

| File | Purpose |
| --- | --- |
| `manifest.webmanifest` | App name, colors, icons and the grocery-list shortcut |
| `sw.js` | Service worker that caches the app so it opens offline |
| `icons/` | Home-screen, maskable and favicon icons |
| `firebase-store.js` | Connects to Firestore and Google sign-in |
| `firestore.rules` | Security rules: who can read and write the data |

When you change `index.html` or the icons, bump `VERSION` in `sw.js` so installed copies refresh their cache. Installed apps check for a new version each time they open with a connection.

## Where data is saved

| Where it runs | Storage |
| --- | --- |
| Hosted app and installed Android app | **Cloud Firestore** (project `recipe-repo-fdbf0`). Sign in with Google; only the accounts listed in `firestore.rules` can read or write. A copy is kept on each device, so the app works offline and syncs when it reconnects. |
| Opened without a Firebase config | The browser's `localStorage`, on that device only. Five example recipes are loaded the first time. |
| claude.ai artifact | The artifact's own shared database. It is separate from Firestore. |

Data layout in Firestore:

- `recipes/{id}`: one document per recipe (title, mealType, cuisine, tags, servings, time, ingredients, steps, source)
- `plan/current`: picked meals, checked-off items, extras and pantry staples

## Firebase setup

The config in `index.html` (`window.FIREBASE_CONFIG`) is meant to be public; the security rules protect the data.

1. **Firestore rules:** copy `firestore.rules` into Firebase console → Firestore Database → **Rules** and click **Publish**. To give someone access, add their Google email to the list in the console and publish again. The copy in this repo uses placeholder emails so real addresses stay out of a public repo.
2. **Sign-in:** Authentication → Sign-in method → **Google** must be enabled.
3. **Authorized domains:** Authentication → Settings → Authorized domains must include the site's domain (for example `kamal89.github.io`).

Use **Back up recipes** now and then; a backup file can be restored into any copy of the app.

## Customizing

All logic is in the `<script>` at the bottom of `index.html`:

- `MEALS` and `TAGS` set the default meal types and suggested tags.
- `AISLES` maps keywords to store sections. Add words to a pattern to change where an ingredient is sorted.
- `UNITS` lists the units the parser recognizes.
