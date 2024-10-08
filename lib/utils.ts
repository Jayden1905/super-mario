import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type MenuType = {
  name: string
  link: string
}

export const MenuItems: MenuType[] = [
  {
    name: 'Home',
    link: '/',
  },
  {
    name: 'About',
    link: '/about',
  },
  {
    name: 'Services',
    link: '/services',
  },
  {
    name: 'Contact',
    link: '/contact',
  },
]

export const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000' // Fallback for local development
