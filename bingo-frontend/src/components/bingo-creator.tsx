'use client'

import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {BingoGrid} from "@/components/bingo-grid";
import {BingoCell} from "@/lib/types";
import {toast} from "sonner";
import {motion} from "framer-motion";
import {bingoService} from "@/services/bingoService";

export const BingoCreator = () => {
  const [gridSize, setGridSize] = useState(5);
  const [cells, setCells] = useState<BingoCell[]>([]);
  const [bingoId, setBingoId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const handleSizeChange = (size: number) => {
    if (size >= 2 && size <= 5) {
      setGridSize(size);
      // Reset cells when size changes
      setCells([]);
    }
  };

  const validateGrid = () => {
    // Check if any non-center cell is empty
    const centerIndex = gridSize % 2 === 1 ? Math.floor(gridSize * gridSize / 2) : -1;
    
    for (let i = 0; i < cells.length; i++) {
      if (i !== centerIndex && !cells[i].text.trim()) {
        return false;
      }
    }
    return true;
  };

  const handleCreateBingo = async () => {
    if (!validateGrid()) {
      toast.error("Veuillez remplir tous les champs du tableau (le centre n'est pas obligatoire).");
      return;
    }

    try {
      const response = await bingoService.createGrid({
        size: gridSize,
        cells: cells,
      });

      if (response.error) {
        throw new Error(response.error);
      }

      if (!response.data) {
        throw new Error('Aucune donnée reçue du serveur');
      }

      const id = response.data.id;
      setBingoId(id);

      // Create the share URL
      const url = `${window.location.origin}/bingo/${id}`;
      setShareUrl(url);
      setDialogOpen(true);

      toast.success("La grille de bingo a été créée avec succès !");
    } catch (e) {
      console.error('Erreur lors de la création de la grille de bingo:', e);
      toast.error("Une erreur s'est produite lors de la création de la grille de bingo.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("URL copiée dans le presse-papiers !");
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Créez votre grille de bingo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-center gap-4">
          <span className="text-sm font-medium">Taille de la grille:</span>
          <div className="flex gap-2">
            {[2, 3, 4, 5].map((size) => (
              <motion.button
                key={size}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-10 h-10 rounded-md flex items-center justify-center text-sm font-medium ${
                  gridSize === size 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-muted hover:bg-muted/80"
                }`}
                onClick={() => handleSizeChange(size)}
              >
                {size}x{size}
              </motion.button>
            ))}
          </div>
        </div>

        <BingoGrid 
          size={gridSize} 
          cells={cells} 
          onChange={setCells} 
        />

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Grille de Bingo Créée</DialogTitle>
              <DialogDescription>
                Votre grille de bingo a été créée avec succès ! Vous pouvez partager le lien ci-dessous.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2">
              <Input 
                value={shareUrl} 
                readOnly 
                onClick={(e) => e.currentTarget.select()} 
              />
              <Button onClick={copyToClipboard}>Copier</Button>
            </div>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setDialogOpen(false)}
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  window.open(`/bingo/${bingoId}`, '_blank');
                }}
              >
                Open
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleCreateBingo}
          className="w-full"
        >
          Créer la grille de bingo
        </Button>
      </CardFooter>
    </Card>
  );
};
