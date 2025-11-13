# Component Documentation

This document provides an overview of all reusable components in the AI Knowledge Workspace frontend.

## UI Components

### Button

A versatile button component with multiple variants and sizes.

**Location**: `src/components/ui/Button.js`

**Props**:
- `children` (ReactNode, required): Button content
- `onClick` (function): Click handler
- `variant` (string, default: 'primary'): Button style variant
  - `'primary'`: Blue background, white text
  - `'secondary'`: Gray background, dark text
  - `'outline'`: Border only, no background
  - `'danger'`: Red background, white text
- `size` (string, default: 'md'): Button size
  - `'sm'`: Small padding, small text
  - `'md'`: Medium padding, base text
  - `'lg'`: Large padding, large text
- `className` (string): Additional CSS classes
- `...props`: All other button HTML attributes

**Usage**:
```jsx
import Button from '@/components/ui/Button';

<Button variant="primary" size="md" onClick={handleClick}>
  Click Me
</Button>
```

---

### Input

A form input component with label and error message support.

**Location**: `src/components/ui/Input.js`

**Props**:
- `label` (string, optional): Input label text
- `error` (string, optional): Error message to display
- `className` (string): Additional CSS classes
- `...props`: All standard input HTML attributes (type, placeholder, value, onChange, etc.)

**Usage**:
```jsx
import Input from '@/components/ui/Input';

<Input
  label="Email Address"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors.email}
  placeholder="you@example.com"
/>
```

---

### Card

A container component for grouping related content.

**Location**: `src/components/ui/Card.js`

**Props**:
- `children` (ReactNode, required): Card content
- `className` (string): Additional CSS classes
- `...props`: All other div HTML attributes

**Usage**:
```jsx
import Card from '@/components/ui/Card';

<Card className="custom-class">
  <h2>Card Title</h2>
  <p>Card content goes here</p>
</Card>
```

---

### LoadingSpinner

A loading spinner component with customizable size.

**Location**: `src/components/ui/LoadingSpinner.js`

**Props**:
- `size` (string, default: 'md'): Spinner size
  - `'sm'`: 16px (w-4 h-4)
  - `'md'`: 32px (w-8 h-8)
  - `'lg'`: 48px (w-12 h-12)
- `className` (string): Additional CSS classes

**Usage**:
```jsx
import LoadingSpinner from '@/components/ui/LoadingSpinner';

<LoadingSpinner size="lg" />
```

---

### LoadingOverlay

A full-screen loading overlay with backdrop blur.

**Location**: `src/components/ui/LoadingOverlay.js`

**Props**:
- `message` (string, default: 'Loading...'): Loading message text

**Usage**:
```jsx
import LoadingOverlay from '@/components/ui/LoadingOverlay';

{isLoading && <LoadingOverlay message="Loading workspace..." />}
```

---

### PageTransition

A wrapper component for page transitions using Framer Motion.

**Location**: `src/components/ui/PageTransition.js`

**Props**:
- `children` (ReactNode, required): Content to animate

**Usage**:
```jsx
import PageTransition from '@/components/ui/PageTransition';

<PageTransition>
  <YourPageContent />
</PageTransition>
```

---

## Editor Components

### EditorToolbar

Toolbar for the markdown editor with AI actions and save button.

**Location**: `src/components/editor/EditorToolbar.js`

**Props**:
- `onSummarize` (function, required): Handler for summarize button click
- `onAskAI` (function, required): Handler for Ask AI button click
- `onSave` (function, required): Handler for save button click
- `isSaving` (boolean, default: false): Whether save operation is in progress

**Usage**:
```jsx
import EditorToolbar from '@/components/editor/EditorToolbar';

<EditorToolbar
  onSummarize={handleSummarize}
  onAskAI={handleAskAI}
  onSave={handleSave}
  isSaving={isSaving}
/>
```

---

### MarkdownEditor

A markdown editor with edit, preview, and split view modes.

**Location**: `src/components/editor/MarkdownEditor.js`

**Props**:
- `content` (string, required): Markdown content to display/edit
- `onChange` (function, required): Handler for content changes
- `placeholder` (string, default: 'Start writing your markdown here...'): Placeholder text

**Usage**:
```jsx
import MarkdownEditor from '@/components/editor/MarkdownEditor';

<MarkdownEditor
  content={pageContent}
  onChange={setPageContent}
  placeholder="Start writing..."
/>
```

**Features**:
- Edit mode: Textarea for writing markdown
- Preview mode: Rendered markdown preview
- Split mode: Side-by-side edit and preview (hidden on mobile)

---

### AIModal

Modal for AI interactions (summarize and ask questions).

**Location**: `src/components/editor/AIModal.js`

**Props**:
- `isOpen` (boolean, required): Whether modal is visible
- `onClose` (function, required): Handler to close modal
- `type` (string, required): Modal type
  - `'summarize'`: AI summarization mode
  - `'ask'`: AI Q&A mode
- `content` (string, required): Page content to analyze

**Usage**:
```jsx
import AIModal from '@/components/editor/AIModal';

<AIModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  type="summarize"
  content={pageContent}
/>
```

---

## Workspace Components

### WorkspaceCard

Card component for displaying workspace information.

**Location**: `src/components/workspace/WorkspaceCard.js`

**Props**:
- `workspace` (object, required): Workspace data
  - `id` (string): Workspace ID
  - `title` (string): Workspace title
  - `description` (string, optional): Workspace description
  - `members` (array): Array of member IDs
  - `updatedAt` (string): ISO date string
- `onDelete` (function, required): Handler for delete action
- `onEdit` (function, required): Handler for edit action

**Usage**:
```jsx
import WorkspaceCard from '@/components/workspace/WorkspaceCard';

<WorkspaceCard
  workspace={workspace}
  onDelete={handleDelete}
  onEdit={handleEdit}
/>
```

---

### NewWorkspaceModal

Modal for creating or editing workspaces.

**Location**: `src/components/workspace/NewWorkspaceModal.js`

**Props**:
- `isOpen` (boolean, required): Whether modal is visible
- `onClose` (function, required): Handler to close modal
- `onSubmit` (function, required): Handler for form submission
  - Receives form data: `{ title: string, description: string }`
- `workspace` (object, optional): Workspace data for editing mode

**Usage**:
```jsx
import NewWorkspaceModal from '@/components/workspace/NewWorkspaceModal';

<NewWorkspaceModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onSubmit={handleSubmit}
  workspace={editingWorkspace} // Optional, for edit mode
/>
```

---

### EmptyWorkspace

Empty state component when no workspaces exist.

**Location**: `src/components/workspace/EmptyWorkspace.js`

**Props**:
- `onCreateWorkspace` (function, required): Handler for create button click

**Usage**:
```jsx
import EmptyWorkspace from '@/components/workspace/EmptyWorkspace';

<EmptyWorkspace onCreateWorkspace={() => setIsModalOpen(true)} />
```

---

## Sidebar Components

### PageSidebar

Sidebar for displaying and managing pages within a workspace.

**Location**: `src/components/sidebar/PageSidebar.js`

**Props**:
- `pages` (array, default: []): Array of page objects
- `activePageId` (string, optional): ID of currently active page
- `workspaceTitle` (string, optional): Workspace title to display
- `onPageClick` (function, required): Handler for page selection
- `onPageDelete` (function, required): Handler for page deletion
- `onCreatePage` (function, required): Handler for creating new page
- `onCreateChildPage` (function, required): Handler for creating child page

**Usage**:
```jsx
import PageSidebar from '@/components/sidebar/PageSidebar';

<PageSidebar
  pages={pages}
  activePageId={currentPageId}
  workspaceTitle={workspace.title}
  onPageClick={handlePageClick}
  onPageDelete={handleDeletePage}
  onCreatePage={handleCreatePage}
  onCreateChildPage={handleCreateChildPage}
/>
```

**Features**:
- Search functionality
- Mobile-responsive with toggle button
- Page count display
- Nested page tree support

---

### PageTree

Component for rendering nested page tree structure.

**Location**: `src/components/sidebar/PageTree.js`

**Props**:
- `pages` (array, required): Flat array of page objects
- `activePageId` (string, optional): ID of active page
- `onPageClick` (function, required): Handler for page click
- `onPageDelete` (function, required): Handler for page deletion
- `onCreateChildPage` (function, required): Handler for creating child page

**Usage**:
```jsx
import PageTree from '@/components/sidebar/PageTree';

<PageTree
  pages={pages}
  activePageId={activePageId}
  onPageClick={handlePageClick}
  onPageDelete={handleDeletePage}
  onCreateChildPage={handleCreateChildPage}
/>
```

---

### PageItem

Individual page item in the page tree.

**Location**: `src/components/sidebar/PageItem.js`

**Props**:
- `page` (object, required): Page data with children array
- `isActive` (boolean, default: false): Whether page is currently active
- `onClick` (function, required): Handler for page click
- `onDelete` (function, required): Handler for page deletion
- `onCreateChild` (function, required): Handler for creating child page
- `level` (number, default: 0): Nesting level for indentation

**Usage**:
```jsx
import PageItem from '@/components/sidebar/PageItem';

<PageItem
  page={page}
  isActive={page.id === currentPageId}
  onClick={handlePageClick}
  onDelete={handleDeletePage}
  onCreateChild={handleCreateChildPage}
  level={0}
/>
```

---

## Shared Components

### Layout

Main layout wrapper with sidebar and topbar.

**Location**: `src/components/shared/Layout.js`

**Props**:
- `children` (ReactNode, required): Page content

**Usage**:
```jsx
import Layout from '@/components/shared/Layout';

<Layout>
  <YourPageContent />
</Layout>
```

---

### Sidebar

Main application sidebar navigation.

**Location**: `src/components/shared/Sidebar.js`

**Props**: None (uses Next.js navigation)

**Features**:
- Responsive design (hamburger menu on mobile)
- Active route highlighting
- Navigation links

---

### Topbar

Top navigation bar with user info and actions.

**Location**: `src/components/shared/Topbar.js`

**Props**: None (uses AuthContext)

**Features**:
- User information display
- Logout functionality
- Responsive design

---

## Testing

All components have corresponding test files in `__tests__` directories. Run tests with:

```bash
npm test
```

For watch mode:

```bash
npm run test:watch
```

---

## Styling

All components use Tailwind CSS for styling. Custom theme configuration is in `tailwind.config.js`.

### Responsive Breakpoints
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

### Color Palette
- Primary: Blue shades (500-600 for main actions)
- Gray: For text and borders
- Red: For danger/delete actions

---

## Best Practices

1. **Always use TypeScript-style prop validation** (even in JavaScript)
2. **Keep components small and focused** - one responsibility per component
3. **Use composition** - build complex components from simple ones
4. **Follow naming conventions** - PascalCase for components, camelCase for props
5. **Handle loading and error states** - always provide user feedback
6. **Make components accessible** - use semantic HTML and ARIA attributes
7. **Test components** - write tests for critical functionality

---

**Last Updated**: Day 7 - Testing & Documentation Complete

