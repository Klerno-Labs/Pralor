import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import Command from '../components/Command';
import AuthContext from '../context/AuthContext';

const renderWithAuth = (ui) => {
  const authValue = {
    user: { uid: '123' },
    canUseFeature: () => true,
    recordUsage: vi.fn()
  };
  return render(<AuthContext.Provider value={authValue}>{ui}</AuthContext.Provider>);
};

describe('Command', () => {
  it('renders generated prompt placeholder', () => {
    renderWithAuth(<Command onNavigate={() => {}} />);
    expect(screen.getByText(/Add blocks to generate your prompt/i)).toBeInTheDocument();
  });
});
