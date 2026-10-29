import { MockUser } from '@/types';

// TODO: Hubungkan dengan database autentikasi pengguna riil (OTP WhatsApp / Google Auth)
// Data pengguna placeholder awal:
export const mockUsers: MockUser[] = [
  {
    id: 'user-1',
    name: 'Ibu Nadia Pratiwi',
    email: 'nadia@temankasih.id',
    phone: '081200001111',
    password: 'kasih123',
    trimesterLabel: 'Trimester 1',
  },
  {
    id: 'user-2',
    name: 'Ibu Raras Wulandari',
    email: 'raras@temankasih.id',
    phone: '081200002222',
    password: 'kasih123',
    trimesterLabel: 'Trimester 2',
  },
  {
    id: 'user-3',
    name: 'Ibu Sinta Maharani',
    email: 'sinta@temankasih.id',
    phone: '081200003333',
    password: 'kasih123',
    trimesterLabel: 'Trimester 3',
  },
];
