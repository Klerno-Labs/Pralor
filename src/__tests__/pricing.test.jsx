import { render, screen, fireEvent } from '@testing-library/react';
import Pricing from '../components/Pricing';

describe('Pricing', () => {
  it('shows Stripe config error when not configured', async () => {
    render(<Pricing onNavigate={() => {}} />);
    const upgradeButton = screen.getByText(/UPGRADE NOW/i);
    fireEvent.click(upgradeButton);
    expect(await screen.findByText(/Stripe is not configured/i)).toBeInTheDocument();
  });
});
