import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Sparkles, Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { chatWithAssistant, ai, decodeAudioData, decode } from '../services/geminiService';
import { LiveServerMessage, Modality, Blob } from '@google/genai';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const Assistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Salam! I am your Moroccan travel assistant. You can chat with me or use the Voice Mode to speak directly.' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isLiveConnected, setIsLiveConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Live API Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const inputContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sessionRef = useRef<any>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isVoiceMode]);

  // Clean up Live Session on unmount
  useEffect(() => {
    return () => {
      disconnectLiveSession();
    };
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatWithAssistant(userMessage);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "I'm having trouble connecting to the spirits of the desert. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Live API Logic ---

  const createBlob = (data: Float32Array): Blob => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: btoa(String.fromCharCode(...new Uint8Array(int16.buffer))),
      mimeType: 'audio/pcm;rate=16000',
    };
  };

  const connectLiveSession = async () => {
    try {
      setIsLoading(true);
      
      // Initialize Audio Contexts
      inputContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});
      nextStartTimeRef.current = 0;

      // Get User Media
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            console.log("Live session opened");
            setIsLiveConnected(true);
            setIsLoading(false);

            if (!inputContextRef.current || !streamRef.current) return;

            // Setup Input Streaming
            const source = inputContextRef.current.createMediaStreamSource(streamRef.current);
            const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
            
            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };

            source.connect(processor);
            processor.connect(inputContextRef.current.destination);
            
            sourceRef.current = source;
            processorRef.current = processor;
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio && audioContextRef.current) {
               const ctx = audioContextRef.current;
               nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
               
               const audioBuffer = await decodeAudioData(
                 decode(base64Audio),
                 ctx,
                 24000,
                 1
               );

               const source = ctx.createBufferSource();
               source.buffer = audioBuffer;
               source.connect(ctx.destination);
               source.start(nextStartTimeRef.current);
               nextStartTimeRef.current += audioBuffer.duration;
            }
          },
          onclose: () => {
            console.log("Live session closed");
            setIsLiveConnected(false);
          },
          onerror: (err) => {
            console.error("Live session error", err);
            setIsLiveConnected(false);
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: 'You are a helpful Moroccan travel assistant named Atlas. Speak warmly and briefly about Morocco.',
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (error) {
      console.error("Failed to connect live session", error);
      setIsLoading(false);
      alert("Could not access microphone or connect to AI service.");
    }
  };

  const disconnectLiveSession = () => {
    // Stop Audio Input
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
    }
    if (processorRef.current && inputContextRef.current) {
        processorRef.current.disconnect();
        sourceRef.current?.disconnect();
    }
    if (inputContextRef.current) inputContextRef.current.close();
    if (audioContextRef.current) audioContextRef.current.close();

    // Close Session (Not explicitly available via method on promise, but we stop sending)
    // There isn't a direct .close() on the session promise result in all SDK versions easily accessible
    // But stopping the stream stops the input.
    setIsLiveConnected(false);
    sessionRef.current = null;
  };

  const toggleVoiceMode = () => {
    if (isVoiceMode) {
        disconnectLiveSession();
        setIsVoiceMode(false);
    } else {
        setIsVoiceMode(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[600px] bg-white rounded-3xl shadow-xl overflow-hidden border border-sand transition-all duration-300">
      
      {/* Header */}
      <div className={`p-4 text-white flex items-center justify-between shadow-sm transition-colors duration-300 ${isVoiceMode ? 'bg-red-700' : 'bg-majorelle'}`}>
        <div className="flex items-center">
            {isVoiceMode ? <Mic className="w-6 h-6 mr-2 animate-pulse" /> : <Sparkles className="w-6 h-6 mr-2 text-gold" />}
            <div>
                <h2 className="font-serif font-bold">Atlas Assistant</h2>
                <p className="text-xs text-blue-100">{isVoiceMode ? "Live Voice Mode" : "AI Travel Guide"}</p>
            </div>
        </div>
        <button 
            onClick={toggleVoiceMode}
            className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 transition-all ${isVoiceMode ? 'bg-white text-red-700' : 'bg-white/20 hover:bg-white/30'}`}
        >
            {isVoiceMode ? <><MicOff size={14} /> End Voice</> : <><Mic size={14} /> Start Voice</>}
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative bg-sand/20">
        
        {isVoiceMode ? (
            // Voice Mode UI
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center animate-fade-in-up">
                {!isLiveConnected && isLoading ? (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-12 h-12 text-red-600 animate-spin mb-4" />
                        <p className="text-gray-600 font-medium">Connecting to Atlas...</p>
                    </div>
                ) : !isLiveConnected ? (
                    <div className="flex flex-col items-center">
                        <button 
                            onClick={connectLiveSession}
                            className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform mb-6"
                        >
                            <Mic className="w-8 h-8 text-white" />
                        </button>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Tap to Speak</h3>
                        <p className="text-gray-500 max-w-sm">Have a natural conversation with your AI guide about your trip to Morocco.</p>
                    </div>
                ) : (
                    <div className="flex flex-col items-center space-y-8">
                         <div className="relative">
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                            <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-red-500 rounded-full flex items-center justify-center shadow-2xl relative z-10 border-4 border-white">
                                <Volume2 className="w-12 h-12 text-white animate-pulse" />
                            </div>
                         </div>
                         <div>
                            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">Listening...</h3>
                            <p className="text-red-600 font-medium">Atlas is active</p>
                         </div>
                         <button 
                            onClick={disconnectLiveSession}
                            className="bg-white text-gray-600 border border-gray-300 px-6 py-2 rounded-full hover:bg-gray-50"
                         >
                            Disconnect
                         </button>
                    </div>
                )}
            </div>
        ) : (
            // Text Chat UI
            <div className="h-full flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mx-2 ${msg.role === 'user' ? 'bg-terracotta text-white' : 'bg-majorelle text-white'}`}>
                            {msg.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}
                        </div>
                        <div className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                            msg.role === 'user' 
                            ? 'bg-terracotta/10 text-gray-800 rounded-tr-none' 
                            : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                        }`}>
                            {msg.text}
                        </div>
                        </div>
                    </div>
                    ))}
                    {isLoading && (
                    <div className="flex justify-start w-full">
                        <div className="flex items-center space-x-2 bg-white px-4 py-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 ml-12">
                            <div className="w-2 h-2 bg-majorelle rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-majorelle rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-majorelle rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                    </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSend} className="p-4 bg-white border-t border-gray-100">
                    <div className="flex space-x-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about travel tips, weather, or culture..."
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-majorelle focus:border-transparent bg-gray-50"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !input.trim()}
                        className="bg-majorelle text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Send size={20} />
                    </button>
                    </div>
                </form>
            </div>
        )}
      </div>
    </div>
  );
};

export default Assistant;