"use client"
import { useState } from "react"
import { api } from "../../../utils/api"

export default function AdminCreateLapangan() {
  const [name, setName] = useState("")
  const [price, setPrice] = useState(0)
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [capacity, setCapacity] = useState(0)
  const [type, setType] = useState("Futsal")
  const [status, setStatus] = useState("available")
  const [photo, setPhoto] = useState<File | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", name)
    formData.append("price", price.toString())
    formData.append("description", description)
    formData.append("location", location)
    formData.append("capacity", capacity.toString())
    formData.append("type", type)
    formData.append("status", status)
    if (photo) {
      formData.append("photo", photo)
    }

    try {
      await api.post("/lapangan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      alert("Lapangan berhasil ditambahkan!")
      // Reset form
      setName("")
      setPrice(0)
      setDescription("")
      setLocation("")
      setCapacity(0)
      setType("Futsal")
      setStatus("available")
      setPhoto(null)
    } catch (err) {
      console.error(err)
      alert("Gagal menambahkan lapangan.")
    }
  }

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Tambah Lapangan Baru</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 dark:text-gray-200">Nama Lapangan</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-2 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 dark:text-gray-200">Harga Sewa</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              className="mt-2 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 dark:text-gray-200">Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 dark:text-gray-200">Lokasi</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-2 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 dark:text-gray-200">Kapasitas</label>
            <input
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
              required
              className="mt-2 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 dark:text-gray-200">Jenis Lapangan</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-2 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Futsal">Futsal</option>
              <option value="Badminton">Badminton</option>
              <option value="Basket">Basket</option>
              <option value="Tennis">Tennis</option>
              <option value="Voli">Voli</option>
            </select>
          </div>
          <div className="flex flex-col">
            <label className="font-semibold text-gray-700 dark:text-gray-200">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="mt-2 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="available">Tersedia</option>
              <option value="booked">Sudah Dipesan</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="font-semibold text-gray-700 dark:text-gray-200">Foto Lapangan (Opsional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPhoto(e.target.files?.[0] || null)}
            className="mt-2 p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          Tambah Lapangan
        </button>
      </form>
    </div>
  )
}
