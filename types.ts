
export interface NewsItem {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  timestamp: string;
  author: string;
  url?: string;
}

export enum NewsCategory {
  LATEST = 'Latest',
  INDIA = 'India',
  WORLD = 'World',
  BUSINESS = 'Business',
  SPORTS = 'Sports',
  TECH = 'Tech',
  LIVE = 'Live TV',
  VIDEOS = 'Videos',
  STUDIO = 'Creator Studio'
}

export interface User {
  name: string;
  email: string;
  isLoggedIn: boolean;
}
