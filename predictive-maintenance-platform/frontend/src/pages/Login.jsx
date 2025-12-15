import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        // For hackathon, allow "Magic Link" or just simple bypass if configured
        const { error } = await supabase.auth.signInWithOtp({ email });
        if (error) {
            alert(error.message);
        } else {
            alert('Check your email for the login link!');
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="w-full max-w-md p-8 glass-panel">
                <h1 className="text-3xl font-bold text-center text-primary mb-6">System Access</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400">Email</label>
                        <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 mt-1 bg-surface border border-gray-700 rounded-lg focus:outline-none focus:border-primary text-white"
                        />
                    </div>
                    <button 
                        disabled={loading}
                        className="w-full py-3 mt-4 text-white bg-primary rounded-lg hover:opacity-90 transition-opacity font-semibold"
                    >
                        {loading ? 'Processing...' : 'Send Magic Link'}
                    </button>
                    <div className="text-xs text-center text-gray-500 mt-4">
                        (Use a valid email to receive the Supabase magic link)
                    </div>
                </form>
            </div>
        </div>
    );
}
