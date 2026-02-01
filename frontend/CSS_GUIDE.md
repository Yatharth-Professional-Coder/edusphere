# EduSphere CSS Guide

## Overview
EduSphere now uses a professional design system built on Tailwind CSS. This system prioritizes cleanliness, readability, and a modern "polished" feel.

## Design Tokens

### Colors
We use a semantic color naming convention.
- **Primary** (`primary-50` to `primary-950`): Blue-indigo brand color. Use for actions, links, and active states.
- **Secondary** (`secondary-50` to `secondary-950`): Slate grays. Use for text, backgrounds, and borders.
- **Accent** (`accent-50` to `accent-950`): Purple/Fuchsia. Use for decorative elements or highlights.
- **State Colors**: `success` (green), `warning` (orange), `danger` (red), `info` (blue).

### Typography
- **Headings**: `font-heading` (Outfit). Use for h1-h6.
- **Body**: `font-sans` (Inter). Use for everything else.

### Shadows
- `shadow-soft`: Subtle, diffused shadow for panels.
- `shadow-card`: Crisp shadow with ring border for cards.

## Common Components

### Buttons
Use the `.btn` utility class combined with a variant.

```jsx
// Primary Action
<button className="btn btn-primary">Save Changes</button>

// Secondary / Cancel
<button className="btn btn-secondary">Cancel</button>
```

### Cards
Use the `.card` utility for any white container.

```jsx
<div className="card">
  <h3 className="text-lg font-heading text-secondary-900">Card Title</h3>
  <p className="text-secondary-500 mt-2">Card content goes here.</p>
</div>
```

### Inputs
Standardized input styles.

```jsx
<input type="text" className="input-field" placeholder="Enter text..." />
```

## Layout Patterns

### Page Header
```jsx
<div className="mb-8">
    <h1 className="text-2xl font-heading font-bold text-secondary-900">Page Title</h1>
    <p className="text-secondary-500 mt-1">Subtitle or description.</p>
</div>
```

### Grid Layout
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* Card Items */}
</div>
```

## Best Practices
1. **Avoid Hardcoded Colors**: Don't use `bg-blue-500` or `text-gray-700`. Use `bg-primary-500` and `text-secondary-700`.
2. **Spacing**: Use standard spacing scale (`p-4`, `p-6`, `p-8`, `gap-4`).
3. **Contrast**: Ensure text has good contrast. Use `text-secondary-900` for headings and `text-secondary-600` for body text.
