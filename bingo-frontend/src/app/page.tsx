import {BingoCreator} from "@/components/bingo-creator";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <header className="py-4 mb-8 text-center">
          <h1 className="text-4xl font-bold">Créateur de Grille de Bingo</h1>
        </header>

        <main>
          <BingoCreator />
        </main>

        <Footer />
      </div>
    </div>
  );
}
