import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditorToolbar from '../EditorToolbar';

describe('EditorToolbar Component', () => {
  const mockHandlers = {
    onSummarize: jest.fn(),
    onAskAI: jest.fn(),
    onSave: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all toolbar buttons', () => {
    render(<EditorToolbar {...mockHandlers} />);
    
    expect(screen.getByText('Summarize')).toBeInTheDocument();
    expect(screen.getByText('Ask AI')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('calls onSummarize when Summarize button is clicked', async () => {
    const user = userEvent.setup();
    render(<EditorToolbar {...mockHandlers} />);
    
    await user.click(screen.getByText('Summarize'));
    expect(mockHandlers.onSummarize).toHaveBeenCalledTimes(1);
  });

  it('calls onAskAI when Ask AI button is clicked', async () => {
    const user = userEvent.setup();
    render(<EditorToolbar {...mockHandlers} />);
    
    await user.click(screen.getByText('Ask AI'));
    expect(mockHandlers.onAskAI).toHaveBeenCalledTimes(1);
  });

  it('calls onSave when Save button is clicked', async () => {
    const user = userEvent.setup();
    render(<EditorToolbar {...mockHandlers} />);
    
    await user.click(screen.getByText('Save'));
    expect(mockHandlers.onSave).toHaveBeenCalledTimes(1);
  });

  it('displays "Saving..." when isSaving is true', () => {
    render(<EditorToolbar {...mockHandlers} isSaving={true} />);
    expect(screen.getByText('Saving...')).toBeInTheDocument();
    expect(screen.queryByText('Save')).not.toBeInTheDocument();
  });

  it('disables save button when isSaving is true', () => {
    render(<EditorToolbar {...mockHandlers} isSaving={true} />);
    const saveButton = screen.getByText('Saving...').closest('button');
    expect(saveButton).toBeDisabled();
  });

  it('shows "Markdown Editor" label', () => {
    render(<EditorToolbar {...mockHandlers} />);
    expect(screen.getByText('Markdown Editor')).toBeInTheDocument();
  });
});

