import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MarkdownEditor from '../MarkdownEditor';

// Mock react-markdown
jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }) {
    return <div data-testid="markdown-preview">{children}</div>;
  };
});

describe('MarkdownEditor Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders in edit mode by default', () => {
    render(<MarkdownEditor content="Test content" onChange={mockOnChange} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue('Test content');
  });

  it('calls onChange when content is typed', async () => {
    const user = userEvent.setup();
    render(<MarkdownEditor content="" onChange={mockOnChange} />);
    
    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'New content');
    
    expect(mockOnChange).toHaveBeenCalled();
  });

  it('switches to preview mode when Preview button is clicked', async () => {
    const user = userEvent.setup();
    render(<MarkdownEditor content="# Heading" onChange={mockOnChange} />);
    
    await user.click(screen.getByText('Preview'));
    expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('switches to split mode when Split button is clicked', async () => {
    const user = userEvent.setup();
    render(<MarkdownEditor content="Test" onChange={mockOnChange} />);
    
    await user.click(screen.getByText('Split'));
    const textareas = screen.getAllByRole('textbox');
    expect(textareas).toHaveLength(1); // One textarea in split view
    expect(screen.getByTestId('markdown-preview')).toBeInTheDocument();
  });

  it('displays placeholder text', () => {
    render(<MarkdownEditor placeholder="Start writing..." onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText('Start writing...')).toBeInTheDocument();
  });

  it('uses default placeholder when not provided', () => {
    render(<MarkdownEditor onChange={mockOnChange} />);
    expect(screen.getByPlaceholderText('Start writing your markdown here...')).toBeInTheDocument();
  });

  it('updates content when prop changes', () => {
    const { rerender } = render(<MarkdownEditor content="Initial" onChange={mockOnChange} />);
    expect(screen.getByRole('textbox')).toHaveValue('Initial');
    
    rerender(<MarkdownEditor content="Updated" onChange={mockOnChange} />);
    expect(screen.getByRole('textbox')).toHaveValue('Updated');
  });
});

