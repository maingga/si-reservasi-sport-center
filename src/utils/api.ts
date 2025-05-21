import axios from "axios";
import Swal from "sweetalert2";

const API_BASE_URL = "http://localhost:3307/api/reservations"; // sesuai backend Laravel

export const handleConfirm = async (id: number) => {
  try {
    await axios.put(`${API_BASE_URL}/${id}/confirm`);
    Swal.fire("Berhasil", `Reservasi #${id} telah dikonfirmasi.`, "success");
  } catch (error) {
    console.error("Error saat konfirmasi:", error);
    Swal.fire("Gagal", `Gagal mengkonfirmasi reservasi #${id}.`, "error");
  }
};

export const handleCancel = async (id: number) => {
  try {
    await axios.put(`${API_BASE_URL}/${id}/cancel`);
    Swal.fire("Dibatalkan", `Reservasi #${id} telah dibatalkan.`, "info");
  } catch (error) {
    console.error("Error saat cancel:", error);
    Swal.fire("Gagal", `Gagal membatalkan reservasi #${id}.`, "error");
  }
};

export const handleDelete = async (id: number) => {
  Swal.fire({
    title: "Yakin ingin menghapus?",
    text: `Reservasi #${id} akan dihapus permanen.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus",
    cancelButtonText: "Batal",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`);
        Swal.fire("Dihapus!", `Reservasi #${id} telah dihapus.`, "success");
      } catch (error) {
        console.error("Error saat hapus:", error);
        Swal.fire("Gagal", `Gagal menghapus reservasi #${id}.`, "error");
      }
    }
  });
};
