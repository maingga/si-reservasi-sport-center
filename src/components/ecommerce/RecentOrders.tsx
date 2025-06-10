'use client'

import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import Badge from "../ui/badge/Badge";
import Image from "next/image";
import { api } from "@/app/utils/api";

// Define the TypeScript interface for reservation data
interface RecentReservation {
  id: number;
  reservation_date: string;
  start_time: string;
  end_time: string;
  lapangan: {
    name: string;
  };
  user?: {
    name: string;
    image?: string;
  };
  status: string;
  createdAt: string;
}

export default function RecentReservations() {
  const [reservations, setReservations] = useState<RecentReservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentReservations = async () => {
      try {
        const response = await api.get('/dashboard/recent-reservations');
        setReservations(response.data);
      } catch (error) {
        console.error('Error fetching recent reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentReservations();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'warning';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500 dark:text-gray-400">Memuat data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Reservasi Terbaru
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Reservasi baru masuk
          </p>
        </div>

        <div className="flex items-center gap-3">

          
          
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        {reservations.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-500 dark:text-gray-400">
              Tidak ada reservasi baru yang menunggu konfirmasi
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
              <TableRow>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Pelanggan
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Lapangan
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Tanggal & Waktu
                </TableCell>
                <TableCell
                  isHeader
                  className="py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
              {reservations.map((reservation) => (
                <TableRow key={reservation.id}>
                  <TableCell className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-600">
                        {reservation.user?.image ? (
                          <Image 
                            width={40} 
                            height={40} 
                            src={reservation.user.image} 
                            alt={reservation.user.name} 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm text-gray-500 dark:text-gray-300">
                            {reservation.user?.name?.charAt(0)?.toUpperCase() || '?'}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {reservation.user?.name || 'Tidak diketahui'}
                        </p>
                        <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                          ID #{reservation.id}
                        </span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {reservation.lapangan?.name || '-'}
                  </TableCell>

                  <TableCell className="py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white/90">
                        {formatDate(reservation.reservation_date)}
                      </p>
                      <span className="text-theme-xs text-gray-500 dark:text-gray-400">
                        {reservation.start_time} - {reservation.end_time}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell className="py-3">
                    <Badge
                      size="sm"
                      color={getStatusColor(reservation.status)}
                    >
                      {reservation.status === 'pending' ? 'Menunggu' : reservation.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}