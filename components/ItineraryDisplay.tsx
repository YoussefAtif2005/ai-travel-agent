import React, { useState, useEffect } from 'react';
import { TravelItinerary, DayPlan } from '../types';
import { Play, Pause, MapPin, Clock, Moon, Sun, ArrowRight, CheckCircle2 } from 'lucide-react';
import { generateSpokenSummary } from '../services/geminiService';

interface ItineraryDisplayProps {
  itinerary: TravelItinerary;
  onReset: () => void;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary, onReset }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [activeSource, setActiveSource] = useState<AudioBufferSourceNode | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  // Initialize AudioContext on mount (must be user triggered ideally, but we prep it)
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    setAudioContext(ctx);
    return () => {
      ctx.close();
    };
  }, []);

  const handlePlayAudio = async () => {
    if (isPlaying && activeSource) {
      activeSource.stop();
      setIsPlaying(false);
      return;
    }

    if (!audioContext) return;

    try {
      setIsLoadingAudio(true);
      // Resume context if suspended (browser policy)
      if (audioContext.state === 'suspended') {
        await audioContext.resume();
      }

      const audioBuffer = await generateSpokenSummary(itinerary.summary);
      
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.onended = () => setIsPlaying(false);
      
      source.start();
      setActiveSource(source);
      setIsPlaying(true);
    } catch (error) {
      console.error("Audio playback error:", error);
      alert("Failed to load audio summary.");
    } finally {
      setIsLoadingAudio(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 animate-fade-in-up">
      
      {/* Header Result */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-10 border border-sand">
        <div className="bg-olive/10 p-8 md:p-12 text-center relative overflow-hidden">
          <div className="relative z-10">
             <div className="inline-flex items-center justify-center p-3 bg-olive/20 rounded-full mb-4 text-olive">
                <CheckCircle2 size={32} />
             </div>
             <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-4">
                {itinerary.tripTitle}
             </h2>
             <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed italic">
               "{itinerary.summary}"
             </p>

             <div className="mt-8 flex justify-center">
               <button 
                 onClick={handlePlayAudio}
                 disabled={isLoadingAudio}
                 className={`flex items-center space-x-3 px-8 py-3 rounded-full font-semibold transition-all shadow-lg ${
                    isPlaying 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-majorelle text-white hover:bg-blue-700'
                 }`}
               >
                 {isLoadingAudio ? (
                    <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                 ) : isPlaying ? (
                    <Pause size={20} fill="currentColor" />
                 ) : (
                    <Play size={20} fill="currentColor" />
                 )}
                 <span>{isPlaying ? "Stop Narration" : isLoadingAudio ? "Loading Voice..." : "Listen to Trip Summary"}</span>
               </button>
             </div>
          </div>
          
          {/* Decorative BG element */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-olive/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-majorelle/5 rounded-full blur-3xl"></div>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-8 relative">
        {/* Vertical Line */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gray-200 -z-10 hidden md:block"></div>

        {itinerary.days.map((day, index) => (
          <div key={day.dayNumber} className={`flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
            
            {/* Day Content */}
            <div className="flex-1 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-4">
                 <div>
                    <span className="text-xs font-bold tracking-widest text-terracotta uppercase">Day {day.dayNumber}</span>
                    <h3 className="text-xl font-serif font-bold text-gray-900 mt-1">{day.title}</h3>
                 </div>
                 <span className="bg-sand text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">{day.theme}</span>
              </div>
              
              <div className="space-y-4">
                 {/* Activities */}
                 <ul className="space-y-4">
                    {day.activities.map((act, i) => (
                        <li key={i} className="flex items-start">
                            <Clock className="w-5 h-5 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <span className="text-sm font-semibold text-gray-900 block">{act.time}</span>
                                <p className="text-gray-600 text-sm leading-relaxed">{act.description}</p>
                            </div>
                        </li>
                    ))}
                 </ul>

                 {/* Accommodation & Meals */}
                 <div className="mt-6 pt-4 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-start">
                        <Moon className="w-4 h-4 text-majorelle mr-2 mt-1" />
                        <div>
                            <span className="font-semibold block text-gray-900">Stay</span>
                            <span className="text-gray-600">{day.accommodation}</span>
                        </div>
                    </div>
                    <div className="flex items-start">
                        <Sun className="w-4 h-4 text-gold mr-2 mt-1" />
                        <div>
                            <span className="font-semibold block text-gray-900">Eats</span>
                            <span className="text-gray-600">L: {day.meals.lunch} <br/> D: {day.meals.dinner}</span>
                        </div>
                    </div>
                 </div>
              </div>
            </div>

            {/* Timeline Connector (Desktop) */}
            <div className="w-8 flex items-center justify-center hidden md:flex">
                <div className="w-4 h-4 rounded-full bg-majorelle ring-4 ring-white shadow-sm z-10"></div>
            </div>
            
            {/* Empty Spacer for alternating layout */}
            <div className="flex-1 hidden md:block"></div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center">
        <button 
            onClick={onReset}
            className="text-gray-500 hover:text-majorelle font-semibold flex items-center justify-center mx-auto transition-colors"
        >
            Start New Plan <ArrowRight className="ml-2 w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

export default ItineraryDisplay;