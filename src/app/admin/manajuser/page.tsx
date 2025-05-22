'use client'

import React, { useEffect, useState } from 'react'
import { api } from '@/app/utils/api'
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import CheckboxComponents from "@/components/form/form-elements/CheckboxComponents";
import DefaultInputs from "@/components/form/form-elements/DefaultInputs";
import DropzoneComponent from "@/components/form/form-elements/DropZone";
import FileInputExample from "@/components/form/form-elements/FileInputExample";
import InputGroup from "@/components/form/form-elements/InputGroup";
import InputStates from "@/components/form/form-elements/InputStates";
import RadioButtons from "@/components/form/form-elements/RadioButtons";
import SelectInputs from "@/components/form/form-elements/SelectInputs";
import TextAreaInput from "@/components/form/form-elements/TextAreaInput";
import ToggleSwitch from "@/components/form/form-elements/ToggleSwitch";
import { Dialog } from '@headlessui/react'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";

interface User {
  id: number
  name: string
  email: string
  phone: string
  role: 'user' | 'admin'
  photo: string | null
}

const UserPage = () => {
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState<'user' | 'admin'>('user')
  const [loading, setLoading] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await api.get('/admin/users')
      setUsers(response.data)
      setFilteredUsers(response.data)
    } catch (error) {
      console.error('Gagal mengambil daftar pengguna:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUser = async (id: number) => {
    setLoading(true)
    try {
      const response = await api.get(`/admin/users/${id}`)
      const data = response.data
      setUser(data)
      setName(data.name)
      setEmail(data.email)
      setPhone(data.phone)
      setRole(data.role)
    } catch (error) {
      console.error('Gagal mengambil detail pengguna:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async () => {
    setLoading(true)
    try {
      await api.put(`/admin/users/${user?.id}`, {
        name,
        email,
        phone,
        role,
      })
      alert('Pengguna berhasil diperbarui!')
      fetchUsers()
      resetForm()
    } catch (error) {
      console.error('Gagal memperbarui pengguna:', error)
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = (id: number) => {
    setDeleteUserId(id)
    setDeleteModal(true)
  }

  const handleDelete = async () => {
    if (deleteUserId === null) return
    setLoading(true)
    try {
      await api.delete(`/admin/users/${deleteUserId}`)
      alert('Pengguna berhasil dihapus!')
      fetchUsers()
    } catch (error) {
      console.error('Gagal menghapus pengguna:', error)
    } finally {
      setLoading(false)
      setDeleteModal(false)
      setDeleteUserId(null)
    }
  }

  const resetForm = () => {
    setUser(null)
    setName('')
    setEmail('')
    setPhone('')
    setRole('user')
  }

  const handleSearch = (term: string) => {
    setSearch(term)
    const filtered = users.filter((u) =>
      `${u.name} ${u.email}`.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredUsers(filtered)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Default placeholder image when user doesn't have a photo
  const defaultUserImage = "/images/user/user-17.jpg"

  return (
    
    <div>
      <PageBreadcrumb pageTitle="Manajemen Pengguna" />
      <div className="space-y-">
        {/* Tabel Pengguna */}
        <ComponentCard title="Daftar Pengguna">
          <div className="mb-4">
            {/* <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Cari nama/email..."
              className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 w-full md:w-64"
            /> */}
          </div>
          
          <div className="grid md:grid-cols-7 gap-8">
            {/* Daftar Pengguna (5/7 columns) */}
            <div className="md:col-span-12 -mt-4">
              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                <div className="max-w-full overflow-x-auto">
                  <div className="min-w-full">
                    <Table>
                      {/* Table Header */}
                      <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                        <TableRow>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Pengguna
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Telepon
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Status
                          </TableCell>
                          <TableCell
                            isHeader
                            className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                          >
                            Aksi
                          </TableCell>
                        </TableRow>
                      </TableHeader>

                      {/* Table Body */}
                      <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                        {loading && (
                          <TableRow>
                            <TableCell className="px-5 py-4 text-center">
                              Loading...
                            </TableCell>
                          </TableRow>
                        )}
                        {!loading && filteredUsers.length === 0 && (
                          <TableRow>
                            <TableCell className="px-5 py-4 text-center">
                              Tidak ada pengguna yang ditemukan
                            </TableCell>
                          </TableRow>
                        )}
                        {!loading &&
                          filteredUsers.map((u) => (
                            <TableRow key={u.id}>
                              <TableCell className="px-5 py-4 sm:px-6 text-start">
                                <div className="flex items-center gap-3">
                                  <div>
                                    <span className="block font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                      {u.name}
                                    </span>
                                    <span className="block text-gray-500 text-theme-xs dark:text-gray-400">
                                      {u.email}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                {u.phone}
                              </TableCell>
                              <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                                <Badge
                                  size="sm"
                                  color={u.role === "admin" ? "success" : "warning"}
                                >
                                  {u.role === "admin" ? "Admin" : "User"}
                                </Badge>
                              </TableCell>
                              <TableCell className="px-4 py-3">
                                <div className="flex gap-2">
                                  
                                  <button
                                    onClick={() => confirmDelete(u.id)}
                                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-md"
                                  >
                                    Hapus
                                  </button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>

            
          </div>
        </ComponentCard>
      </div>

      {/* Modal Konfirmasi Hapus */}
      <Dialog open={deleteModal} onClose={() => setDeleteModal(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-6">
            <Dialog.Title className="text-lg font-semibold">Konfirmasi Hapus</Dialog.Title>
            <Dialog.Description className="text-sm text-gray-500 dark:text-gray-300 mb-4">
              Apakah kamu yakin ingin menghapus pengguna ini? Tindakan ini tidak dapat dibatalkan.
            </Dialog.Description>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-700 text-sm rounded-md"
              >
                Batal
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md"
              >
                {loading ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}

export default UserPage;