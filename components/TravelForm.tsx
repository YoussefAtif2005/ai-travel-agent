import React, { useState } from 'react';
import { TravelPreferences, TravelStyle } from '../types';
import { Send, Calendar, Users, Heart, MapPin, DollarSign } from 'lucide-react';

interface TravelFormProps {
  onSubmit: (prefs: TravelPreferences) => void;
  isLoading: boolean;
}

const CITIES = ["Marrakech", "Fes", "Chefchaouen", "Casablanca", "Essaouira", "Merzouga (Desert)", "Tangier", "Atlas Mountains"];
const INTERESTS = ["Culture & History", "Food & Dining", "Adventure & Hiking", "Relaxation & Spa", "Photography", "Shopping (Souks)"];

const TravelForm: React.FC<TravelFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<TravelPreferences>({
    destination: [],
    duration: 7,
    travelers: 2,
    budget: TravelStyle.Balanced,
    interests: [],
    specialRequests: ''
  });

  const toggleSelection = (item: string, field: 'destination' | 'interests') => {
    setFormData(prev => {
      const list = prev[field];
      if (list.includes(item)) {
        return { ...prev, [field]: list.filter(i => i !== item) };
      } else {
        return { ...prev, [field]: [...list, item] };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 md:p-10 -mt-10 mx-4 md:mx-auto max-w-4xl relative z-20 border border-sand">
      <h2 className="text-2xl font-serif text-gray-800 mb-8 flex items-center">
        <span className="bg-terracotta text-white p-2 rounded-lg mr-3">
            <MapPin size={24} />
        </span>
        Plan Your Journey
      </h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Destinations */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Select Destinations</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {CITIES.map(city => (
              <button
                key={city}
                type="button"
                onClick={() => toggleSelection(city, 'destination')}
                className={`px-4 py-2 rounded-xl text-sm transition-all duration-200 border ${
                  formData.destination.includes(city)
                    ? 'bg-majorelle text-white border-majorelle shadow-md transform scale-105'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-majorelle/50'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Duration */}
            <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <Calendar size={16} /> Duration (Days)
                 </label>
                 <input 
                    type="range" 
                    min="3" 
                    max="21" 
                    value={formData.duration} 
                    onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-terracotta"
                 />
                 <div className="text-right text-terracotta font-bold mt-2">{formData.duration} Days</div>
            </div>
            
            {/* Travelers */}
            <div>
                 <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
                    <Users size={16} /> Travelers
                 </label>
                 <div className="flex items-center space-x-4">
                    <button 
                        type="button"
                        onClick={() => setFormData(p => ({...p, travelers: Math.max(1, p.travelers - 1)}))}
                        className="w-10 h-10 rounded-full bg-sand text-gray-700 flex items-center justify-center hover:bg-gray-200"
                    >-</button>
                    <span className="text-xl font-bold text-gray-800 w-8 text-center">{formData.travelers}</span>
                     <button 
                        type="button"
                        onClick={() => setFormData(p => ({...p, travelers: p.travelers + 1}))}
                        className="w-10 h-10 rounded-full bg-sand text-gray-700 flex items-center justify-center hover:bg-gray-200"
                    >+</button>
                 </div>
            </div>
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
            <DollarSign size={16} /> Budget Style
          </label>
          <div className="flex flex-wrap gap-3">
             {Object.values(TravelStyle).map(style => (
                 <button
                    key={style}
                    type="button"
                    onClick={() => setFormData({...formData, budget: style})}
                    className={`flex-1 min-w-[120px] px-4 py-3 rounded-xl border text-center transition-all ${
                        formData.budget === style
                        ? 'bg-gold/20 border-gold text-yellow-900 font-semibold'
                        : 'bg-white border-gray-200 text-gray-600'
                    }`}
                 >
                    {style}
                 </button>
             ))}
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide flex items-center gap-2">
            <Heart size={16} /> Interests
          </label>
          <div className="flex flex-wrap gap-2">
            {INTERESTS.map(interest => (
              <button
                key={interest}
                type="button"
                onClick={() => toggleSelection(interest, 'interests')}
                className={`px-4 py-2 rounded-full text-sm transition-colors border ${
                  formData.interests.includes(interest)
                    ? 'bg-olive text-white border-olive'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        {/* Special Requests */}
        <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                Special Requests or Notes
            </label>
            <textarea
                value={formData.specialRequests}
                onChange={(e) => setFormData({...formData, specialRequests: e.target.value})}
                placeholder="E.g., We are vegetarians, need accessibility support..."
                className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-majorelle focus:border-transparent outline-none resize-none h-24 bg-gray-50"
            />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg flex items-center justify-center space-x-2 transition-all transform hover:-translate-y-1 ${
            isLoading 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-terracotta hover:bg-red-700'
          }`}
        >
            {isLoading ? (
                <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Consulting the Atlas...</span>
                </>
            ) : (
                <>
                    <span>Generate My Itinerary</span>
                    <Send size={20} />
                </>
            )}
        </button>
      </form>
    </div>
  );
};

export default TravelForm;