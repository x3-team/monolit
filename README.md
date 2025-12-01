# Monolit Presentation Template

A modern, minimalist React-based presentation template inspired by the Monolit design system. Perfect for seed stage pitch decks and professional presentations.

## Features

- Clean, elegant design with fluid typography
- Keyboard navigation (Arrow keys, Space, Home, End)
- Touch/click navigation
- Responsive layout for all screen sizes
- Dark mode support
- Reduced motion support for accessibility
- Smooth slide transitions

## Design System

Based on the Monolit website design patterns:
- **Colors**: Warm beige background (#F0EEE6), black text
- **Typography**: Inter font family with fluid scaling
- **Layout**: Minimalist, content-focused design
- **Branding**: MONOLIT logo (MONO in bold, LIT in light weight)

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view in your browser.

### Build for Production

```bash
npm run build
```

Creates an optimized production build in the `build` folder.

## Navigation

- **Arrow Right / Space**: Next slide
- **Arrow Left**: Previous slide
- **Home**: First slide
- **End**: Last slide
- **Click indicators**: Jump to specific slide
- **Navigation buttons**: Click prev/next buttons

## Slide Structure

The presentation follows seed stage pitch guidelines:

1. **Title Slide** - Company name and one-liner
2. **What We Do** - Problem, solution, and example
3. **Team** - Founder and team member bios
4. **Traction** - Key metrics with time context
5. **Unique Insights** - Non-obvious learnings
6. **Market Size** - Bottom-up calculation
7. **The Ask** - Funding amount and milestones

## Customization

### Adding New Slides

1. Create a new component in `src/slides/YourSlide.js`
2. Import and use the slide styles from `src/slides/Slide.css`
3. Add your slide to `src/slides/slides.js`:

```javascript
import YourSlide from './YourSlide';

const slides = [
  // ... existing slides
  {
    id: 'your-slide',
    component: YourSlide,
    title: 'Your Slide Title'
  }
];
```

### Editing Slide Content

Edit the individual slide files in `src/slides/` to customize:
- Text content
- Images and media
- Layout and styling

### Customizing Design

- **Colors**: Edit CSS variables in `src/App.css`
- **Typography**: Modify font sizes and weights in design tokens
- **Layout**: Adjust component styles in `src/components/Presentation.css`
- **Slide styles**: Customize in `src/slides/Slide.css`

## Design Guidelines

Based on common pitch deck best practices:

### What We Do
- Customer pitch, not investor pitch
- 100% accurate, 50% clear
- Use concrete examples

### Team
- Highlight relevant experience
- Show why you're uniquely positioned

### Traction
- Always include time context
- Show real progress (not fake work)
- Focus on momentum

### Unique Insights
- Non-obvious learnings only
- Support with specific data
- Avoid generic statements

### Market Size
- Use bottom-up calculations
- Show your data sources
- Be realistic

### The Ask
- Specific funding amount
- Clear milestones
- Revenue/usage targets

## Project Structure

```
pres_monolit/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Presentation.js
│   │   └── Presentation.css
│   ├── slides/
│   │   ├── TitleSlide.js
│   │   ├── WhatWeDoSlide.js
│   │   ├── TeamSlide.js
│   │   ├── TractionSlide.js
│   │   ├── UniqueInsightsSlide.js
│   │   ├── MarketSizeSlide.js
│   │   ├── AskSlide.js
│   │   ├── Slide.css
│   │   └── slides.js
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
├── package.json
└── README.md
```

## Browser Support

Works in all modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This is a template for your use. Customize freely for your presentations.

## Credits

Design system inspired by Monolit website.
Pitch structure based on YC seed stage pitch guidelines.
