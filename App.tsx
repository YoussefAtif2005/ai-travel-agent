import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import TravelForm from './components/TravelForm';
import ItineraryDisplay from './components/ItineraryDisplay';
import About from './components/About';
import Assistant from './components/Assistant';
import { TravelItinerary, TravelPreferences } from './types';
import { generateTravelPlan } from './services/geminiService';
import { ArrowRight } from 'lucide-react';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [itinerary, setItinerary] = useState<TravelItinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFormSubmit = async (prefs: TravelPreferences) => {
    setIsLoading(true);
    setError(null);
    try {
      const plan = await generateTravelPlan(prefs);
      setItinerary(plan);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError("We encountered an issue while consulting the spirits of travel. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setItinerary(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    switch (currentPage) {
      case 'home':
        return (
          <div className="animate-fade-in-up">
            <Hero />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-20">
              <div className="text-center">
                <h2 className="text-3xl font-serif font-bold text-gray-800 mb-6">Discover the Magic of Morocco</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
                  From the bustling souks of Marrakech to the silent dunes of the Sahara, 
                  let us guide you through an unforgettable journey tailored just for you.
                </p>
                <button 
                  onClick={() => setCurrentPage('form')}
                  className="bg-terracotta text-white px-8 py-3 rounded-full text-lg font-semibold shadow-lg hover:bg-red-700 transition-colors inline-flex items-center"
                >
                  Start Planning <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        );
      case 'about':
        return <About />;
      case 'assistant':
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-serif font-bold text-gray-800">Your AI Travel Companion</h1>
                    <p className="text-gray-600 mt-2">Ask me anything about your upcoming trip.</p>
                </div>
                <Assistant />
            </div>
        );
      case 'form':
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            {!itinerary ? (
              <div className="animate-fade-in-up pb-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-serif font-bold text-gray-800">Design Your Journey</h1>
                    <p className="text-gray-600 mt-2">Tell us your preferences and we'll craft the perfect itinerary.</p>
                </div>
                <TravelForm onSubmit={handleFormSubmit} isLoading={isLoading} />
                
                {isLoading && (
                  <div className="text-center mt-12 space-y-4">
                      <p className="text-gray-500 italic">"Travel is the only thing you buy that makes you richer."</p>
                  </div>
                )}

                {error && (
                  <div className="mt-8 p-4 bg-red-100 text-red-700 rounded-xl border border-red-200 text-center max-w-2xl mx-auto">
                    {error}
                  </div>
                )}
              </div>
            ) : (
              <ItineraryDisplay itinerary={itinerary} onReset={handleReset} />
            )}
          </div>
        );
      default:
        return <Hero />;
    }
  };

  return (
    <div className="min-h-screen bg-sand/30 font-sans text-gray-800 selection:bg-terracotta selection:text-white">
      <Navbar currentPage={currentPage} onNavigate={setCurrentPage} />
      
      <main>
        {renderContent()}
      </main>

      <footer className="bg-white mt-auto border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Atlas Voyager. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;