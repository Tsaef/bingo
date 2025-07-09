"use client";

import {useEffect, useState} from "react";
import {useParams} from "next/navigation";
import {BingoGrid as BingoGridType} from "@/lib/types";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import Link from "next/link";
import {motion} from "framer-motion";
import {toast} from "sonner";
import {cn} from "@/lib/utils";
import {bingoService} from "@/services/bingoService";
import Footer from "@/components/footer";

type CellState = 'NONE' | 'SELECTED' | 'VALIDATED';

type CellStates = Record<string, CellState>;

export default function BingoPage() {
  const params = useParams();
  const bingoId = typeof params.id === "string" ? params.id : "";
  const [bingoData, setBingoData] = useState<BingoGridType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cellStates, setCellStates] = useState<CellStates>({});

  useEffect(() => {
    const fetchBingoData = async () => {
      try {
        setLoading(true);
        const response = await bingoService.getGrid(bingoId);

        if (response.error) {
          if (response.status === 404) {
            setError("Bingo grid not found");
          } else {
            setError(response.error);
          }
          return;
        }

        if (!response.data) {
          setError("No data received");
          return;
        }

        setBingoData({
          ...response.data,
          createdAt: new Date(response.data.createdAt),
        });

        // Initialize all cells to NONE state
        const initialStates: CellStates = {};
        response.data.cells.forEach(cell => {
          initialStates[cell.id] = 'NONE';
        });
        setCellStates(initialStates);
      } catch (err) {
        setError("Failed to load bingo grid");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (bingoId) {
      fetchBingoData();
    }
  }, [bingoId]);

  const handleCellClick = (cellId: string) => {
    setCellStates(prev => {
      const currentState = prev[cellId];
      let newState: CellState;

      if (currentState === 'VALIDATED') {
        // If validated, clicking makes it unselected and breaks the line
        newState = 'NONE';
        // Remove validation from incomplete lines
        setTimeout(() => updateValidatedLines(), 0);
      } else if (currentState === 'SELECTED') {
        // If selected, clicking makes it unselected
        newState = 'NONE';
      } else {
        // If none, clicking makes it selected
        newState = 'SELECTED';
      }

      return { ...prev, [cellId]: newState };
    });
  };

  const updateValidatedLines = () => {
    if (!bingoData) return;

    setCellStates(prev => {
      const newStates = { ...prev };
      const size = bingoData.size;

      // First, downgrade all VALIDATED cells to SELECTED
      Object.keys(newStates).forEach(cellId => {
        if (newStates[cellId] === 'VALIDATED') {
          newStates[cellId] = 'SELECTED';
        }
      });

      // Then check which lines are still complete and re-validate them
      const isSelected = (cellId: string) => newStates[cellId] === 'SELECTED';
      const lines = getAllLines(size);

      lines.forEach(line => {
        const lineCellIds = line.map(index => bingoData.cells[index].id);
        if (lineCellIds.every(isSelected)) {
          // This line is complete, validate all its cells
          lineCellIds.forEach(cellId => {
            newStates[cellId] = 'VALIDATED';
          });
        }
      });

      return newStates;
    });
  };

  const getAllLines = (size: number): number[][] => {
    const lines: number[][] = [];

    // Rows
    for (let row = 0; row < size; row++) {
      const line = [];
      for (let col = 0; col < size; col++) {
        line.push(row * size + col);
      }
      lines.push(line);
    }

    // Columns
    for (let col = 0; col < size; col++) {
      const line = [];
      for (let row = 0; row < size; row++) {
        line.push(row * size + col);
      }
      lines.push(line);
    }

    // Main diagonal
    const mainDiagonal = [];
    for (let i = 0; i < size; i++) {
      mainDiagonal.push(i * size + i);
    }
    lines.push(mainDiagonal);

    // Anti-diagonal
    const antiDiagonal = [];
    for (let i = 0; i < size; i++) {
      antiDiagonal.push(i * size + (size - 1 - i));
    }
    lines.push(antiDiagonal);

    return lines;
  };

  const checkForBingo = (): boolean => {
    if (!bingoData) return false;

    const size = bingoData.size;
    const lines = getAllLines(size);

    return lines.some(line => {
      const lineCellIds = line.map(index => bingoData.cells[index].id);
      const isLineComplete = lineCellIds.every(cellId =>
        cellStates[cellId] === 'SELECTED' || cellStates[cellId] === 'VALIDATED'
      );
      const hasUnvalidatedCell = lineCellIds.some(cellId =>
        cellStates[cellId] === 'SELECTED'
      );

      return isLineComplete && hasUnvalidatedCell;
    });
  };

  const handleCheckBingo = () => {
    if (!bingoData) return;

    const size = bingoData.size;
    const lines = getAllLines(size);
    let foundNewBingo = false;

    // First, check what needs to be validated and prepare the new states
    const statesToUpdate: { [cellId: string]: CellState } = {};

    lines.forEach(line => {
      const lineCellIds = line.map(index => bingoData.cells[index].id);
      const isLineComplete = lineCellIds.every(cellId =>
        cellStates[cellId] === 'SELECTED' || cellStates[cellId] === 'VALIDATED'
      );
      const hasUnvalidatedCell = lineCellIds.some(cellId =>
        cellStates[cellId] === 'SELECTED'
      );

      if (isLineComplete && hasUnvalidatedCell) {
        // Mark this line for validation
        lineCellIds.forEach(cellId => {
          statesToUpdate[cellId] = 'VALIDATED';
        });
        foundNewBingo = true;
      }
    });

    // Then update the states if there are changes
    if (Object.keys(statesToUpdate).length > 0) {
      setCellStates(prev => ({
        ...prev,
        ...statesToUpdate
      }));
    }

    if (foundNewBingo) {
      toast.success("BINGO! You got a line!");
    } else {
      toast.info("Not yet! Keep playing!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-xl">Loading bingo grid...</div>
      </div>
    );
  }

  if (error || !bingoData) {
    return (
      <div className="min-h-screen p-4 md:p-8 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <Card className="w-full max-w-md mx-auto mt-10">
            <CardHeader>
              <CardTitle className="text-2xl text-red-500">Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{error || "Failed to load bingo grid"}</p>
            </CardContent>
            <CardFooter>
              <Link href="/" passHref>
                <Button>Back to Home</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  const hasPotentialBingo = checkForBingo();

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <header className="py-6 mb-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Bingo Time!</h1>
          <p className="text-gray-600">
            Cliquez sur les cases pour les sélectionner. Complétez une ligne pour gagner !
          </p>
        </header>
        
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl sm:text-2xl text-center">Grille de bingo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2 w-full max-w-[600px] mx-auto"
                 style={{ gridTemplateColumns: `repeat(${bingoData.size}, 1fr)` }}>
              {bingoData.cells.map((cell, index) => {
                const cellState = cellStates[cell.id] || 'NONE';
                return (
                  <motion.div
                    key={cell.id}
                    className={cn(
                      "aspect-square cursor-pointer flex items-center justify-center rounded-md border p-2 text-center bg-white border-gray-200 transition hover:scale-105 active:scale-95",
                      cellState === 'SELECTED' && "bg-primary text-primary-foreground border-primary",
                      cellState === 'VALIDATED' && "bg-green-700 text-white font-bold"
                    )}
                    onClick={() => handleCellClick(cell.id)}
                  >
                    <span className="line-clamp-3 text-sm sm:text-base">
                      {cell.text || (bingoData.size % 2 === 1 && index === Math.floor(bingoData.size * bingoData.size / 2) ? "FREE" : "")}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={handleCheckBingo}
              className={cn("w-full sm:w-auto", hasPotentialBingo ? "animate-wiggle" : "")}
              variant="default"
            >
              Vérifier le Bingo
            </Button>
            <Link href="/" className="w-full sm:w-auto">
              <Button 
                className="w-full"
                variant="outline"
              >
                Retour à l'accueil
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Footer />
      </div>
    </div>
  );
}
