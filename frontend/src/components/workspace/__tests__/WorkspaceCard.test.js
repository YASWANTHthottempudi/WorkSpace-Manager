import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WorkspaceCard from '../WorkspaceCard';

describe('WorkspaceCard Component', () => {
  const mockWorkspace = {
    id: '1',
    title: 'Test Workspace',
    description: 'Test description',
    members: ['user1', 'user2'],
    updatedAt: new Date().toISOString(),
  };

  const mockHandlers = {
    onDelete: jest.fn(),
    onEdit: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders workspace title', () => {
    render(<WorkspaceCard workspace={mockWorkspace} {...mockHandlers} />);
    expect(screen.getByText('Test Workspace')).toBeInTheDocument();
  });

  it('renders workspace description', () => {
    render(<WorkspaceCard workspace={mockWorkspace} {...mockHandlers} />);
    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('displays member count', () => {
    render(<WorkspaceCard workspace={mockWorkspace} {...mockHandlers} />);
    expect(screen.getByText(/2 members/i)).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<WorkspaceCard workspace={mockWorkspace} {...mockHandlers} />);
    
    // Hover to show actions, then click edit
    const card = screen.getByText('Test Workspace').closest('a');
    await user.hover(card);
    
    // Find and click edit button
    const editButton = screen.getByTitle('Edit workspace');
    await user.click(editButton);
    
    expect(mockHandlers.onEdit).toHaveBeenCalledWith(mockWorkspace);
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    // Mock window.confirm
    window.confirm = jest.fn(() => true);
    
    render(<WorkspaceCard workspace={mockWorkspace} {...mockHandlers} />);
    
    const card = screen.getByText('Test Workspace').closest('a');
    await user.hover(card);
    
    const deleteButton = screen.getByTitle('Delete workspace');
    await user.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockHandlers.onDelete).toHaveBeenCalledWith(mockWorkspace.id);
  });

  it('handles workspace without description', () => {
    const workspaceWithoutDesc = { ...mockWorkspace, description: '' };
    render(<WorkspaceCard workspace={workspaceWithoutDesc} {...mockHandlers} />);
    expect(screen.getByText('Test Workspace')).toBeInTheDocument();
  });
});

