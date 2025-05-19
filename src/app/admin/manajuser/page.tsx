'use client'

import React, { useEffect, useState } from 'react'
import { api } from '../../utils/api'
import { Dialog } from '@headlessui/react'

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

  return (
    <div className="p-6 md:p-10 bg-gray-100 dark:bg-gray-900 min-h-screen text-gray-800 dark:text-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manajemen Pengguna</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Cari nama/email..."
          className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Daftar Pengguna */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Daftar Pengguna</h2>
          {loading && <p>Loading...</p>}
          <ul className="divide-y divide-gray-300 dark:divide-gray-700">
            {filteredUsers.map((u) => (
              <li key={u.id} className="py-3 flex justify-between items-center">
                <div>
                  <p className="font-medium">{u.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{u.email}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchUser(u.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1.5 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => confirmDelete(u.id)}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1.5 rounded-md"
                  >
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Form Edit Pengguna */}
        {user && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Edit Pengguna</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-1">Nama</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Telepon</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'user' | 'admin')}
                  className="w-full px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleUpdate}
                  disabled={loading}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow disabled:opacity-50"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
                <button
                  onClick={resetForm}
                  className="w-full py-2 bg-gray-400 hover:bg-gray-500 text-white font-semibold rounded-md shadow"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}
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

export default UserPage
