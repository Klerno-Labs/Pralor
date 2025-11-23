import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Construct from '../components/Construct';
import AuthContext from '../context/AuthContext';

vi.mock('../services/gemini', () => ({
  construct: {
    generate: vi.fn().mockResolvedValue({
      data: {
        name: 'TestCo',
        tagline: 'Tag',
        description: 'Desc',
        targetAudience: ['Builders'],
        revenueModel: [{ model: 'SaaS', description: 'Monthly' }],
        launchStrategy: ['Step'],
        marketSize: '$1M',
        uniqueValue: 'Edge',
        competitors: ['Other']
      }
    })
  }
}));

vi.mock('../services/firestore', () => ({
  saveConstruct: vi.fn().mockResolvedValue({ id: '1', error: null })
}));

const renderWithAuth = (ui) => {
  const authValue = {
    user: { uid: '123' },
    canUseFeature: () => true,
    recordUsage: vi.fn(),
    getRemainingUsage: () => 3,
    tier: 'initiate'
  };
  return render(<AuthContext.Provider value={authValue}>{ui}</AuthContext.Provider>);
};

describe('Construct', () => {
  it('generates a business package', async () => {
    renderWithAuth(<Construct onNavigate={() => {}} />);
    fireEvent.change(screen.getByPlaceholderText(/Describe your idea/i), { target: { value: 'AI tool' } });
    fireEvent.click(screen.getByText(/Generate Business Package/i));
    await waitFor(() => screen.getByText('TestCo'));
    expect(screen.getByText('TestCo')).toBeInTheDocument();
  });
});
