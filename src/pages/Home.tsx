import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowRight, Play, Sparkles } from "lucide-react";
import { useEffect } from "react";
import { motion } from "framer-motion";

const games = [
  {
    id: 1,
    name: "Baraban Metodi",
    description: "Word repetition and memorization through drum rhythm",
    usage: "Lug'at kengaytirish va tilni o'rganish uchun",
    level: "Oddiy",
    icon: "🥁",
    route: "/games/baraban",
  },
  {
    id: 2,
    name: "Arqon Tortish",
    description: "Interactive rope pulling game for learning",
    usage: "Jamoaviy ta'lim va raqobatni o'rganish uchun",
    level: "Oddiy",
    icon: "🔗",
    route: "/games/arqon",
  },
  {
    id: 3,
    name: "So'zlar Izidash",
    description: "Word search puzzle game with educational twist",
    usage: "So'z fondini kengaytirish uchun",
    level: "Murakkab",
    icon: "🔍",
    route: "/games/wordsearch",
  },
  {
    id: 4,
    name: "Millionchi Bolib Oling",
    description: "Interactive quiz game with multiple choice questions",
    usage: "Umumi bilim sinovash uchun",
    level: "Murakkab",
    icon: "💰",
    route: "/games/millionaire",
  },
  {
    id: 5,
    name: "Tarjima O'yini",
    description: "Translation and language learning game",
    usage: "Tillarni o'rganish uchun",
    level: "Oddiy",
    icon: "🌐",
    route: "/games/translation",
  },
  {
    id: 6,
    name: "Grammatika Turnirlari",
    description: "Grammar competition and learning games",
    usage: "Grammatika bilimlarini yangilanish uchun",
    level: "Murakkab",
    icon: "📚",
    route: "/games/grammar",
  },
  {
    id: 7,
    name: "Raqamlar O'yini",
    description: "Mathematics and number learning game",
    usage: "Matematika bilimlarini yangilanish uchun",
    level: "Oddiy",
    icon: "🔢",
    route: "/games/numbers",
  },
  {
    id: 8,
    name: "Shaxmat Darslar",
    description: "Chess learning and strategy game",
    usage: "Shaxmat o'rganish va strategiya uchun",
    level: "Murakkab",
    icon: "♟️",
    route: "/games/chess",
  },
  {
    id: 9,
    name: "Tarixni O'rganing",
    description: "History learning through interactive gameplay",
    usage: "Tarihiy bilimlarni o'rganish uchun",
    level: "Murakkab",
    icon: "🏛️",
    route: "/games/history",
  },
];

const testimonials = [
  {
    author: "Dr. Salim Ismoilov",
    role: "Education Director",
    text: "UzGame transformed how our students engage with learning. The interactive approach keeps them motivated and results show real improvement.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  },
  {
    author: "Aliyah Karimova",
    role: "Mathematics Teacher",
    text: "My students love these games. They're learning without realizing how much they're absorbing. It's a game changer for education.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  },
  {
    author: "Ahmed Azimov",
    role: "School Principal",
    text: "We've seen measurable improvements in student engagement and academic performance. UzGame is exactly what modern education needs.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
  },
];

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen text-white overflow-hidden relative">
      <div className="fixed inset-0 -z-10 grid-overlay opacity-40" />

      {/* Floating orbs — oq shadow */}
      <div className="fixed top-20 left-[10%] w-72 h-72 bg-white/8 rounded-full blur-[100px] float-slow pointer-events-none" style={{ boxShadow: "0 0 80px rgba(255,255,255,0.05)" }} />
      <div className="fixed bottom-32 right-[15%] w-96 h-96 bg-white/5 rounded-full blur-[120px] float-medium pointer-events-none" style={{ animationDelay: '1s', boxShadow: "0 0 100px rgba(255,255,255,0.04)" }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[150px] glow-pulse pointer-events-none" />

      {/* Navigation */}
      <nav className="sticky top-0 z-40 backdrop-blur-xl border-b border-white/10 bg-black/60" style={{ boxShadow: "0 0 40px -10px rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-white/15 border border-white/20 flex items-center justify-center" style={{ boxShadow: "0 0 20px -5px rgba(255,255,255,0.2)" }}>
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight font-display">UzGame</h1>
          </div>
          {user ? (
            <div className="flex gap-3">
              <Link to="/games">
                <Button className="btn-neon text-sm">
                  O'yinlarga
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              {user.role === "teacher" && (
                <Link to="/teacher/dashboard">
                  <Button className="bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white border border-amber-500/30 px-6 font-semibold transition-all duration-300">
                    📊 Panel
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="flex gap-3">
              <Link to="/teacher/auth">
                <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-6 font-semibold transition-all duration-300">
                  👨‍🏫 O'qituvchi
                </Button>
              </Link>
              <Link to="/login">
                <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/30 px-6 font-semibold transition-all duration-300">
                  Kirish
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-4 py-28 sm:py-36 lg:py-44 min-h-screen flex items-center">
        <div className="max-w-5xl mx-auto w-full text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8 mb-12"
          >
            <div className="inline-block">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="px-5 py-2.5 rounded-full bg-white/5 border border-white/20 text-sm font-semibold text-white/90 backdrop-blur-sm"
              >
                ⚡ Interaktiv Ta'lim Platformasi
              </motion.div>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-[1.1] tracking-tight">
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white block sm:inline"
              >
                O'rganishni
              </motion.span>{" "}
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-ultra-gradient block sm:inline"
              >
                Qiziqarli
              </motion.span>{" "}
              <motion.span 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-white block sm:inline"
              >
                Qiling
              </motion.span>
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              AI asosidagi interaktiv o'yinlar — o'quvchilarni jalb qiluvchi va bilimni chuqurlashtiruvchi platforma.
            </motion.p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            {user ? (
              <Link to="/games" className="w-full sm:w-auto">
                <Button className="w-full btn-neon px-10 py-6 text-base font-bold">
                  O'yinlarni Boshlash
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="w-full sm:w-auto">
                  <Button className="w-full btn-neon px-10 py-6 text-base font-bold">
                    Boshlash
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/games" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30 text-white px-10 py-6 text-base font-semibold rounded-xl transition-all duration-300">
                    O'yinlarni Ko'rish
                  </Button>
                </Link>
              </>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-8 justify-center mt-20 pt-12 border-t border-white/10"
          >
            <div className="text-center">
              <p className="text-3xl font-bold text-white" style={{ textShadow: "0 0 30px rgba(255,255,255,0.2)" }}>5,000+</p>
              <p className="text-slate-400 text-sm mt-1">Foydalanuvchilar</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white" style={{ textShadow: "0 0 30px rgba(255,255,255,0.2)" }}>500+</p>
              <p className="text-slate-400 text-sm mt-1">O'qituvchilar</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white" style={{ textShadow: "0 0 30px rgba(255,255,255,0.2)" }}>9+</p>
              <p className="text-slate-400 text-sm mt-1">Interaktiv O'yinlar</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AI Features */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-white font-display">
              Zamonaviy Texnologiya
            </h2>
            <p className="text-xl text-slate-400 font-medium">AI va interaktiv ta'lim uyg'unlashuvi</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: "🧠", title: "AI O'rganish", desc: "Adaptiv algoritmlar har bir tajribani shaxsiylashtiradi" },
              { icon: "⚡", title: "Real Vaqt", desc: "Tezkor javob va dinamik moslashuv" },
              { icon: "🔮", title: "Kelajakga Tayyor", desc: "Ertangi ta'lim standartlari uchun" },
              { icon: "📊", title: "Tahlil", desc: "Keng qamrovli natijalar monitoring" },
              { icon: "🎯", title: "Aniqlik", desc: "Har bir o'quvchi uchun individual yo'l" },
              { icon: "🛡️", title: "Xavfsiz", desc: "Yuqori darajadagi ma'lumot himoyasi" },
            ].map((feature, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group"
              >
                <div className="glass-card p-8">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2 font-display">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Games Grid */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-cyan-950/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-white font-display">
              Interaktiv O'yinlar
            </h2>
            <p className="text-xl text-slate-400 font-medium">O'rganish va o'ynashni birlashtiruvchi tajriba</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.slice(0, 6).map((game, idx) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <Link to={game.route} className="group block h-full">
                  <div className="glass-card p-8 min-h-80 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <span className="text-5xl">{game.icon}</span>
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                          game.level === "Oddiy" 
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/30" 
                            : "bg-amber-500/20 text-amber-300 border border-amber-400/30"
                        }`}>
                          {game.level}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors font-display">{game.name}</h3>
                      <p className="text-sm text-slate-400">{game.description}</p>
                    </div>
                    <div className="pt-6 border-t border-white/10">
                      <p className="text-xs text-slate-500">{game.usage}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-16"
          >
            <Link to="/games">
              <Button className="btn-neon px-10 py-6 text-base font-bold">
                Barcha O'yinlarni Ko'rish
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-white font-display">
              Qanday Ishlaydi
            </h2>
            <p className="text-xl text-slate-400 font-medium">3 ta oddiy qadam — o'rganishni boshlang</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: "01", title: "Ro'yxatdan O'tish", desc: "Bir necha soniyada hisob yarating, karta talab qilinmaydi" },
              { num: "02", title: "Tanlash", desc: "9 ta qiziqarli interaktiv o'yindan birini tanlang" },
              { num: "03", title: "O'rganish", desc: "AI asosidagi o'rganish safariyni bugun boshlang" },
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15 }}
                className="text-center"
              >
                <div className="inline-block mb-6">
                  <div className="w-16 h-16 bg-white/15 border border-white/20 rounded-xl flex items-center justify-center text-2xl font-black font-display" style={{ boxShadow: "0 0 25px -5px rgba(255,255,255,0.2)" }}>
                    {item.num}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3 font-display">{item.title}</h3>
                <p className="text-slate-400 font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative px-4 py-24 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-cyan-950/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-4xl sm:text-5xl font-black mb-4 text-white font-display">
              O'qituvchilar Ishonadi
            </h2>
            <p className="text-xl text-slate-400 font-medium">Haqiqiy foydalanuvchilardan haqiqiy fikrlar</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="glass-card p-8 h-full">
                  <div className="flex items-center gap-4 mb-6">
                    <img 
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full object-cover border-2 border-white/20 ring-2 ring-white/10"
                    />
                    <div>
                      <h4 className="font-bold text-white text-sm">{testimonial.author}</h4>
                      <p className="text-xs text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-amber-400 text-sm">★</span>
                    ))}
                  </div>
                  <p className="text-sm text-slate-300 font-medium italic">"{testimonial.text}"</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative px-4 py-24 sm:px-6 lg:px-8 overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/[0.03] to-white/5 blur-3xl" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="glass-card p-12 text-center">
            <h2 className="text-4xl sm:text-5xl font-black mb-6 text-white font-display">
              O'rganishni O'zgartirishga Tayyormisiz?
            </h2>
            <p className="text-xl text-slate-300 mb-8 font-medium max-w-2xl mx-auto">
              Minglab o'qituvchilar bilan UzGame orqali yaxshiroq ta'lim tajribasini yarating.
            </p>
            
            <Link to={user ? "/games" : "/login"} className="inline-block">
              <Button className="btn-neon px-12 py-6 text-lg font-bold">
                Bepul Boshlash
                <Play className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <p className="text-slate-400 text-sm mt-6 font-medium">
              Karta talab qilinmaydi • 9 ta o'yin • 5,000+ foydalanuvchi
            </p>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="relative px-4 py-8 sm:px-6 lg:px-8 border-t border-white/10 bg-black/40" style={{ boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.03)" }}>
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-500 text-sm font-medium">
            © 2026 UzGame • AI asosidagi Ta'lim Platformasi • Kelajak Ta'limini O'zgartirish
          </p>
        </div>
      </footer>
    </div>
  );
}
