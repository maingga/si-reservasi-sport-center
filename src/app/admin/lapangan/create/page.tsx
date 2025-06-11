"use client";
import React, { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { api } from "../../../utils/api";

export default function AdminCreateLapangan() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [type, setType] = useState("Futsal");
  const [status, setStatus] = useState("available");
  const [photo, setPhoto] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price.toString());
    formData.append("description", description);
    formData.append("location", location);
    formData.append("capacity", capacity.toString());
    formData.append("type", type);
    formData.append("status", status);
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      await api.post("/lapangan", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Lapangan berhasil ditambahkan!");
      setName("");
      setPrice(0);
      setDescription("");
      setLocation("");
      setCapacity(0);
      setType("Futsal");
      setStatus("available");
      setPhoto(null);
    } catch (err) {
      console.error(err);
      alert("Gagal menambahkan lapangan.");
    }
  };

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
        Tambah Lapangan Baru
      </h1>
      <form onSubmit={handleSubmit}>
        <ComponentCard title="Form Tambah Lapangan">
          <div className="space-y-6">
            {/* Nama Lapangan */}
            <div className="space-y-2">
              <Label className="mb-1 text-sm font-medium text-muted-foreground">
                Nama Lapangan
              </Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            {/* Harga Sewa */}
            <div className="space-y-2">
              <Label className="mb-1 text-sm font-medium text-muted-foreground">
                Harga Sewa
              </Label>
              <Input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                required
              />
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <Label className="mb-1 text-sm font-medium text-muted-foreground">
                Deskripsi
              </Label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg"
                rows={4}
              />
            </div>

            {/* Lokasi */}
            <div className="space-y-2">
              <Label className="mb-1 text-sm font-medium text-muted-foreground">
                Lokasi
              </Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} required />
            </div>

            {/* Kapasitas */}
            <div className="space-y-2">
              <Label className="mb-1 text-sm font-medium text-muted-foreground">
                Kapasitas
              </Label>
              <Input
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                required
              />
            </div>

            {/* Jenis Lapangan */}
            <div className="space-y-2">
              <Label className="mb-1 text-sm font-medium text-muted-foreground">
                Jenis Lapangan
              </Label>
              <Select value={type} onValueChange={(value) => setType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih jenis lapangan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Futsal">Futsal</SelectItem>
                  <SelectItem value="Badminton">Badminton</SelectItem>
                  <SelectItem value="Basket">Basket</SelectItem>
                  <SelectItem value="Tennis">Tennis</SelectItem>
                  <SelectItem value="Voli">Voli</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label className="mb-1 text-sm font-medium text-muted-foreground">
                Status
              </Label>
              <Select value={status} onValueChange={(value) => setStatus(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Tersedia</SelectItem>
                  <SelectItem value="booked">Sudah Dipesan</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Upload Foto */}
            <div className="space-y-2">
              <Label className="mb-1 text-sm font-medium text-muted-foreground">
                Foto Lapangan (Opsional)
              </Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
              />
            </div>

            {/* Tombol Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            >
              Tambah Lapangan
            </button>
          </div>
        </ComponentCard>
      </form>
    </div>
  );
}
