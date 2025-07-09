// Defines the types for our bingo app
export interface BingoCell {
  id: string;
  text: string;
}

export interface BingoGrid {
  id: string;
  size: number;
  cells: BingoCell[];
  createdAt: Date;
}
