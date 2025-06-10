'use client';
import React, { useState } from 'react';
import { api } from '@/app/utils/api';
import { AxiosError } from 'axios';

interface User {
id: number;
name: string;
email: string;
role: string;
phone: string;
photo?: string;
}

interface UserInfoCardProps {
user: User;
setUser: React.Dispatch<React.SetStateAction<User | null>>;
    }

    export default function UserInfoCard({ user, setUser }: UserInfoCardProps) {
    const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    password: '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
    const res = await api.put<{ success: boolean; user: User }>('/profile/update', form);
        if (res.data.success) {
        setUser(res.data.user);
        alert('Profile updated successfully!');
        setForm(prev => ({ ...prev, password: '' })); // reset password field
        } else {
        alert('Gagal update profil.');
        }
        } catch (error: unknown) {
        if (error instanceof AxiosError) {
        console.error('Axios error updating profile:', error.response?.data || error.message);
        } else {
        console.error('Unexpected error:', error);
        }
        alert('Gagal update profil.');
        } finally {
        setLoading(false);
        }
        };

        return (
        <form onSubmit={handleSubmit}
            className="p-6 border border-gray-200 rounded-lg bg-white shadow-sm 
                    dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Edit Profile</h4>

            <div>
                <label htmlFor="name" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    Name
                </label>
                <input id="name" type="text" value={form.name} onChange={(e)=> setForm({ ...form, name:
                e.target.value })}
                className="w-full rounded border border-gray-300 px-3 py-2 
                     text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                     dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                required
                disabled={loading}
                />
            </div>

            <div>
                <label htmlFor="email" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    Email
                </label>
                <input id="email" type="email" value={form.email} onChange={(e)=> setForm({ ...form, email:
                e.target.value })}
                className="w-full rounded border border-gray-300 px-3 py-2 
                     text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                     dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                required
                disabled={loading}
                />
            </div>

            <div>
                <label htmlFor="password" className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
                    New Password
                </label>
                <input id="password" type="password" placeholder="Leave blank if not changing" value={form.password}
                    onChange={(e)=> setForm({ ...form, password: e.target.value })}
                className="w-full rounded border border-gray-300 px-3 py-2 
                     text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
                     dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
                disabled={loading}
                />
            </div>
            
            <div className="mt-4">
                <button type="submit" disabled={loading} className={`w-full rounded bg-blue-600 px-4 py-2 text-white
                    font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:bg-blue-500 dark:hover:bg-blue-600
                    dark:focus:ring-blue-700 transition-colors duration-200 disabled:opacity-50
                    disabled:cursor-not-allowed`}>
                    {loading ? 'Updating...' : 'Update Profile'}
                </button>
            </div>
        </form>
        );
        }
