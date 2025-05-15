'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/app/utils/api';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import { Loader2, User as UserIcon, Settings, LifeBuoy, LogOut, Edit3 } from 'lucide-react';
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

  function closeDropdown() {
    setIsOpen(false);
  }

  async function handleLogout() {
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
  }

  return (
    <div className="relative inline-block text-left">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        className="flex items-center space-x-2"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <UserIcon className="w-5 h-5" />
        <span>{user ? user.name : 'Loading...'}</span>
      </Button>

      <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-64 mt-2">
        {loading ? (
          <div className="px-4 py-3 flex items-center text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Memuat data user...
          </div>
        ) : user ? (
          <>
            {/* Info user */}
            <DropdownItem
              tag="button"
              onClick={() => {}}
              baseClassName="cursor-default font-semibold px-4 py-2 text-gray-900"
              className=""
            >
              {user.name}
            </DropdownItem>
            <DropdownItem
              tag="button"
              onClick={() => {}}
              baseClassName="cursor-default text-sm text-gray-600 px-4 py-1"
              className=""
            >
              Email: {user.email}
            </DropdownItem>
            <DropdownItem
              tag="button"
              onClick={() => {}}
              baseClassName="cursor-default text-sm text-gray-600 px-4 py-1 mb-2"
              className=""
            >
              Role: {user.role}
            </DropdownItem>

            <hr className="my-1 border-gray-200" />

            {/* Menu links */}
            <DropdownItem
              tag="a"
              href="/profile"
              onClick={closeDropdown}
              className="flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit profile</span>
            </DropdownItem>

            <DropdownItem
              tag="a"
              href="/settings"
              onClick={closeDropdown}
              className="flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Account settings</span>
            </DropdownItem>

            <DropdownItem
              tag="a"
              href="/support"
              onClick={closeDropdown}
              className="flex items-center space-x-2"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Support</span>
            </DropdownItem>

            <hr className="my-1 border-gray-200" />

            {/* Sign out */}
            <DropdownItem
              tag="button"
              onClick={handleLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </DropdownItem>
          </>
        ) : (
          <div className="px-4 py-3 text-sm text-gray-500">Gagal memuat data user</div>
        )}
      </Dropdown>
    </div>
  );
}
