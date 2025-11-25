import React from 'react';
import { Sun, Mountain, Coffee, Camera, Palmtree, Utensils } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up py-8 px-4">
      {/* Header Section */}
      <div className="text-center mb-16 relative">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -z-10"></div>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-red-800 mb-4">The Kingdom of Wonders</h2>
        <div className="w-24 h-1 bg-green-700 mx-auto rounded-full"></div>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">Discover a land where ancient traditions blend seamlessly with modern life, painted in the colors of the earth and the sea.</p>
      </div>

      {/* Featured Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16 h-96 md:h-80">
        <div className="relative group overflow-hidden rounded-2xl h-64 md:h-full shadow-lg">
           <img 
             src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=800&q=80" 
             alt="Chefchaouen Blue City" 
             className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <span className="text-white font-serif font-bold text-xl">The Blue Pearl</span>
           </div>
        </div>
        <div className="relative group overflow-hidden rounded-2xl h-64 md:h-full shadow-lg">
           <img 
             src="https://images.unsplash.com/photo-1512591290618-9d6e62f022fa?auto=format&fit=crop&w=800&q=80" 
             alt="Sahara Desert" 
             className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <span className="text-white font-serif font-bold text-xl">Sahara Dunes</span>
           </div>
        </div>
        <div className="relative group overflow-hidden rounded-2xl h-64 md:h-full shadow-lg">
           <img 
             src="https://images.unsplash.com/photo-1542044896530-05d85be9b11a?auto=format&fit=crop&w=800&q=80" 
             alt="Moroccan Spices" 
             className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-700"
           />
           <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <span className="text-white font-serif font-bold text-xl">Flavors of Souk</span>
           </div>
        </div>
      </div>

      {/* Info Section with Red/Green Theme */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="space-y-6 text-gray-800 leading-relaxed text-lg">
          <p>
            <span className="text-red-700 font-bold text-2xl float-left mr-2 font-serif">M</span>orocco is a gateway to Africa and a country of dizzying diversity. Here you'll find epic mountain ranges, 
            ancient cities, sweeping deserts – and warm hospitality.
          </p>
          <p>
            From the winding medinas of Fez and Marrakech to the vast dunes of the Sahara, 
            Morocco offers a sensory overload of colors, scents, and sounds. It is a place where 
            tradition and modernity coexist in a vibrant tapestry.
          </p>
          
          <div className="flex gap-4 mt-4">
             <span className="inline-flex items-center px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-semibold">
                <Palmtree size={14} className="mr-1"/> Nature
             </span>
             <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-semibold">
                <Utensils size={14} className="mr-1"/> Cuisine
             </span>
             <span className="inline-flex items-center px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold">
                <Camera size={14} className="mr-1"/> Culture
             </span>
          </div>
        </div>

        {/* Fun Facts Box - Green Theme */}
        <div className="bg-green-50 border-2 border-green-100 rounded-3xl p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 text-green-200">
                <Sun size={120} />
            </div>
            <h3 className="text-xl font-bold text-green-900 mb-6 font-serif flex items-center">
                <span className="bg-green-200 p-2 rounded-lg mr-3 text-green-800"><Sun size={20}/></span>
                Did You Know?
            </h3>
            <ul className="space-y-4 relative z-10">
                <li className="flex items-start">
                    <span className="text-red-600 mr-3 font-bold text-xl">•</span>
                    <span className="text-green-900">Home to the world's oldest university, <span className="font-semibold">Al Quaraouiyine</span> in Fez (founded in 859 AD).</span>
                </li>
                <li className="flex items-start">
                    <span className="text-red-600 mr-3 font-bold text-xl">•</span>
                    <span className="text-green-900">One of the few places where you can see the Atlantic, Mediterranean, snowy peaks, and desert in one trip.</span>
                </li>
                <li className="flex items-start">
                    <span className="text-red-600 mr-3 font-bold text-xl">•</span>
                    <span className="text-green-900">Mint tea is ceremoniously poured from a height to create foam, symbolizing hospitality.</span>
                </li>
            </ul>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-red-600 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-600">
                <Mountain className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2 font-serif">Geography</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Spanning from the Atlantic to the Sahara, featuring the majestic Atlas Mountains and coastal plains.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-green-600 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-4 text-green-600">
                <Sun className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2 font-serif">Climate</h3>
            <p className="text-sm text-gray-600 leading-relaxed">Diverse climate zones, generally Mediterranean along the coast and continental in the interior.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md border-t-4 border-red-600 hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4 text-red-600">
                <Coffee className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2 font-serif">Culture</h3>
            <p className="text-sm text-gray-600 leading-relaxed">A rich blend of Berber, Arab, African, and European influences visible in architecture and daily life.</p>
        </div>
      </div>
    </div>
  );
};

export default About;