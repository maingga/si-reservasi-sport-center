import { Users, LogOut, Settings } from 'lucide-react'; // Impor ikon

export default function AdminDashboard() {
  return (
    <div className="flex flex-col space-y-8 p-6">
      {/* Bagian Selamat Datang */}
      <section className="text-center bg-white p-6 rounded-lg shadow-lg">
        <p className="text-lg text-gray-600">Kelola platform Anda dengan efisien dan pantau semua metrik penting di sini.</p>
      </section>

      {/* Kartu Statistik */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Kartu Total Pengguna */}
        <div className="bg-white shadow-xl rounded-lg p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Total Pengguna</h2>
            <p className="text-3xl font-bold text-blue-600">1.245</p>
          </div>
          <div className="bg-blue-100 p-4 rounded-lg text-blue-600">
            <Users size={40} />
          </div>
        </div>

        {/* Kartu Sesi Aktif */}
        <div className="bg-white shadow-xl rounded-lg p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Sesi Aktif</h2>
            <p className="text-3xl font-bold text-green-600">120</p>
          </div>
          <div className="bg-green-100 p-4 rounded-lg text-green-600">
            <LogOut size={40} />
          </div>
        </div>

        {/* Kartu Total Reservasi */}
        <div className="bg-white shadow-xl rounded-lg p-6 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Total Reservasi</h2>
            <p className="text-3xl font-bold text-orange-600">345</p>
          </div>
          <div className="bg-orange-100 p-4 rounded-lg text-orange-600">
            <Settings size={40} />
          </div>
        </div>
      </section>

      {/* Bagian Aktivitas Terbaru */}
      <section className="bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-4">
            <p className="text-gray-600">Pengguna John Doe telah membuat reservasi selama 2 jam.</p>
            <span className="text-sm text-gray-500">2 menit yang lalu</span>
          </div>
          <div className="flex justify-between items-center border-b pb-4">
            <p className="text-gray-600">Pendaftaran pengguna baru: Alice Johnson.</p>
            <span className="text-sm text-gray-500">30 menit yang lalu</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-gray-600">Pengaturan telah diperbarui oleh Admin.</p>
            <span className="text-sm text-gray-500">1 jam yang lalu</span>
          </div>
        </div>
      </section>
    </div>
  );
}