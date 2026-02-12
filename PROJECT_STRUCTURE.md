# Frontend Project Structure

## Directory Overview

### `/src/assets`
Static assets like images, fonts, and icons.

### `/src/components`
React components organized by type:
- **`/ui`**: Reusable UI components (Button, Card, Input, etc.)
- **`/flow`**: Flow builder specific components
- Root level: Layout and utility components

### `/src/config`
Configuration files:
- `env.ts`: Environment variables configuration

### `/src/constants`
Application-wide constants:
- Routes
- API endpoints
- Storage keys
- HTTP status codes

### `/src/hooks`
Custom React hooks:
- `useTheme`: Theme management
- `useApi`: API call wrapper with loading/error states

### `/src/lib`
Utility libraries:
- `axios.ts`: Configured HTTP client
- `utils.ts`: Helper functions (cn for className merging)

### `/src/pages`
Page components (route-level components):
- Login
- Dashboard
- Flows & FlowBuilder
- Contacts & ContactDetail
- Settings
- Home

### `/src/services`
API service layer:
- `api.ts`: Centralized API calls organized by feature
  - authApi
  - dashboardApi
  - flowsApi
  - contactsApi
  - messagesApi
  - settingsApi

### `/src/store`
State management (Zustand):
- `useAuthStore.ts`: Authentication state

### `/src/types`
TypeScript type definitions:
- User
- AuthResponse
- ApiResponse
- Flow
- Contact
- Message
- Settings

## Key Files

### `App.tsx`
Main application component with routing configuration.

### `main.tsx`
Application entry point, renders the App component.

### `index.css`
Global styles and Tailwind directives.

### `vite.config.ts`
Vite configuration including:
- React plugin
- TypeScript paths
- API proxy configuration

### `tailwind.config.js`
Tailwind CSS configuration.

### `tsconfig.json`
TypeScript compiler configuration.

## Import Aliases

The project uses path aliases configured in `tsconfig.json`:
- `@/*` maps to `./src/*`

Example:
```typescript
import { Button } from '@/components/ui';
import { authApi } from '@/services';
import { ROUTES } from '@/constants';
```

## Component Organization

### UI Components
Reusable, presentational components with no business logic.

### Feature Components
Components tied to specific features (e.g., flow builder nodes).

### Page Components
Top-level route components that compose other components.

### Layout Components
Wrapper components for consistent page structure.

## State Management Strategy

### Local State
Use `useState` for component-specific state.

### Global State
Use Zustand stores for shared state (e.g., authentication).

### Server State
Use custom `useApi` hook or React Query for API data.

## Styling Approach

### Tailwind CSS
Utility-first CSS framework for rapid development.

### Component Variants
Use `cn()` utility to merge Tailwind classes conditionally.

### Responsive Design
Mobile-first approach using Tailwind's responsive utilities.

## API Integration

### Axios Instance
Configured with:
- Base URL
- Request/response interceptors
- Automatic token injection
- Error handling

### Service Layer
Organized by feature for maintainability:
```typescript
// Example usage
import { flowsApi } from '@/services';

const flows = await flowsApi.getAll();
```

## Type Safety

### Strict TypeScript
All components and functions are fully typed.

### API Types
Request/response types defined in `src/types`.

### Props Interfaces
Component props are explicitly typed.

## Best Practices

1. **Component Structure**: Keep components small and focused
2. **Type Safety**: Always define types for props and state
3. **Code Reusability**: Extract common logic into hooks
4. **Consistent Naming**: Use clear, descriptive names
5. **Error Handling**: Always handle errors gracefully
6. **Loading States**: Show loading indicators for async operations
7. **Accessibility**: Use semantic HTML and ARIA attributes
8. **Performance**: Use React.memo and useCallback when needed
