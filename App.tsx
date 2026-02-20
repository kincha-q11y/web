
import React, { useState, useEffect, useCallback } from 'react';
import { NewsCategory, NewsItem, User } from './types.ts';
import { MOCK_NEWS } from './constants.tsx';
import { generateBreakingHeadline, getNewsSummary } from './services/geminiService.ts';
import TopBar from './components/Layout/TopBar.tsx';
import Header from './components/Layout/Header.tsx';
import NewsTicker from './components/News/NewsTicker.tsx';
import NewsGrid from './components/News/NewsGrid.tsx';
import LiveTV from './components/News/LiveTV.tsx';
import AuthModal from './components/Auth/AuthModal.tsx';
import VideoStudio from './components/Studio/VideoStudio.tsx';
import AdPopup from './components/Ads/AdPopup.tsx';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<NewsCategory>(NewsCategory.LATEST);
  const [headlines, setHeadlines] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [summary, setSummary] = useState<{title: string, content: string, sources: any[]} | null>(null);

  useEffect(() => {
    const fetchHeadlines = async () => {
      const data = await generateBreakingHeadline();
      const userRequestedHeadline = "जेवर प्रेस-आश्वासन पर आश्वासन...आखिर कब तक? विस्थापित बेरोजगार युवाओं ने एयरपोर्ट के गेट पर हंगामा";
      
      const filtered = [userRequestedHeadline, ...(data.length > 0 ? data : [
        "जेवर एयरपोर्ट: दूसरे चरण का मुआवजा वितरण शुरू",
        "फिल्म सिटी प्रोजेक्ट के लिए टेंडर प्रक्रिया तेज",
        "रनवे ट्रायल इसी महीने",
        "यमुना एक्सप्रेसवे के पास निवेश के नए अवसर"
      ])];
      setHeadlines(filtered);
    };
    fetchHeadlines();
    const interval = setInterval(fetchHeadlines, 120000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryChange = (cat: NewsCategory) => {
    setActiveCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAiSummary = useCallback(async (title: string) => {
    setIsLoading(true);
    const result = await getNewsSummary(title);
    if (result) {
      setSummary({
        title,
        content: result.text || 'No summary available.',
        sources: result.sources
      });
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (name: string, email: string) => {
    setUser({ name, email, isLoggedIn: true });
    setIsAuthModalOpen(false);
  };

  const openAdPortal = () => {
    window.open('https://jewarpressads.netlify.app', '_blank');
  };

  return (
    <div className="min-h-screen bg-white">
      <AdPopup />
      <TopBar />
      <Header 
        activeCategory={activeCategory} 
        onCategoryChange={handleCategoryChange} 
        onSignInClick={() => setIsAuthModalOpen(true)}
        isLoggedIn={!!user}
      />
      
      {headlines.length > 0 && <NewsTicker headlines={headlines} />}

      {/* Floating Ad Promotion Card */}
      {activeCategory === NewsCategory.LATEST && (
        <div className="fixed bottom-6 left-6 z-[55] animate-in slide-in-from-left duration-700">
          <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 flex flex-col gap-3 w-48 transition-transform hover:scale-105">
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-widest">Sponsored</span>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
            </div>
            <p className="text-[14px] font-black text-gray-800 leading-tight">
              अपने व्यापार का प्रचार करें
            </p>
            <button 
              onClick={openAdPortal}
              className="bg-black text-white w-full py-2.5 rounded-lg font-black uppercase tracking-tighter text-[11px] transition-all hover:bg-gray-800 shadow-lg flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-rectangle-ad text-blue-400"></i>
              विज्ञापन कराओ
            </button>
          </div>
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
        {activeCategory === NewsCategory.LATEST && (
          <div className="space-y-12">
            <NewsGrid news={MOCK_NEWS} onSummaryClick={handleAiSummary} />
            
            {/* Promotion Section */}
            <section id="promotion" className="bg-red-50 rounded-3xl p-8 border-2 border-red-100">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-red-600 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Featured Promotion</span>
                <div className="h-px flex-1 bg-red-200"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <h2 className="text-3xl font-black tracking-tighter text-gray-900 leading-tight">PARTNER WITH JEWAR PRESS</h2>
                  <p className="text-gray-600 font-medium leading-relaxed">Boost your business visibility in the fastest growing region of India. Our localized reach ensures your message hits the heart of Western UP.</p>
                  <button 
                    onClick={openAdPortal}
                    className="bg-red-600 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                  >
                    विज्ञापन कराओ (Contact Now)
                  </button>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl border border-red-100 rotate-2">
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <i className="fa-solid fa-chart-line text-6xl text-red-600/20"></i>
                  </div>
                </div>
              </div>
            </section>

            {/* Advertisements Section */}
            <section id="advertisements" className="bg-gray-900 rounded-3xl p-10 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2">
                <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Sponsored AD</span>
              </div>
              <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="text-blue-400 font-black text-sm uppercase tracking-[0.3em]">Premium Real Estate Opportunities</h3>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase">Plot near Airport starting @ 25 Lakhs*</h2>
                <p className="text-gray-400 text-sm">Limited inventory available. Best for investment in Yamuna City. Call now for site visit.</p>
                <div className="flex justify-center gap-4 pt-4">
                  <button className="bg-blue-600 text-white px-10 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all">Enquire Now</button>
                  <button 
                    onClick={openAdPortal}
                    className="border border-white/20 text-white px-10 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all"
                  >
                    विज्ञापन कराओ
                  </button>
                </div>
              </div>
            </section>
            
            <section className="bg-gray-50 -mx-4 px-4 py-12 md:py-16">
              <div className="container mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black flex items-center gap-3">
                    <span className="w-2 h-8 bg-red-600 rounded"></span>
                    WATCH LIVE
                  </h2>
                  <a href="https://youtube.com/@jewarpress" target="_blank" className="text-red-600 font-bold hover:underline flex items-center gap-2">
                    GO TO YOUTUBE CHANNEL <i className="fa-solid fa-arrow-right"></i>
                  </a>
                </div>
                <LiveTV />
              </div>
            </section>

            {/* Sponsors Section */}
            <section id="sponsors" className="py-12 border-y border-gray-100">
              <p className="text-center text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mb-10">Our Official Sponsors</p>
              <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                {['M.K. SWEETS', 'G.P.G. MEDICARE', 'PRAGYAN INT.', 'YAMUNA CITY REALTY', 'GNG GROUPS'].map((name) => (
                  <div key={name} className="text-2xl font-black text-gray-800 tracking-tighter italic border-2 border-gray-100 px-6 py-2 rounded-lg">
                    {name}
                  </div>
                ))}
              </div>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {['Ground Reports', 'Airport Updates', 'Yamuna City'].map((sectionTitle, idx) => (
                <div key={idx} className="space-y-4">
                  <h3 className="text-lg font-black border-b-2 border-red-600 inline-block mb-4 uppercase tracking-tighter">
                    {sectionTitle}
                  </h3>
                  {MOCK_NEWS.slice(1, 5).map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex gap-3 group cursor-pointer"
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm group-hover:text-red-600 line-clamp-2 transition-colors">{item.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-1 uppercase font-bold">{item.timestamp} • Jewar Press</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Contact Us Section */}
            <section id="contact-us" className="bg-blue-600 rounded-3xl p-12 text-white">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter uppercase mb-4">Contact Jewar Press</h2>
                  <p className="text-blue-100 font-medium mb-8">Send us news tips, feedback, or advertising inquiries. Our team is available 24/7 to listen to the community.</p>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                        <i className="fa-solid fa-envelope"></i>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black opacity-60">Email Us</p>
                        <p className="font-bold">contact@jewarpress.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-xl">
                        <i className="fa-solid fa-phone"></i>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-black opacity-60">Call Editorial</p>
                        <p className="font-bold">+91 9758147768</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-2xl p-8 shadow-2xl">
                  <form className="space-y-4 text-gray-900" onSubmit={(e) => e.preventDefault()}>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Name" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm" />
                      <input type="email" placeholder="Email" className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm" />
                    </div>
                    <textarea placeholder="Your Message" className="w-full h-32 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-blue-600 outline-none font-bold text-sm resize-none"></textarea>
                    <button className="w-full py-4 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-red-700 transition-all shadow-lg">Send Message</button>
                  </form>
                </div>
              </div>
            </section>
          </div>
        )}

        {activeCategory === NewsCategory.STUDIO && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                   <i className="fa-solid fa-wand-magic-sparkles"></i>
                </div>
                <div>
                   <h2 className="text-3xl font-black tracking-tighter uppercase">AI Creator Studio</h2>
                   <p className="text-sm font-bold text-gray-500">Create high-quality news clips for your channel</p>
                </div>
             </div>
             <VideoStudio />
          </div>
        )}

        {activeCategory === NewsCategory.LIVE && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <LiveTV />
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {MOCK_NEWS.slice(1).map((item, i) => (
                   <div 
                    key={i} 
                    className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group cursor-pointer"
                    onClick={() => window.open(item.url, '_blank')}
                   >
                      <div className="aspect-video relative overflow-hidden">
                        <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <span className="absolute bottom-2 right-2 bg-red-600 text-white text-[10px] px-2 py-1 rounded font-bold uppercase">Recent</span>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <i className="fa-solid fa-play text-white text-3xl"></i>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-bold text-sm leading-snug line-clamp-2">{item.title}</h4>
                        <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase">WATCH BROADCAST</p>
                      </div>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeCategory === NewsCategory.VIDEOS && (
           <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="flex items-center justify-between border-b border-gray-100 pb-4">
               <h2 className="text-3xl font-black tracking-tighter uppercase">Latest Videos <span className="text-red-600">({MOCK_NEWS.length})</span></h2>
               <button 
                 onClick={() => window.open('https://youtube.com/@jewarpress', '_blank')}
                 className="px-6 py-2 bg-red-600 text-white font-black rounded-lg text-xs hover:bg-red-700 transition-all uppercase tracking-widest"
                >
                 Subscribe on YouTube
               </button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {MOCK_NEWS.map((item, idx) => (
                 <div 
                  key={idx} 
                  className="group cursor-pointer"
                  onClick={() => window.open(item.url, '_blank')}
                 >
                   <div className="aspect-video rounded-xl overflow-hidden relative mb-3 bg-gray-100">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                            <i className="fa-solid fa-play ml-1"></i>
                         </div>
                      </div>
                   </div>
                   <h4 className="font-bold text-sm line-clamp-2 group-hover:text-red-600 transition-colors">{item.title}</h4>
                   <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-tight">{item.timestamp} • Jewar Press</p>
                 </div>
               ))}
             </div>
           </div>
        )}
      </main>

      <footer className="bg-gray-900 text-white pt-16 pb-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="text-3xl font-black text-white mb-6 tracking-tighter">
                <span className="bg-red-600 px-2 rounded mr-1">J</span>EW PRESS
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Jewar Press is the leading local news network for Jewar, Greater Noida, and Western UP. We bring you verified ground reports directly from the heart of developmental zones.
              </p>
              <div className="flex gap-4">
                <a href="https://youtube.com/@jewarpress" target="_blank" className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-red-600 transition-all duration-300 cursor-pointer hover:-translate-y-1">
                  <i className="fa-brands fa-youtube"></i>
                </a>
                <a href="#" className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center hover:bg-[#1877F2] transition-all duration-300 cursor-pointer hover:-translate-y-1">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-white border-l-4 border-red-600 pl-4 uppercase tracking-widest text-[10px]">Development Hub</h4>
              <ul className="space-y-3 text-gray-400 text-sm font-medium">
                <li className="hover:text-red-500 cursor-pointer transition-colors">Jewar Airport Construction</li>
                <li className="hover:text-red-500 cursor-pointer transition-colors">International Film City</li>
                <li className="hover:text-red-500 cursor-pointer transition-colors">Yamuna Expressway Plots</li>
                <li className="hover:text-red-500 cursor-pointer transition-colors">Greater Noida Industrial Hub</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-white border-l-4 border-red-600 pl-4 uppercase tracking-widest text-[10px]">Quick Links</h4>
              <ul className="space-y-3 text-gray-400 text-sm font-medium">
                <li className="hover:text-red-500 cursor-pointer transition-colors">Ground Reports</li>
                <li className="hover:text-red-500 cursor-pointer transition-colors">Farmer Grievances</li>
                <li className="hover:text-red-500 cursor-pointer transition-colors">Local Governance</li>
                <li className="hover:text-red-500 cursor-pointer transition-colors">Contact Editorial</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-6 text-white border-l-4 border-red-600 pl-4 uppercase tracking-widest text-[10px]">Subscribe</h4>
              <p className="text-gray-400 text-sm mb-4">Never miss an update from Jewar and Greater Noida.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Your Email" className="flex-1 px-4 py-3 bg-gray-800 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 text-sm border border-transparent" />
                <button className="bg-red-600 px-4 py-3 rounded-lg hover:bg-red-700 transition-colors">
                  <i className="fa-solid fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-[10px] font-black uppercase tracking-widest">
            © 2024 JEWAR PRESS MEDIA NETWORK. GROUND REPORTING SPECIALISTS FROM WESTERN UP.
          </div>
        </div>
      </footer>

      {summary && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSummary(null)}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="bg-red-600 p-8 text-white">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                  <i className="fa-solid fa-robot"></i> AI NEWS ANALYSIS
                </div>
                <button onClick={() => setSummary(null)} className="text-white/80 hover:text-white transition-colors">
                  <i className="fa-solid fa-xmark text-2xl"></i>
                </button>
              </div>
              <h3 className="text-2xl md:text-3xl font-black leading-tight tracking-tighter">{summary.title}</h3>
            </div>
            <div className="p-8 max-h-[60vh] overflow-y-auto">
              <div className="prose prose-sm md:prose-base max-w-none text-gray-700 leading-relaxed space-y-4">
                {summary.content.split('\n').map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </div>
            <div className="p-6 bg-gray-50 flex justify-between items-center border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">AI Generated Content</p>
              <button 
                onClick={() => setSummary(null)}
                className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all shadow-lg"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-[80] bg-black/40 backdrop-blur-xs flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-5">
            <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            <div>
              <p className="font-black text-gray-900 uppercase text-xs tracking-widest">Jewar Press AI</p>
              <p className="text-xs text-gray-500 font-bold">Analyzing reporting data...</p>
            </div>
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;
