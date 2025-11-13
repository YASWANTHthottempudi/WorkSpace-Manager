import { render, screen } from '@testing-library/react';
import Card from '../Card';

describe('Card Component', () => {
  it('renders children content', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default styling', () => {
    const { container } = render(<Card>Test</Card>);
    const card = container.firstChild;
    // shadcn/ui uses different class names, just verify it renders with card styling
    expect(card).toBeInTheDocument();
    expect(card).toHaveAttribute('data-slot', 'card');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Test</Card>);
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });

  it('passes through additional props', () => {
    render(<Card data-testid="card">Test</Card>);
    expect(screen.getByTestId('card')).toBeInTheDocument();
  });
});

