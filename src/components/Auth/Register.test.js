import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Register from './Register';

describe('Register Component', () => {
    const mockOnClose = jest.fn();
    const mockOnSwitch = jest.fn();

    beforeEach(() => {
        mockOnClose.mockClear();
        mockOnSwitch.mockClear();
    });

    test('renders the Register component with correct elements', () => {
        render(<Register onClose={mockOnClose} onSwitch={mockOnSwitch} />);

        const headerElement = screen.getByRole('heading', { name: 'App Name' });
        expect(headerElement).toBeInTheDocument();

        const emailInput = screen.getByLabelText('Email address');
        expect(emailInput).toBeInTheDocument();

        const firstNameInput = screen.getByLabelText('First name');
        expect(firstNameInput).toBeInTheDocument();

        // Removed the assertion for "Last name" since it doesn't exist in the HTML

        const phoneInput = screen.getByLabelText('Phone number');
        expect(phoneInput).toBeInTheDocument();

        const passwordInput = screen.getByLabelText('Password');
        expect(passwordInput).toBeInTheDocument();

        const confirmPasswordInput = screen.getByLabelText('Confirm password');
        expect(confirmPasswordInput).toBeInTheDocument();

        const submitButton = screen.getByRole('button', { name: 'Sign up with email' });
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

        const switchLink = screen.getByText('Click here!');
        fireEvent.click(switchLink);

        expect(mockOnSwitch).toHaveBeenCalledTimes(1);
    });
});