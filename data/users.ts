import { MockUser } from '@/types';

// Data pengguna terdaftar & Admin sesuai masa nifas Buna Ceria
export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    name: 'Bunda Nadia Pratiwi',
    email: 'nadia@bunaceria.id',
    phone: '081200001111',
    password: 'kasih123',
    trimesterLabel: 'Nifas Hari ke 1-2 Hari',
    role: 'user',
  },
  {
    id: 'user-2',
    name: 'Bunda Raras Wulandari',
    email: 'raras@bunaceria.id',
    phone: '081200002222',
    password: 'kasih123',
    trimesterLabel: 'Nifas Hari ke 3-7 Hari',
    role: 'user',
  },
  {
    id: 'user-3',
    name: 'Bunda Sinta Maharani',
    email: 'sinta@bunaceria.id',
    phone: '081200003333',
    password: 'kasih123',
    trimesterLabel: 'Nifas Hari ke 8-28 Hari',
    role: 'user',
  },
  {
    id: 'admin-1',
    name: 'Kak Faiza (Admin Buna Ceria)',
    email: 'admin@bunaceria.id',
    phone: '085701308514',
    password: 'admin123',
    trimesterLabel: 'Administrator',
    role: 'admin',
  },
];
