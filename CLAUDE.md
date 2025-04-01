# CLAUDE.md - Fiche de Quart Project Guide

## Build Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Code Style Guidelines

### Architecture
- React-based SPA with Vite and Tailwind CSS
- Component-based structure with UI components in `src/components/ui/`

### Imports
- Use named imports for React components and hooks
- Use default imports for page/view components
- Sort imports: React, external libraries, internal components, styles

### Formatting
- Use JSX for React components
- Use functional components with hooks
- Maintain consistent indentation (2 spaces)
- Use descriptive variable and function names
- Break long JSX into multiple lines for readability

### Styling
- Use Tailwind CSS classes for styling
- Group related classes together
- Extract reusable UI components for consistent styling

### Error Handling
- Use try/catch blocks for async operations
- Provide meaningful error messages
- Implement graceful degradation where possible

### Performance
- Use React's memoization features for expensive calculations
- Keep component state minimal and focused