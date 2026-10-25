# Our Recipe Box

A small recipe library for the household. Add recipes, sort them by meal, cuisine and tags, pick what you want to cook, and get one combined grocery list grouped by store section.

It is a single file, `index.html`, with no build step and no dependencies.

## Features

- **Recipe library** with a meal type (Breakfast, Lunch, Dinner, Side, Dessert, Snack), cuisine, tags, servings, time, steps and a source link.
- **Filters and search** by meal, cuisine, tag, recipe name or ingredient.
- **Ingredient parsing.** Enter ingredients one per line (`1 1/2 lb chicken thighs`, `3 cloves garlic, minced`, `Salt`). The amount and unit are read from the start of each line.
- **Meal picking with servings.** Change servings per meal and the amounts scale.
- **Combined grocery list.** Matching ingredients across meals are added together and grouped by aisle (Produce, Meat & Fish, Dairy & Eggs, Bakery, Pantry, Spices, Frozen, Other). Check items off while shopping and add extras.
- **Sharing.** Copy the list, open it in your email or Messages app, or save it as a `.txt` file.

## Running it

Open `index.html` in a browser, or serve the folder with any static host. To publish with GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / root**.

## Where data is saved

| Where it runs | Storage |
| --- | --- |
| claude.ai artifact | Shared storage through the artifact's database. Everyone the page is shared with sees the same recipes and list. |
| Anywhere else (local file, GitHub Pages) | The browser's `localStorage`. Data stays on that one device and browser. Five example recipes are loaded the first time. |

Clearing site data in the browser erases the local copy, so keep recipes you care about in the shared claude.ai version, or copy them out.

## Customizing

All logic is in the `<script>` at the bottom of `index.html`:

- `MEALS` and `TAGS` set the default meal types and suggested tags.
- `AISLES` maps keywords to store sections. Add words to a pattern to change where an ingredient is sorted.
- `UNITS` lists the units the parser recognizes.
