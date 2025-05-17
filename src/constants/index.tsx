import {
  Home,
  FileText,
  Inbox,
  Users,
  DollarSign,
  ShoppingCart,
  GitCompare,
  Newspaper,
  Book,
  User,
  Settings,
} from 'lucide-react'

export const sidebarItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/auctions', label: 'Auctions', icon: DollarSign },
  { href: '/dashboard/community', label: 'Community', icon: Users },
  { href: '/dashboard/marketplace', label: 'Marketplace', icon: ShoppingCart },
  { href: '/dashboard/blogs', label: 'Blogs', icon: Newspaper },
  { href: '/dashboard/learn', label: 'Learn', icon: Book },
]

export const toolItems = [
  { href: '/dashboard/compare', label: 'Compare', icon: GitCompare },
  { href: '/dashboard/index', label: 'Market Index', icon: FileText },
  { href: '#', label: 'Inbox', icon: Inbox },
]

export const menuItems = [
  {
    href: '/dashboard/profile',
    icon: User,
    label: 'Profile',
    className:
      'text-zinc-200 hover:bg-zinc-800/70 focus:bg-zinc-800/70 cursor-pointer flex items-center gap-2 py-2.5',
  },
  {
    href: '/',
    icon: Settings,
    label: 'Settings',
    className:
      'text-zinc-200 hover:bg-zinc-800/70 focus:bg-zinc-800/70 cursor-pointer flex items-center gap-2 py-2.5',
  },
]

export const watches = [
  {
    id: '1',
    name: 'Rolex Gold',
    model: 'GMT Master II',
    image: '/watch1.png',
  },
  {
    id: '2',
    name: 'Rolex Gold',
    model: 'GMT Master II',
    image: '/watch1.png',
  },
  {
    id: '3',
    name: 'Rolex Gold',
    model: 'GMT Master II',
    image: '/watch1.png',
  },
]

export const upcomingAuctions = [
  {
    id: 1,
    name: 'GMT Master II',
    reference: '#2018-001',
    location: 'France',
    status: 'Upcoming auction',
    image: '/watch1.png',
    currentBid: '€45,000',
    endTime: '2h 15m',

    watchDetails: {
      brand: 'Rolex',
      year: '2018',
      condition: 'Excellent',
      papers: true,
      box: true,
    },
  },
  {
    id: 2,
    name: 'Submariner',
    reference: '#2020-045',
    location: 'Germany',
    status: 'Upcoming auction',
    image: '/watch1.png',
    currentBid: '€38,000',
    endTime: '5h 30m',

    watchDetails: {
      brand: 'Rolex',
      year: '2020',
      condition: 'Very Good',
      papers: true,
      box: true,
    },
  },
  {
    id: 3,
    name: 'Daytona',
    reference: '#2019-167',
    location: 'Italy',
    status: 'Upcoming auction',
    image: '/watch1.png',
    currentBid: '€75,000',
    endTime: '4h 45m',

    watchDetails: {
      brand: 'Rolex',
      year: '2019',
      condition: 'Mint',
      papers: true,
      box: true,
    },
  },
  {
    id: 4,
    name: 'Royal Oak',
    reference: '#2021-089',
    location: 'Spain',
    status: 'Upcoming auction',
    image: '/watch1.png',
    currentBid: '€92,000',
    endTime: '6h',

    watchDetails: {
      brand: 'Audemars Piguet',
      year: '2021',
      condition: 'Excellent',
      papers: true,
      box: true,
    },
  },
]

export const liveAuctions = [
  {
    id: 4,
    name: 'GMT Master II',
    reference: '#2018-004',
    location: 'India',
    status: 'Live auction',
    image: '/watch1.png',
    currentBid: '€52,000',
    endTime: '15m',
    bidders: 12,

    watchDetails: {
      brand: 'Rolex',
      year: '2018',
      condition: 'Mint',
      papers: true,
      box: true,
    },
  },
  {
    id: 6,
    name: 'Royal Oak',
    reference: '#2019-078',
    location: 'Switzerland',
    status: 'Live auction',
    image: '/watch1.png',
    currentBid: '€82,000',
    endTime: '1h 20m',
    bidders: 15,

    watchDetails: {
      brand: 'Audemars Piguet',
      year: '2019',
      condition: 'Mint',
      papers: true,
      box: true,
    },
  },
  {
    id: 7,
    name: 'Nautilus',
    reference: '#2021-256',
    location: 'UAE',
    status: 'Live auction',
    image: '/watch1.png',
    currentBid: '€125,000',
    endTime: '2h',
    bidders: 20,

    watchDetails: {
      brand: 'Patek Philippe',
      year: '2021',
      condition: 'Mint',
      papers: true,
      box: true,
    },
  },
  {
    id: 8,
    name: 'Daytona',
    reference: '#2017-445',
    location: 'UK',
    status: 'Live auction',
    image: '/watch1.png',
    currentBid: '€44,000',
    endTime: '30m',
    bidders: 10,

    watchDetails: {
      brand: 'Rolex',
      year: '2017',
      condition: 'Very Good',
      papers: true,
      box: true,
    },
  },
]
