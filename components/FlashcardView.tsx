
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
    // Pequeno delay para a animação de flip resetar antes de mudar o conteúdo
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const prevCard = () => {
    setIsFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
    }, 150);
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20">
        {/* Progress Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-indigo-50/50 to-white">
          <div className="flex flex-col">
            <h3 className="font-bold text-indigo-900 leading-tight">Estudando Agora</h3>
            <p className="text-xs text-indigo-400 font-medium uppercase tracking-widest">
              Cartão {currentIndex + 1} de {cards.length}
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Card Container with Perspective */}
        <div className="p-10 min-h-[380px] flex flex-col items-center justify-center bg-slate-50/30 [perspective:1000px]">
          <div 
            onClick={() => setIsFlipped(!isFlipped)}
            className={`w-full h-72 relative cursor-pointer transition-all duration-700 [transform-style:preserve-3d] group ${
              isFlipped ? '[transform:rotateY(180deg)]' : 'hover:scale-[1.02]'
            }`}
          >
            {/* Front Side */}
            <div className="absolute inset-0 bg-white border-2 border-indigo-100 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-md [backface-visibility:hidden]">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <i className="fa-solid fa-circle-question text-indigo-500 text-xl"></i>
              </div>
              <p className="text-xl md:text-2xl font-semibold text-slate-800 leading-tight">
                {currentCard.question}
              </p>
              <div className="absolute bottom-6 flex items-center gap-2 text-indigo-300 font-medium text-xs animate-pulse">
                <span>VER RESPOSTA</span>
                <i className="fa-solid fa-rotate"></i>
              </div>
            </div>
            
            {/* Back Side */}
            <div className="absolute inset-0 bg-indigo-600 rounded-3xl p-8 flex flex-col items-center justify-center text-center shadow-xl [backface-visibility:hidden] [transform:rotateY(180deg)] border-2 border-indigo-500">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-6">
                <i className="fa-solid fa-lightbulb text-white text-xl"></i>
              </div>
              <p className="text-xl md:text-2xl font-medium text-white leading-relaxed">
                {currentCard.answer}
              </p>
              <div className="absolute bottom-6 flex items-center gap-2 text-indigo-200 font-medium text-xs">
                <span>VOLTAR À PERGUNTA</span>
                <i className="fa-solid fa-rotate-left"></i>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 bg-white border-t border-slate-50 flex justify-between gap-4">
          <button 
            onClick={prevCard}
            disabled={cards.length <= 1}
            className="flex-1 py-4 px-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Anterior
          </button>
          <button 
            onClick={nextCard}
            disabled={cards.length <= 1}
            className="flex-1 py-4 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            Próximo
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default FlashcardView;
