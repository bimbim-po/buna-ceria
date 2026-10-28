import { MockUser } from '@/types';

// 3 Akun contoh fiktif untuk pengujian alur login Teman Kasih
// Semua alamat email dan nomor telepon adalah contoh fiktif
export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    name: 'Ibu Nadia Pratiwi',
    email: 'nadia.contoh@temankasih.example',
    phone: '081200001111',
    password: 'kasih123',
    trimesterLabel: 'Trimester 1 [Contoh]',
  },
  {
    id: 'user-2',
    name: 'Ibu Raras Wulandari',
    email: 'raras.contoh@temankasih.example',
    phone: '081200002222',
    password: 'kasih123',
    trimesterLabel: 'Trimester 2 [Contoh]',
  },
  {
    id: 'user-3',
    name: 'Ibu Sinta Maharani',
    email: 'sinta.contoh@temankasih.example',
    phone: '081200003333',
    password: 'kasih123',
    trimesterLabel: 'Trimester 3 [Contoh]',
  },
];
