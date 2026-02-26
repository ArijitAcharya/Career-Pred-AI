import { GoogleLogin } from '@react-oauth/google';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';
import { useEffect } from 'react';

export function GoogleButton({ onSuccess, onError }) {
    const { isDarkMode } = useTheme();

    useEffect(() => {
        console.log('GoogleButton mounted');
        console.log('Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
    }, []);

    const handleError = (error) => {
        console.log('Google OAuth error:', error);
        
        // Handle specific error cases (removed sign-in cancelled popup)
        if (error.error === 'access_denied') {
            // Removed toast for sign-in cancelled
        } else if (error.error === 'idpiframe_initialization_failed') {
            // Removed toast for initialization failed
        } else {
            // Only show toast for actual errors, not cancellation
            toast.error('Google sign-in failed');
        }
        
        // Call the original onError if provided
        if (onError) {
            onError(error);
        }
    };

    const handleSuccess = (response) => {
        console.log('Google OAuth success:', response);
        if (onSuccess) {
            onSuccess(response);
        }
    };

    return (
        <div className="w-full flex justify-center">
            <button
                onClick={() => {
                    // Trigger the GoogleLogin component
                    const googleLoginElement = document.querySelector('div[role="button"]');
                    if (googleLoginElement) {
                        googleLoginElement.click();
                    }
                }}
                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 py-2.5 px-4 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-md transition-all duration-300"
            >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06-.56 4.21-1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign in with Google</span>
            </button>
            
            {/* Hidden GoogleLogin component for functionality */}
            <div style={{ display: 'none' }}>
                <GoogleLogin
                    onSuccess={handleSuccess}
                    onError={handleError}
                    theme={isDarkMode ? 'filled_black' : 'outline'}
                    size="large"
                    width="100%"
                    text="signin_with"
                    shape="rectangular"
                    useOneTap={false}
                />
            </div>
        </div>
    );
}
