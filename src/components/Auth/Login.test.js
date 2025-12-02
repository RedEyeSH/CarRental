import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

// Mock react-i18next to handle translations in tests
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key, // Mock translation function
    }),
}));

describe('Login Component', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        mockOnClose.mockClear();
    });

    test("renders the Login component with correct elements", () => {
        const mockOnSwitch = jest.fn();

        render(<Login onClose={mockOnClose} onSwitch={mockOnSwitch} />);

        const titleElement = screen.getByRole("heading", { name: /car rental/i });
        expect(titleElement).toBeInTheDocument();

        const emailInput = screen.getByLabelText(/login.email/i);
        expect(emailInput).toBeInTheDocument();

        const passwordInput = screen.getByLabelText(/login.password/i);
        expect(passwordInput).toBeInTheDocument();

        const submitButton = screen.getByRole("button", { name: /login.signIn/i });
        expect(submitButton).toBeInTheDocument();
    });

    test('calls onClose when overlay is clicked', () => {
        render(<Login onClose={mockOnClose} />);

        const overlay = document.querySelector('.overlay');
        fireEvent.click(overlay);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when close icon is clicked', () => {
        render(<Login onClose={mockOnClose} />);

        const closeIcon = screen.getByRole('img', { hidden: true });
        fireEvent.click(closeIcon);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
});