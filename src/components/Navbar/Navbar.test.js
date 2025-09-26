import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Navbar from './Navbar.jsx';
import Login from '../Auth/Login';

jest.mock('../Auth/Login', () => jest.fn(({ onClose }) => (
    <div>
        Login Modal
        <button data-icon="x-mark" onClick={onClose}></button>
    </div>
)));
jest.mock('../Auth/Register', () => jest.fn(() => <div>Register Modal</div>));

describe('Navbar Component', () => {
    test('renders Navbar with logo and links', () => {
        render(<Navbar />);
        expect(screen.getByAltText('logo')).toBeInTheDocument();
        expect(screen.getByText('Logo name')).toBeInTheDocument();
        expect(screen.getByText('Products')).toBeInTheDocument();
        expect(screen.getByText('Pricing')).toBeInTheDocument();
        expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    test('opens Login modal when "Sign in" button is clicked', () => {
        render(<Navbar />);
        const signInButton = screen.getByText('Sign in');
        fireEvent.click(signInButton);
        expect(screen.getByText('Login Modal')).toBeInTheDocument();
    });

    test('closes Login modal when "Close" button is clicked', async () => {
        render(<Navbar />);
        const signInButton = screen.getByText('Sign in');
        fireEvent.click(signInButton);
        expect(screen.getByText('Login Modal')).toBeInTheDocument();

        const closeButton = screen.getByRole('button', { name: '' });
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByText('Login Modal')).not.toBeInTheDocument();
        });
    });
});