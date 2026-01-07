
import React, { useState, useRef, useEffect } from 'react';
import { extractTextFromPDF } from './services/pdfService';
import { generateFlashcards } from './services/geminiService';
import { PDFData, Flashcard, QuizSettings, Difficulty } from './types';
import FlashcardView from './components/FlashcardView';

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pdfData, setPdfData] = useState<PDFData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [showCards, setShowCards] = useState(false);
  
  // Quiz Settings
  const [settings, setSettings] = useState<QuizSettings>({
    count: 5,
    difficulty: Difficulty.MEDIUM
  });

  const speechSynthesisRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (uploadedFile && uploadedFile.type === 'application/pdf') {
      setIsLoading(true);
      try {
        const data = await extractTextFromPDF(uploadedFile);
        setPdfData(data);
        setFile(uploadedFile);
      } catch (error) {
        alert("Erro ao ler o PDF. Tente novamente.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleTTS = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else if (pdfData) {
      const utterance = new SpeechSynthesisUtterance(pdfData.text);
      utterance.lang = 'pt-BR';
      utterance.onend = () => setIsReading(false);
      speechSynthesisRef.current = utterance;
      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  const handleGenerateCards = async () => {
    if (!pdfData) return;
    setIsGenerating(true);
    try {
      const cards = await generateFlashcards(pdfData.text, settings);
      setFlashcards(cards);
      setShowCards(true);
    } catch (error) {
      alert("Erro ao gerar cartões. Verifique sua conexão ou API Key.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPdfData(null);
    setFlashcards([]);
    window.speechSynthesis.cancel();
    setIsReading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="glass sticky top-0 z-40 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={reset}>
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <i className="fa-solid fa-graduation-cap text-white text-xl"></i>
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">matchin<span className="text-indigo-600">.com.br</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Início</a>
            <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Como Funciona</a>
            <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Planos</a>
          </nav>
          <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-slate-800 transition-all">
            Minha Conta
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-12">
        {!pdfData ? (
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
              Transforme seus PDFs em <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">conhecimento</span> vivo.
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed">
              Carregue seus arquivos, ouça o conteúdo e deixe nossa inteligência artificial criar cartões de estudo automáticos para você.
            </p>

            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <label className="relative block w-full border-2 border-dashed border-indigo-200 rounded-3xl p-12 bg-white cursor-pointer hover:border-indigo-400 transition-all hover:shadow-xl">
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {isLoading ? (
                      <i className="fa-solid fa-spinner fa-spin text-3xl text-indigo-600"></i>
                    ) : (
                      <i className="fa-solid fa-cloud-arrow-up text-3xl text-indigo-600"></i>
                    )}
                  </div>
                  <span className="text-xl font-semibold text-slate-800">
                    {isLoading ? 'Processando arquivo...' : 'Arraste ou clique para enviar um PDF'}
                  </span>
                  <p className="mt-2 text-slate-500">Tamanho máximo de 20MB</p>
                </div>
              </label>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Content Controls & Reader */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800 truncate max-w-md">{pdfData.name}</h2>
                    <p className="text-sm text-slate-500">{pdfData.pageCount} páginas detectadas</p>
                  </div>
                  <button 
                    onClick={toggleTTS}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all shadow-sm ${
                      isReading 
                      ? 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    <i className={`fa-solid ${isReading ? 'fa-circle-stop' : 'fa-play'}`}></i>
                    {isReading ? 'Parar Leitura' : 'Ler em Voz Alta'}
                  </button>
                </div>
                
                <div className="max-h-[600px] overflow-y-auto p-4 bg-slate-50 rounded-xl text-slate-700 leading-relaxed whitespace-pre-wrap font-serif border border-slate-100">
                  {pdfData.text || "Nenhum texto extraído deste PDF."}
                </div>
              </div>
            </div>

            {/* Right: AI Tools */}
            <div className="lg:col-span-4 space-y-6 sticky top-24">
              <div className="bg-indigo-900 text-white p-8 rounded-3xl shadow-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-800 rounded-full -mr-16 -mt-16 opacity-50"></div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-6">Gerador de Quiz IA</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-2">Quantidade de Questões</label>
                      <input 
                        type="range" 
                        min="3" 
                        max="20" 
                        value={settings.count}
                        onChange={(e) => setSettings({...settings, count: parseInt(e.target.value)})}
                        className="w-full accent-indigo-400"
                      />
                      <div className="flex justify-between text-xs text-indigo-300 mt-1">
                        <span>3</span>
                        <span className="bg-indigo-700 px-2 py-0.5 rounded text-white font-bold">{settings.count}</span>
                        <span>20</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-indigo-200 mb-3">Nível de Dificuldade</label>
                      <div className="grid grid-cols-3 gap-2">
                        {Object.values(Difficulty).map((diff) => (
                          <button
                            key={diff}
                            onClick={() => setSettings({...settings, difficulty: diff})}
                            className={`py-2 px-1 rounded-xl text-xs font-bold transition-all border ${
                              settings.difficulty === diff 
                              ? 'bg-white text-indigo-900 border-white' 
                              : 'bg-indigo-800 text-indigo-300 border-indigo-700 hover:bg-indigo-700'
                            }`}
                          >
                            {diff}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={handleGenerateCards}
                      disabled={isGenerating}
                      className="w-full bg-indigo-400 hover:bg-indigo-300 text-indigo-950 font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <i className="fa-solid fa-spinner fa-spin"></i>
                          Gerando...
                        </>
                      ) : (
                        <>
                          <i className="fa-solid fa-wand-magic-sparkles"></i>
                          Criar Flashcards
                        </>
                      )}
                    </button>
                    
                    {flashcards.length > 0 && (
                      <button 
                        onClick={() => setShowCards(true)}
                        className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-2xl border border-white/20 transition-all flex items-center justify-center gap-2"
                      >
                        <i className="fa-solid fa-layer-group"></i>
                        Ver {flashcards.length} Cartões
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <button 
                onClick={reset}
                className="w-full py-4 text-slate-500 font-medium hover:text-red-600 transition-colors flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-trash-can"></i>
                Remover arquivo e começar de novo
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <i className="fa-solid fa-graduation-cap text-white text-sm"></i>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">matchin<span className="text-indigo-400">.com.br</span></span>
            </div>
            <p className="max-w-md">
              A MatchIn é uma plataforma brasileira dedicada a potencializar o aprendizado através de IA generativa. Estude de forma mais eficiente com nossas ferramentas automáticas.
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Plataforma</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4">Contato</h4>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-white transition-colors">Suporte</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Vendas</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Parcerias</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-slate-800 text-center text-sm">
          &copy; {new Date().getFullYear()} MatchIn. Todos os direitos reservados.
        </div>
      </footer>

      {/* Modals */}
      {showCards && flashcards.length > 0 && (
        <FlashcardView 
          cards={flashcards} 
          onClose={() => setShowCards(false)} 
        />
      )}
    </div>
  );
};

export default App;
