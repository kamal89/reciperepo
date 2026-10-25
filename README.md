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
- **Share recipes into the app.** On Android, tap **Share** on a recipe page in Chrome (or any app) and pick **Recipe Repo**. A new recipe opens with the name and link filled in; sharing a link you already saved opens that recipe instead. Pasted ingredient lists from recipe sites (checkbox glyphs, bullets, numbering) are cleaned up automatically.
- **Formatted ingredients and steps.** Bulleted, numbered or checkbox lists paste in cleanly. In either field, a line ending in a colon ("For the sauce:") becomes a section heading; headings never reach the grocery list. Each step line becomes a numbered step you can tap to mark done. Lines starting with "Tip:", "Note:", "To store:" and similar are highlighted, `**bold**` and `*italic*` work, and cooking times and oven temperatures stand out. The recipe form has buttons for each.
- **Cooking timers.** Tap any highlighted time in the steps ("8 minutes", "3–4 hours") to start a countdown; ranges start at the shorter time. Timers float at the bottom of the screen with pause, +1 min and cancel, keep running if you close the recipe or the app, and beep, vibrate and (in the installed app) notify when done.
- **Scale while you cook.** The open recipe has its own servings control; amounts are recalculated and re-expressed in sensible units. If the meal is on the grocery list, one tap applies the new servings there too.
- **Ratings and notes.** Give each recipe 1–5 stars and a "next time" note from the recipe view. Both show on the recipe cards and are kept through edits and backups.
- **Favorites and "last made".** Heart a recipe from its card or recipe view. **✓ We made this today** records when you cooked it (with Undo), and cards show "Made 2 weeks ago" or "Not made yet". Filter to favorites or never-made recipes, and sort by A–Z, favorites, not made in a while, recently made, top rated or newest.
- **What's for dinner?** Picks a recipe from whatever is currently showing, leaning toward favorites, higher ratings and things you haven't made lately. **Pick another** rolls again without repeats.
- **Regulars.** Extras you add to the grocery list are remembered; the most frequent show as one-tap chips. **Edit** lets you forget ones you no longer buy.
- **Undo and Recently deleted.** Deleting a recipe moves it to **Recently deleted** at the bottom of the Recipes screen, with an Undo right after. Restore it any time within 30 days, or delete it forever. **Clear all meals** can be undone too.
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
