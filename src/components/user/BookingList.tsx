export interface Booking {
  id: number;
  lapangan: {
    name: string;
  } | null;
  reservation_date: string;
  start_time: string;
  end_time: string;
  status: string;
}

function getStatusColor(status: string) {
  switch (status.toLowerCase()) {
    case "selesai":
    case "confirmed":
    case "paid":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-400";
    case "pending":
    case "menunggu":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-400";
    case "batal":
    case "cancel":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-400";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

export default function BookingList({ data }: { data: Booking[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 border-collapse border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-3 border border-gray-200 dark:border-gray-600">Lapangan</th>
            <th className="p-3 border border-gray-200 dark:border-gray-600">Tanggal</th>
            <th className="p-3 border border-gray-200 dark:border-gray-600">Jam</th>
            <th className="p-3 border border-gray-200 dark:border-gray-600">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((booking) => (
            <tr
              key={booking.id}
              className="border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              <td className="p-3 border border-gray-200 dark:border-gray-600">{booking.lapangan?.name || "-"}</td>
              <td className="p-3 border border-gray-200 dark:border-gray-600">{booking.reservation_date}</td>
              <td className="p-3 border border-gray-200 dark:border-gray-600">
                {booking.start_time} - {booking.end_time}
              </td>
              <td className="p-3 border border-gray-200 dark:border-gray-600">
                <span
                  className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                    booking.status
                  )} capitalize`}
                >
                  {booking.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
