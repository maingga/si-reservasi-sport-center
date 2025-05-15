'use client';

import { useEffect, useState } from 'react';
import { api } from '@/app/utils/api';
import { Dropdown } from '../ui/dropdown/Dropdown';
import { DropdownItem } from '../ui/dropdown/DropdownItem';
import { Bell, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface Transaction {
  id: number;
  status: string;
}

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await api.get('/transactions');
        const data: Transaction[] = response.data;
        const pending = data.filter(tx => tx.status === 'pending');
        setNotifications(pending);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  const renderIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <AlertCircle className="text-yellow-500 w-4 h-4 mr-2" />;
      case 'success':
        return <CheckCircle className="text-green-500 w-4 h-4 mr-2" />;
      default:
        return <AlertCircle className="text-gray-500 w-4 h-4 mr-2" />;
    }
  };

  return (
    <div className="relative inline-block">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="dropdown-toggle relative"
        variant="ghost"
        size="icon"
      >
        <Bell className="w-5 h-5" />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {notifications.length}
          </span>
        )}
      </Button>

      <Dropdown
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        className="w-80 max-h-96 overflow-y-auto divide-y divide-gray-200"
      >
        <div className="px-4 py-3 text-sm font-semibold text-gray-700">Notifikasi Transaksi</div>

        {loading ? (
          <div className="px-4 py-3 flex items-center text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Memuat notifikasi...
          </div>
        ) : notifications.length === 0 ? (
          <div className="px-4 py-3 text-sm text-gray-500">Tidak ada notifikasi baru.</div>
        ) : (
          notifications.map((notif) => (
            <DropdownItem
              key={notif.id}
              tag="a"
              href={`/admin/transactions/${notif.id}`}
              className="flex items-center"
            >
              {renderIcon(notif.status)}
              <div>
                <p className="font-medium">Transaksi #{notif.id}</p>
                <p className="text-xs text-gray-500 capitalize">{notif.status}</p>
              </div>
            </DropdownItem>
          ))
        )}

        <div className="px-4 py-2 text-center">
          <Link href="/admin/transactions" className="text-sm text-blue-600 hover:underline">
            Lihat semua transaksi
          </Link>
        </div>
      </Dropdown>
    </div>
  );
}
