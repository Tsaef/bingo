import { apiService } from './httpService';
import { API_ROUTES } from '@/constants/apiConstants';
import { BingoCell, BingoGrid } from '@/lib/types';

export interface CreateBingoGridRequest {
  size: number;
  cells: BingoCell[];
}

export interface CreateBingoGridResponse {
  id: string;
  size: number;
  cells: BingoCell[];
  createdAt: string;
}

class BingoService {
  async createGrid(data: CreateBingoGridRequest) {
    return apiService.post<CreateBingoGridResponse>(
      API_ROUTES.BINGO.CREATE_GRID,
      data
    );
  }

  async getGrid(id: string) {
    return apiService.get<BingoGrid>(
      API_ROUTES.BINGO.GET_GRID(id)
    );
  }
}

export const bingoService = new BingoService();
