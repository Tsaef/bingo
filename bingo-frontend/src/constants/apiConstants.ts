export const API_ROUTES = {
  BINGO: {
    CREATE_GRID: '/api/bingo/grids',
    GET_GRID: (id: string) => `/api/bingo/grids/${id}`,
  },
} as const;

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  TIMEOUT: 10000, // 10 seconds
} as const;
