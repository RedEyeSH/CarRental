import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login';

describe('Login Component', () => {
    const mockOnClose = jest.fn();

    beforeEach(() => {
        mockOnClose.mockClear();
    });

    test('renders the Login component with correct elements', () => {
        render(<Login onClose={mockOnClose} />);

        const headerElement = screen.getByRole('heading', { name: 'App Name' });
        expect(headerElement).toBeInTheDocument();

        const emailInput = screen.getByPlaceholderText('email@domain.com');
        expect(emailInput).toBeInTheDocument();

        const passwordInput = screen.getByPlaceholderText('password');
        expect(passwordInput).toBeInTheDocument();

        const submitButton = screen.getByRole('button', { name: 'Sign in' });
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