'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/utils/api';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import { Loader2, User as UserIcon, LogOut, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: string;
}

export default function UserDropdown() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      try {
        setLoading(true);
        const response = await api.get('/me');
        if (response.data.success) {
          setUser(response.data.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const closeDropdown = () => setIsOpen(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const response = await api.post('/logout');
      if (response.data.success) {
        setUser(null);
        router.push('/login');
      } else {
        alert('Logout gagal');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Terjadi kesalahan saat logout');
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block text-left">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="flex items-center gap-2 px-4 py-2 border dark:border-gray-600"
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label="User menu"
      >
        <UserIcon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
          {user ? user.name : 'Loading...'}
        </span>
      </Button>

      <Dropdown isOpen={isOpen} onClose={closeDropdown} className="w-64 mt-2">
        {loading ? (
          <div className="px-4 py-3 flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Memuat data user...
          </div>
        ) : user ? (
          <>
            {/* User Info */}
            <div className="px-4 py-3">
              <p className="font-semibold text-gray-800 dark:text-gray-100">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">Role: {user.role}</p>
            </div>

            <hr className="border-t border-gray-200 dark:border-gray-600 my-1" />

            {/* Actions */}
            <DropdownItem
              tag="a"
              href="/admin/profile"
              onClick={closeDropdown}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Profil</span>
            </DropdownItem>

            <hr className="border-t border-gray-200 dark:border-gray-600 my-1" />

            <DropdownItem
              tag="button"
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </DropdownItem>
          </>
        ) : (
          <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">Gagal memuat data user</div>
        )}
      </Dropdown>
    </div>
  );
}
