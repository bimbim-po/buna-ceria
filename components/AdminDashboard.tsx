'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Check,
  Edit3,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
  UserPlus,
  Users,
  X,
} from 'lucide-react';
import {
  adminDeleteModule,
  adminDeleteUser,
  adminResetModules,
  adminSaveModule,
  adminSaveUser,
  getAllUsers,
  getModules,
  getUserProgress,
} from '@/lib/api';
import { useApp } from '@/context/AppContext';
import { MockUser, ModuleItem } from '@/types';

export function AdminDashboard() {
  const { refreshData } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'modules'>('users');
  const [users, setUsers] = useState<MockUser[]>(() => getAllUsers());
  const [modules, setModules] = useState<ModuleItem[]>(() => getModules());
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // State Form Edit / Tambah User
  const [editingUser, setEditingUser] = useState<MockUser | null>(null);

  // State Form Edit / Tambah Materi
  const [editingModule, setEditingModule] = useState<{
    id: string;
    order: number;
    title: string;
    category: string;
    readingTimeMinutes: number;
    summary: string;
    bodyText: string;
  } | null>(null);

  const notify = (msg: string) => {
    setStatusMessage(msg);
    window.setTimeout(() => setStatusMessage(null), 3200);
  };

  const handleSaveUserForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.name.trim() || !editingUser.email.trim()) {
      return;
    }
    const updated = adminSaveUser(editingUser);
    setUsers(updated);
    setEditingUser(null);
    refreshData();
    notify('Data pengguna berhasil disimpan.');
  };

  const handleDeleteUserClick = (userId: string) => {
    const updated = adminDeleteUser(userId);
    setUsers(updated);
    refreshData();
    notify('Data pengguna berhasil dihapus.');
  };

  const openEditModuleForm = (mod?: ModuleItem) => {
    if (mod) {
      const paragraphs = mod.content
        .map((block) => {
          if (block.type === 'paragraph' || block.type === 'subheading') {
            return block.text;
          }
          if (block.type === 'callout') {
            return `${block.title}: ${block.text}`;
          }
          if (block.type === 'list') {
            return block.items.join('\n');
          }
          return '';
        })
        .filter(Boolean)
        .join('\n\n');

      setEditingModule({
        id: mod.id,
        order: mod.order,
        title: mod.title,
        category: mod.category,
        readingTimeMinutes: mod.readingTimeMinutes,
        summary: mod.summary,
        bodyText: paragraphs,
      });
    } else {
      setEditingModule({
        id: `materi-${Date.now()}`,
        order: modules.length + 1,
        title: '',
        category: 'Edukasi Kehamilan & Nifas',
        readingTimeMinutes: 5,
        summary: '',
        bodyText: '',
      });
    }
  };

  const handleSaveModuleForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingModule || !editingModule.title.trim()) return;

    const existing = modules.find((m) => m.id === editingModule.id);
    const paragraphs = editingModule.bodyText
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean);

    const newMod: ModuleItem = {
      id: editingModule.id,
      order: Number(editingModule.order) || modules.length + 1,
      title: editingModule.title.trim(),
      category: editingModule.category.trim() || 'Materi Kehamilan',
      readingTimeMinutes: Number(editingModule.readingTimeMinutes) || 4,
      summary:
        editingModule.summary.trim() ||
        'Panduan terstruktur untuk mendukung kesehatan dan ketenangan Bunda.',
      content:
        paragraphs.length > 0
          ? paragraphs.map((text, idx) =>
              idx === 0 && paragraphs.length > 2
                ? { type: 'paragraph' as const, text }
                : { type: 'paragraph' as const, text }
            )
          : existing?.content ?? [
              {
                type: 'paragraph',
                text: 'Materi pembelajaran kehamilan Buna Ceria.',
              },
            ],
    };

    const updated = adminSaveModule(newMod);
    setModules(updated);
    setEditingModule(null);
    refreshData();
    notify('Materi pembelajaran berhasil disimpan & diperbarui.');
  };

  const handleDeleteModuleClick = (moduleId: string) => {
    const updated = adminDeleteModule(moduleId);
    setModules(updated);
    refreshData();
    notify('Materi berhasil dihapus.');
  };

  const handleResetDefaultModules = () => {
    const reset = adminResetModules();
    setModules(reset);
    refreshData();
    notify('Daftar materi dikembalikan ke pengaturan awal.');
  };

  return (
    <div className="space-y-6">
      {/* Header Banner Admin */}
      <div className="rounded-[24px] border border-[#ECE7F2] bg-gradient-to-r from-[#F4F7EA] via-[#FFFAF0] to-[#FFF5F7] p-6 sm:p-7 shadow-2xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#56632A] px-3.5 py-1 text-xs font-bold text-white">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Panel Khusus Admin Buna Ceria</span>
            </span>
            <h1 className="mt-2.5 font-heading text-2xl sm:text-3xl font-bold text-[#2A2D22]">
              Kelola Pengguna &amp; Materi Pembelajaran
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-[#6E6A6C]">
              Sesuai hak akses Admin: kelola user yang mendaftar serta edit dan
              tambahkan materi pembelajaran di dalam WebApp.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#ECE7F2] bg-white p-1.5 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('users')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'users'
                  ? 'bg-[#C84B71] text-white shadow-2xs'
                  : 'text-[#6E6A6C] hover:text-[#2A2D22]'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span>Kelola User ({users.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('modules')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'modules'
                  ? 'bg-[#56632A] text-white shadow-2xs'
                  : 'text-[#6E6A6C] hover:text-[#2A2D22]'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Kelola Materi ({modules.length})</span>
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-xs sm:text-sm font-bold text-green-800">
          <Check className="h-4 w-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* TAB 1: KELOLA USER YANG MENDAFTAR */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#2A2D22]">
                Daftar Pengguna Terdaftar
              </h2>
              <p className="text-xs text-[#767A6E]">
                Pantau pengguna yang mendaftar, progres belajar, atau tambahkan
                akun baru.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setEditingUser({
                  id: `user-${Date.now()}`,
                  name: '',
                  email: '',
                  phone: '',
                  password: 'kasih123',
                  trimesterLabel: 'Trimester 1',
                  role: 'user',
                })
              }
              className="inline-flex items-center gap-2 rounded-full bg-[#C84B71] px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#b23b60] cursor-pointer"
            >
              <UserPlus className="h-3.5 w-3.5" />
              <span>Tambah User Baru</span>
            </button>
          </div>

          <div className="overflow-hidden rounded-[22px] border border-[#ECE7F2] bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#F0ECF5] bg-[#FAF8FC] text-[11px] font-bold uppercase tracking-wider text-[#767A6E]">
                    <th className="py-3.5 px-4">Nama Pengguna</th>
                    <th className="py-3.5 px-4">Email &amp; WhatsApp</th>
                    <th className="py-3.5 px-4">Kategori / Role</th>
                    <th className="py-3.5 px-4">Progres Belajar</th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0ECF5] text-xs sm:text-sm">
                  {users.map((u) => {
                    const prog = getUserProgress(u.id);
                    return (
                      <tr key={u.id} className="hover:bg-[#FAF8FC]/60">
                        <td className="py-3.5 px-4 font-bold text-[#2A2D22]">
                          {u.name}
                        </td>
                        <td className="py-3.5 px-4 text-[#6E6A6C]">
                          <div>{u.email}</div>
                          <div className="text-[11px] text-[#8C8896]">
                            WA: {u.phone} • Sandi: {u.password}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                              u.role === 'admin'
                                ? 'bg-[#F5F7EA] text-[#56632A]'
                                : 'bg-[#FDF2F5] text-[#C84B71]'
                            }`}
                          >
                            {u.role === 'admin'
                              ? 'Admin'
                              : u.trimesterLabel || 'Ibu Hamil'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[#6E6A6C]">
                          <span>
                            {prog.completedModuleIds.length} Materi •{' '}
                            {prog.completedStageIds.length}/4 Level
                          </span>
                          {prog.bestQuizScore !== null && (
                            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-[11px] font-bold text-green-700">
                              Quiz: {prog.bestQuizScore}%
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1.5">
                          <button
                            type="button"
                            onClick={() => setEditingUser({ ...u })}
                            className="inline-flex items-center gap-1 rounded-full border border-[#ECE7F2] bg-white px-3 py-1 text-xs font-semibold text-[#2A2D22] hover:border-pink-200 hover:text-[#C84B71] cursor-pointer"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </button>
                          {u.role !== 'admin' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUserClick(u.id)}
                              className="inline-flex items-center gap-1 rounded-full border border-red-100 bg-red-50/70 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 cursor-pointer"
                            >
                              <Trash2 className="h-3 w-3" />
                              <span>Hapus</span>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MENGEDIT DAN MENAMBAHKAN MATERI */}
      {activeTab === 'modules' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading text-lg font-bold text-[#2A2D22]">
                Daftar Modul &amp; Materi Pembelajaran
              </h2>
              <p className="text-xs text-[#767A6E]">
                Tambahkan materi baru atau ubah isi materi yang tampil kepada
                pengguna.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleResetDefaultModules}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#ECE7F2] bg-white px-4 py-2 text-xs font-semibold text-[#6E6A6C] hover:text-[#2A2D22] cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset Default</span>
              </button>

              <button
                type="button"
                onClick={() => openEditModuleForm()}
                className="inline-flex items-center gap-1.5 rounded-full bg-[#56632A] px-4 py-2.5 text-xs font-bold text-white shadow-2xs hover:bg-[#434e20] cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Materi Baru</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {modules.map((mod) => (
              <div
                key={mod.id}
                className="flex flex-col justify-between rounded-[22px] border border-[#ECE7F2] bg-white p-5 shadow-2xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded-full bg-[#F5F7EA] px-3 py-0.5 text-xs font-bold text-[#56632A]">
                      Materi {mod.order} • {mod.readingTimeMinutes} mnt
                    </span>
                    <span className="text-xs font-semibold text-[#8C8896]">
                      {mod.category}
                    </span>
                  </div>
                  <h3 className="mt-2.5 font-heading text-base sm:text-lg font-bold text-[#2A2D22]">
                    {mod.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[#6E6A6C]">
                    {mod.summary}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-end gap-2 border-t border-[#F0ECF5] pt-3">
                  <button
                    type="button"
                    onClick={() => openEditModuleForm(mod)}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#ECE7F2] bg-[#FAF8FC] px-3.5 py-1.5 text-xs font-bold text-[#2A2D22] hover:border-[#56632A] hover:text-[#56632A] cursor-pointer"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    <span>Edit Materi</span>
                  </button>
                  {modules.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeleteModuleClick(mod.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50/70 px-3.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Hapus</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL FORM EDIT / TAMBAH USER */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-md rounded-[24px] border border-[#ECE7F2] bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-heading text-lg font-bold text-[#2A2D22]">
                Simpan Data Pengguna
              </h3>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveUserForm} className="mt-4 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#2A2D22]">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={editingUser.name}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, name: e.target.value })
                  }
                  placeholder="Contoh: Bunda Putri Ayu"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A2D22]">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  placeholder="putri@bunaceria.id"
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2A2D22]">
                    Nomor WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editingUser.phone}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, phone: e.target.value })
                    }
                    placeholder="0812..."
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2A2D22]">
                    Kata Sandi
                  </label>
                  <input
                    type="text"
                    required
                    value={editingUser.password}
                    onChange={(e) =>
                      setEditingUser({
                        ...editingUser,
                        password: e.target.value,
                      })
                    }
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A2D22]">
                  Trimester Kehamilan
                </label>
                <select
                  value={editingUser.trimesterLabel || 'Trimester 1'}
                  onChange={(e) =>
                    setEditingUser({
                      ...editingUser,
                      trimesterLabel: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs sm:text-sm bg-white"
                >
                  <option value="Trimester 1">Trimester 1</option>
                  <option value="Trimester 2">Trimester 2</option>
                  <option value="Trimester 3">Trimester 3</option>
                  <option value="Masa Nifas & Menyusui">
                    Masa Nifas &amp; Menyusui
                  </option>
                  <option value="Keluarga Pendamping">
                    Keluarga Pendamping
                  </option>
                </select>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#C84B71] px-5 py-2 text-xs font-bold text-white hover:bg-[#b23b60] cursor-pointer"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL FORM EDIT / TAMBAH MATERI */}
      {editingModule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 overflow-y-auto">
          <div className="w-full max-w-xl rounded-[24px] border border-[#ECE7F2] bg-white p-6 shadow-xl my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="font-heading text-lg font-bold text-[#2A2D22]">
                Edit / Tambah Materi Pembelajaran
              </h3>
              <button
                type="button"
                onClick={() => setEditingModule(null)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModuleForm} className="mt-4 space-y-3.5">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#2A2D22]">
                    Judul Materi
                  </label>
                  <input
                    type="text"
                    required
                    value={editingModule.title}
                    onChange={(e) =>
                      setEditingModule({
                        ...editingModule,
                        title: e.target.value,
                      })
                    }
                    placeholder="Contoh: Nutrisi Ibu Hamil & Menyusui"
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#2A2D22]">
                    Urutan &amp; Menit Baca
                  </label>
                  <div className="mt-1 flex gap-1.5">
                    <input
                      type="number"
                      min={1}
                      value={editingModule.order}
                      onChange={(e) =>
                        setEditingModule({
                          ...editingModule,
                          order: Number(e.target.value),
                        })
                      }
                      className="w-1/2 rounded-xl border border-gray-200 px-2.5 py-2 text-xs sm:text-sm"
                      title="Urutan"
                    />
                    <input
                      type="number"
                      min={1}
                      value={editingModule.readingTimeMinutes}
                      onChange={(e) =>
                        setEditingModule({
                          ...editingModule,
                          readingTimeMinutes: Number(e.target.value),
                        })
                      }
                      className="w-1/2 rounded-xl border border-gray-200 px-2.5 py-2 text-xs sm:text-sm"
                      title="Menit baca"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A2D22]">
                  Kategori Materi
                </label>
                <input
                  type="text"
                  value={editingModule.category}
                  onChange={(e) =>
                    setEditingModule({
                      ...editingModule,
                      category: e.target.value,
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A2D22]">
                  Ringkasan Singkat
                </label>
                <input
                  type="text"
                  required
                  value={editingModule.summary}
                  onChange={(e) =>
                    setEditingModule({
                      ...editingModule,
                      summary: e.target.value,
                    })
                  }
                  placeholder="Satu kalimat penjelasan singkat materi..."
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3.5 py-2 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2A2D22]">
                  Isi Materi (Pisahkan paragraf dengan baris kosong)
                </label>
                <textarea
                  rows={5}
                  required
                  value={editingModule.bodyText}
                  onChange={(e) =>
                    setEditingModule({
                      ...editingModule,
                      bodyText: e.target.value,
                    })
                  }
                  placeholder="Tuliskan isi materi edukasi kehamilan di sini..."
                  className="mt-1 w-full rounded-xl border border-gray-200 p-3.5 text-xs sm:text-sm leading-relaxed"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingModule(null)}
                  className="rounded-full px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#56632A] px-5 py-2 text-xs font-bold text-white hover:bg-[#434e20] cursor-pointer"
                >
                  Simpan Materi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
