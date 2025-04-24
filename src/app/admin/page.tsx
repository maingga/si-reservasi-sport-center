import { Users, LogOut, Settings } from 'lucide-react'; // Impor ikon

export default function AdminDashboard() {
  return (
    <div className="p-4 space-y-4">
      {/* Bagian Selamat Datang */}
      <section className="bg-white p-4 rounded-lg">
        <p className="text-sm text-gray-600">Kelola platform Anda dengan mudah.</p>
      </section>

      {/* Kartu Statistik */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Kartu Total Pengguna */}
        <div className="bg-white p-4 rounded-lg flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Total Pengguna</h2>
            <p className="text-xl text-blue-600">1.245</p>
          </div>
          <div className="text-blue-600">
            <Users size={28} />
          </div>
        </div>

        {/* Kartu Sesi Aktif */}
        <div className="bg-white p-4 rounded-lg flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Sesi Aktif</h2>
            <p className="text-xl text-green-600">120</p>
          </div>
          <div className="text-green-600">
            <LogOut size={28} />
          </div>
        </div>

        {/* Kartu Total Reservasi */}
        <div className="bg-white p-4 rounded-lg flex justify-between items-center">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">Total Reservasi</h2>
            <p className="text-xl text-orange-600">345</p>
          </div>
          <div className="text-orange-600">
            <Settings size={28} />
          </div>
        </div>
      </section>

      {/* Aktivitas Terbaru */}
      <section className="bg-white p-4 rounded-lg">
        <h2 className="text-sm font-semibold text-gray-800 mb-2">Aktivitas Terbaru</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-gray-600 text-sm">
            <p>Pengguna Penceng membuat reservasi.</p>
            <span>2 menit yang lalu</span>
          </div>
          <div className="flex justify-between text-gray-600 text-sm">
            <p>Pendaftaran pengguna baru: Squidward.</p>
            <span>30 menit yang lalu</span>
          </div>
          <div className="flex justify-between text-gray-600 text-sm">
            <p>Pengaturan diperbarui oleh Admin.</p>
            <span>1 jam yang lalu</span>
          </div>
        </div>
      </section>
    </div>
  );
}
