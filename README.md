# Articles with Tests

A serverless site for educational articles with embedded interactive exercises. Built with Vite + React + MDX. Articles live in `/articles/**/*.mdx` and are loaded dynamically by route.

---

## Adding an article

**1. Create `articles/<slug>.mdx`**

The slug must contain only lowercase letters, numbers, and hyphens.

**2. Add an entry to `articles/articles.js`**

```js
{
  slug: "your-slug",   // must match the .mdx filename (without extension)
  title: "Your Title",
  image: "cover.jpg",  // file in /public
  imageAlt: "Alt text for the cover image",
  blurb: "One or two sentences shown on the home page.",
  tags: ["tag-one", "tag-two"],
}
```

Tags are collected automatically from this file — the home page filter updates without any extra steps.

---

## Custom MDX components for the articles

### `<DragAndDrop>` + `<DropZone>`

A passage with blanks the user fills by dragging words from a pool.

```mdx
<DragAndDrop words="omnivores;Vulpes;nocturnal">
  Foxes belong to the genus <DropZone answer="Vulpes" />.
  They are primarily <DropZone answer="nocturnal" /> animals
  and are considered <DropZone answer="omnivores" />.
</DragAndDrop>
```

**`<DragAndDrop>`**

| Prop    | Type   | Description                                 |
| ------- | ------ | ------------------------------------------- |
| `words` | string | Semicolon-separated pool of draggable words |

**`<DropZone>`**

| Prop     | Type   | Description                     |
| -------- | ------ | ------------------------------- |
| `answer` | string | The correct word for this blank |

### `<FillIn>` + `<Blank>`

A passage with blanks the user fills by typing. Multiple accepted answers can be separated with `;`. Comparison is case-insensitive and trims whitespace.

```mdx
<FillIn>
  Foxes belong to the genus <Blank answer="Vulpes" />.
  They are considered <Blank answer="omnivores;omnivore" />.
</FillIn>
```

**`<Blank>`**

| Prop     | Type   | Description                            |
| -------- | ------ | -------------------------------------- |
| `answer` | string | Correct answer(s), semicolon-separated |

When checking: correct answers turn green, wrong answers turn red with strikethrough and the correct answer shown next to it.

### `<Choices>` + `<Choice>`

A multiple-choice question. Use standalone for a single question with its own check/reset buttons, or wrap multiple questions in `<ChoiceSet>` to share one set of buttons.

```mdx
1. What do foxes primarily eat?
<Choices>
  <Choice explanation="Foxes are not grazers.">Grass and leaves</Choice>
  <Choice correct explanation="Foxes are omnivores that hunt small mammals and forage for berries.">Small mammals, birds, and berries</Choice>
  <Choice>Fish and aquatic plants</Choice>
</Choices>
```

There can be multiple correct answers. `explanation` is optional and shown after clicking "check answers".

**`<Choices>`**

| Prop     | Type    | Description                                                 |
| -------- | ------- | ----------------------------------------------------------- |
| `single` | boolean | Only one answer can be selected at a time (radio behaviour) |

**`<Choice>`**

| Prop          | Type    | Description                                      |
| ------------- | ------- | ------------------------------------------------ |
| `correct`     | boolean | Marks this option as correct                     |
| `explanation` | string  | Optional explanation shown when checking answers |

#### `<ChoiceSet>`

Wraps multiple `<Choices>` blocks so they share a single check/reset button bar.

```mdx
<ChoiceSet>

1. First question
<Choices>...</Choices>

2. Second question
<Choices>...</Choices>

</ChoiceSet>
```

### `<Categorize>` + `<Category>`

A drag-and-drop exercise where the user sorts words into labelled buckets.

```mdx
<Categorize words="rabbit;apple;salmon;grass;berries;mouse">
  <Category label="Eaten by foxes" answer="rabbit;apple;berries;mouse" />
  <Category label="Inedible to foxes" answer="salmon;grass" />
</Categorize>
```

**`<Categorize>`**

| Prop    | Type   | Description                       |
| ------- | ------ | --------------------------------- |
| `words` | string | Semicolon-separated words to sort |

**`<Category>`**

| Prop     | Type   | Description                                          |
| -------- | ------ | ---------------------------------------------------- |
| `label`  | string | Bucket heading                                       |
| `answer` | string | Semicolon-separated words that belong in this bucket |

Words can be dragged between buckets and back to the pool. Checking marks each placed word green or red in place.

### `<Img>`

Replaces the standard markdown image to add layout and sizing options.

```mdx
<Img src="./fox.jpg" alt="a red fox" />
<Img src="./fox.jpg" float="left" width={35} />
<Img src="./fox.jpg" float="right" />
<Img src="./fox.jpg" fullBleed />
<Img src="./fox.jpg" noMaxHeight />
<Img src="./fox.jpg" eager />
```

| Prop          | Type                  | Default | Description                                                   |
| ------------- | --------------------- | ------- | ------------------------------------------------------------- |
| `src`         | string                | —       | Image path                                                    |
| `caption`     | string                | —       | Caption displayed under the image                             |
| `alt`         | string                | `""`    | Alt text                                                      |
| `float`       | `"left"` \| `"right"` | —       | Float image left or right, text wraps around it               |
| `width`       | number                | —       | Max width as % of content column (e.g. `{40}`)                |
| `fullBleed`   | boolean               | —       | Extend to full viewport width, breaking out of content column |
| `noMaxHeight` | boolean               | —       | Disable the default `max-height: 100dvh` constraint           |
| `eager`       | boolean               | —       | Disable lazy loading                                          |

Plain markdown images (`![alt](src)`) still work if needed.