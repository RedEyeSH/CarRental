import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from './Register';

// Mock react-i18next to handle translations in tests
jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key) => key, // Mock translation function
    }),
}));

describe('Register Component', () => {
    const mockOnClose = jest.fn();
    const mockOnSwitch = jest.fn();

    beforeEach(() => {
        mockOnClose.mockClear();
        mockOnSwitch.mockClear();
    });

    test('renders the Register component with correct elements', () => {
        render(<Register onClose={mockOnClose} onSwitch={mockOnSwitch} />);

        const headerElement = screen.getByRole('heading', { name: /car rental/i });
        expect(headerElement).toBeInTheDocument();

        const emailInput = screen.getByLabelText(/register.email/i);
        expect(emailInput).toBeInTheDocument();

        const firstNameInput = screen.getByLabelText(/register.firstname/i);
        expect(firstNameInput).toBeInTheDocument();

        const phoneInput = screen.getByLabelText(/register.phone/i);
        expect(phoneInput).toBeInTheDocument();

        const passwordInput = screen.getByLabelText(/register.password/i);
        expect(passwordInput).toBeInTheDocument();

        const confirmPasswordInput = screen.getByLabelText(/register.confirmPassword/i);
        expect(confirmPasswordInput).toBeInTheDocument();

        const submitButton = screen.getByRole('button', { name: /register.signUp/i });
        expect(submitButton).toBeInTheDocument();
    });

    test('calls onClose when overlay is clicked', () => {
        render(<Register onClose={mockOnClose} onSwitch={mockOnSwitch} />);

        const overlay = document.querySelector('.overlay');
        fireEvent.click(overlay);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('calls onClose when close icon is clicked', () => {
        render(<Register onClose={mockOnClose} onSwitch={mockOnSwitch} />);

        const closeIcon = screen.getByRole('img', { hidden: true });
        fireEvent.click(closeIcon);

        expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test('calls onSwitch when "Click here!" is clicked', () => {
        render(<Register onClose={mockOnClose} onSwitch={mockOnSwitch} />);

        const switchLink = screen.getByText(/register.clickHere/i);
        fireEvent.click(switchLink);

        expect(mockOnSwitch).toHaveBeenCalledTimes(1);
    });
});