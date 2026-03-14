# Content Model: Neuro-Academy v2.0

## 1. Lesson Structure
A `Lesson` is an ordered collection of `LessonBlock` objects.

## 2. LessonBlock Payload Schema
Each `LessonBlock` has a `Json` payload determined by its `type`.

### `text`
```json
{
  "content": "Markdown text here...",
  "variant": "normal" | "accent"
}
```

### `video`
```json
{
  "url": "https://...",
  "provider": "youtube" | "vimeo" | "custom",
  "poster": "https://..."
}
```

### `image`
```json
{
  "url": "https://...",
  "caption": "Optional description",
  "alt": "Alt text"
}
```

### `quiz` (Special Block)
Instead of a payload, a lesson can have a separate `Quiz` entity. If a lesson has a quiz, it is usually displayed at the end.

## 3. Storage Principle
- Blocks are retrieved as a flat array ordered by `orderIndex`.
- Registry-based rendering on the frontend (Registry maps `type` -> `Component`).