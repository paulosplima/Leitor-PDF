
import React, { useState } from 'react';
import { Flashcard } from '../types';

interface Props {
  cards: Flashcard[];
  onClose: () => void;
}

const FlashcardView: React.FC<Props> = ({ cards, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const nextCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
          <h3 className="font-bold text-indigo-900">
            Estudando: {currentIndex + 1} de {cards.length}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="p-10 min-h-[350px] flex flex-col items-center justify-center">
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full h-64 relative cursor-pointer transition-all duration-500 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
          >
            {/* Front */}
            <div className="absolute inset-0 bg-white border-2 border-indigo-100 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-sm [backface-visibility:hidden]">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">Pergunta</span>
              <p className="text-xl font-medium text-slate-800">{currentCard.question}</p>
              <p className="mt-8 text-sm text-slate-400">Clique para ver a resposta</p>
            </div>
            
            {/* Back */}
            <div className="absolute inset-0 bg-indigo-600 rounded-2xl p-8 flex flex-col items-center justify-center text-center shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200 mb-4">Resposta</span>
              <p className="text-xl font-medium text-white">{currentCard.answer}</p>
              <p className="mt-8 text-sm text-indigo-200">Clique para ver a pergunta</p>
            </div>
          </div>
        </div>

        <div className="p-6 bg-slate-50 flex justify-between gap-4">
          <button 
            onClick={prevCard}
            className="flex-1 py-3 px-6 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-600 font-medium transition-all"
          >
            Anterior
          </button>
          <button 
            onClick={nextCard}
            className="flex-1 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md transition-all"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardView;
