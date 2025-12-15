'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Question } from '@/app/types/quiz';

interface QuizCardProps {
    questions: Question[];
    weekNumber: number;
    onComplete: (answers: { questionId: number; selectedIndex: number }[]) => void;
}

export default function QuizCard({ questions, weekNumber, onComplete }: QuizCardProps) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
        Array(questions.length).fill(null)
    );
    const [showFeedback, setShowFeedback] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];
    // Progress'i hesapla
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    const handleAnswerSelect = (optionIndex: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentQuestionIndex] = optionIndex;
        setSelectedAnswers(newAnswers);
        setShowFeedback(true);
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setShowFeedback(false);
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            const answers = questions.map((q, index) => ({
                questionId: q.id,
                selectedIndex: selectedAnswers[index] ?? 0,
            }));
            onComplete(answers);
        }
    };

    const selectedAnswer = selectedAnswers[currentQuestionIndex];

    return (
        <div className="w-full max-w-xl mx-auto px-4 py-6">
            
            {/* PROGRESS (En Üstte İnce Çizgi) */}
            <div className="flex items-center gap-4 mb-8">
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-blue-600 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <div className="text-sm font-bold text-blue-600 font-mono">
                    {currentQuestionIndex + 1}/{questions.length}
                </div>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -20, opacity: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                >
                    {/* SORU ALANI */}
                    <div className="mb-8">
                        {/* Kategori Etiketi */}
                        <span className="inline-block mb-4 text-xs font-bold tracking-wider text-gray-400 uppercase">
                            Week #{weekNumber} • {currentQuestion.category}
                        </span>
                        
                        {/* Soru Başlığı */}
                        <h2 className="text-3xl font-extrabold text-gray-900 leading-tight tracking-tight">
                            {currentQuestion.question}
                        </h2>
                    </div>

                    {/* ŞIKLAR LİSTESİ */}
                    <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => {
                            const isSelected = selectedAnswer === index;
                            return (
                                <motion.button
                                    key={index}
                                    whileTap={{ scale: 0.99 }}
                                    // GÜNCELLEME: Kontrol kaldırıldı, her zaman seçilebilir
                                    onClick={() => handleAnswerSelect(index)}
                                    // GÜNCELLEME: disabled özelliği silindi
                                    className={`w-full group relative flex items-center justify-between p-5 rounded-2xl border-2 text-left transition-all duration-200
                                        ${isSelected 
                                            ? 'border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-200' 
                                            : 'border-gray-100 bg-white text-gray-900 hover:border-gray-300 hover:bg-gray-50'
                                        }
                                        ${showFeedback && !isSelected ? 'opacity-50 hover:opacity-100' : ''}
                                    `}
                                >
                                    <span className="font-bold text-lg pr-4">{option}</span>
                                    
                                    {/* Seçim İkonu (Yuvarlak) */}
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                                        ${isSelected 
                                            ? 'border-white bg-white text-blue-600' 
                                            : 'border-gray-300 group-hover:border-gray-400'
                                        }
                                    `}>
                                        {isSelected && (
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                                        )}
                                    </div>
                                </motion.button>
                            );
                        })}
                    </div>
                </motion.div>
            </AnimatePresence>

            {/* NEXT BUTONU (Sabit Alt Kısım) */}
            <div className="fixed bottom-8 left-0 w-full px-4 z-20">
                <AnimatePresence>
                    {showFeedback && (
                        <motion.button
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 100, opacity: 0 }}
                            onClick={handleNext}
                            className="w-full max-w-xl mx-auto bg-gray-900 text-white font-bold text-lg py-4 rounded-2xl shadow-2xl hover:bg-black transition-colors flex items-center justify-center gap-2"
                        >
                            {currentQuestionIndex < questions.length - 1 ? 'Continue' : 'Finish Quiz'}
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Buton arkası boşluk (Mobilde buton içeriği kapatmasın diye) */}
            <div className="h-24"></div> 
        </div>
    );
}