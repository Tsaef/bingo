import { useState, useEffect, FC } from "react";
import { nanoid } from "nanoid";
import { BingoCell } from "@/components/bingo-cell";
import { BingoCell as BingoCellType } from "@/lib/types";

interface BingoGridProps {
  size: number;
  cells: BingoCellType[];
  isEditable?: boolean;
  onChange?: (cells: BingoCellType[]) => void;
}

export const BingoGrid: FC<BingoGridProps> = ({
  size,
  cells: initialCells,
  isEditable = true,
  onChange,
}) => {
  const [cells, setCells] = useState<BingoCellType[]>(initialCells);
  const [selectedCellId, setSelectedCellId] = useState<string | null>(null);

  // Initialize cells if they don't exist
  useEffect(() => {
    if (cells.length !== size * size) {
      const newCells: BingoCellType[] = [];
      for (let i = 0; i < size * size; i++) {
        newCells.push({
          id: nanoid(),
          text: "",
        });
      }
      setCells(newCells);
      onChange?.(newCells);
    }
  }, [size, cells.length, onChange]);

  const handleCellChange = (id: string, text: string) => {
    const updatedCells = cells.map((cell) =>
      cell.id === id ? { ...cell, text } : cell
    );
    setCells(updatedCells);
    onChange?.(updatedCells);
  };

  const isCenterCell = (index: number) => {
    // Only odd-sized grids have a true center
    if (size % 2 === 1) {
      const centerIndex = Math.floor(size * size / 2);
      return index === centerIndex;
    }
    return false;
  };

  return (
    <div
      className="grid gap-1 w-full max-w-[600px] mx-auto"
      style={{
        gridTemplateColumns: `repeat(${size}, 1fr)`,
      }}
    >
      {cells.map((cell, index) => (
        <BingoCell
          key={cell.id}
          id={cell.id}
          value={cell.text}
          onChange={handleCellChange}
          isCenter={isCenterCell(index)}
          isEditable={isEditable}
          isSelected={cell.id === selectedCellId}
          onSelect={() => isEditable ? null : setSelectedCellId(cell.id === selectedCellId ? null : cell.id)}
        />
      ))}
    </div>
  );
};
