export interface Question {
    id: number;
    questionText: string;
    options: string[];
    correctAnswer: string;
    image?: string;
}

export interface LearningItem {
    id: number;
    latin: string;
    uzbek: string;
    description: string;
    image?: string;
}

export interface RuleCard {
    id: number;
    title: string;
    description: string;
    explanation: string;
    items: LearningItem[];
    questions: Question[];
    image?: string;
}

export interface Topic {
    id: number;
    title: string;
    description: string;
    icon: string;
    rules: RuleCard[];
}

export const topics: Topic[] = [
    {
        id: 1,
        title: "Otning 5 ta turlanishi",
        description: "Lotin tili grammatikasining asosi - 5 ta turlanish guruhi.",
        icon: "V",
        rules: [
            {
                id: 11,
                title: "1-turlanish (Declinatio Prima)",
                description: "Nominativusda -a, Genetivusda -ae bilan tugaydigan otlar.",
                explanation: "Lotin tilidagi eng ko'p qo'llaniladigan turlanishlardan biri.",
                image: "file:///C:/Users/NotebookService/.gemini/antigravity/brain/d5039e09-3714-40e5-a612-19632e30082f/latin_grammar_manuscript_pro_ultra_1774416239521.png",
                items: [
                    { id: 1, latin: "ala, ae f", uzbek: "qanot", description: "Qanotsimon o'simta - Burun yoki quloqning yon bo'limi", image: "https://via.placeholder.com/400?text=Ala+(Wing)" },
                    { id: 2, latin: "vena, ae f", uzbek: "vena qon tomiri", description: "Qon tomiri turi - Qonni yurakka qaytaradi", image: "https://via.placeholder.com/400?text=Vena+(Vein)" },
                    { id: 3, latin: "aorta, ae f", uzbek: "shox tomir", description: "Eng katta arterial qon tomiri - Asosiy arteriya", image: "https://via.placeholder.com/400?text=Aorta" },
                    { id: 4, latin: "vertebra, ae f", uzbek: "umurtqa", description: "Umurtqa pog'onasi suyagi - Omurti tashkil etadi", image: "https://via.placeholder.com/400?text=Vertebra+(Vertebra)" },
                    { id: 5, latin: "arteria, ae f", uzbek: "arteriya qon tomiri", description: "Qon tomiri turi - Qonni yo'llashtiradi", image: "https://via.placeholder.com/400?text=Arteria+(Artery)" },
                    { id: 6, latin: "patella, ae f", uzbek: "tizza qopqog'i", description: "Tizza bo'g'imi suyagi - Tizza oldida", image: "https://via.placeholder.com/400?text=Patella+(Kneecap)" },
                    { id: 7, latin: "concha, ae f", uzbek: "chig'anoq", description: "Burun yoki quloq qismi - Chiganoq shaklidagi", image: "https://via.placeholder.com/400?text=Concha+(Shell)" },
                    { id: 8, latin: "sutura, ae f", uzbek: "chok", description: "Suyaklar birlashgan joyi - Kalla choklari", image: "https://via.placeholder.com/400?text=Sutura+(Suture)" },
                    { id: 9, latin: "costa, ae f", uzbek: "qovurg'a", description: "Ko'krak qafasi suyagi - Ko'kraki tashkil etadi", image: "https://via.placeholder.com/400?text=Costa+(Rib)" },
                    { id: 10, latin: "tuba, ae f", uzbek: "nay, truba", description: "Shidatli yo'llar - Falopiev tubi", image: "https://via.placeholder.com/400?text=Tuba+(Tube)" },
                    { id: 11, latin: "crista, ae f", uzbek: "qirra", description: "Suyakning o'tkir qismi - Suyakning chiqintisi", image: "https://via.placeholder.com/400?text=Crista+(Crest)" },
                    { id: 12, latin: "bucca, ae f", uzbek: "lunj", description: "Yuz qismi - Jag'ning yon tomoni", image: "https://via.placeholder.com/400?text=Bucca+(Cheek)" },
                    { id: 13, latin: "lamina, ae f", uzbek: "plastinka", description: "Yupqa qatlam - To'qima plastinkasi", image: "https://via.placeholder.com/400?text=Lamina+(Lamina)" },
                    { id: 14, latin: "gingiva, ae f", uzbek: "milk", description: "Tishlarni o'rab turuvchi to'qima - Tish eti", image: "https://via.placeholder.com/400?text=Gingiva+(Gum)" },
                    { id: 15, latin: "lingua, ae f", uzbek: "til", description: "Ta'm bilish a'zosi - Og'izda", image: "https://via.placeholder.com/400?text=Lingua+(Tongue)" },
                    { id: 16, latin: "lingula, ae f", uzbek: "tilcha", description: "Kichik til shaklidagi o'simta - Suyakning o'simtasi", image: "https://via.placeholder.com/400?text=Lingula+(Tongue-like)" },
                    { id: 17, latin: "orbita, ae f", uzbek: "ko'z kosasi", description: "Ko'z joylashgan bo'shliq - Kallada", image: "https://via.placeholder.com/400?text=Orbita+(Eye+Socket)" },
                    { id: 18, latin: "papilla, ae f", uzbek: "so'rg'ich", description: "Bo'rtma shaklidagi o'simta - Til sirtida", image: "https://via.placeholder.com/400?text=Papilla+(Nipple)" },
                    { id: 19, latin: "protuberantia, ae f", uzbek: "bo'rtma", description: "Suyak do'ngligi - Suyakning chiqintisi", image: "https://via.placeholder.com/400?text=Protuberantia+(Protuberance)" },
                    { id: 20, latin: "scapula, ae f", uzbek: "kurak", description: "Yelka suyagi - Orqaning yuqori qismi", image: "https://via.placeholder.com/400?text=Scapula+(Shoulder)" }
                ],
                questions: [
                    { id: 1100, questionText: "Ala, ae f otining uzbek ma'nosi nima?", options: ["Qanot", "Vena", "Suyak", "Mushak"], correctAnswer: "Qanot" },
                    { id: 1101, questionText: "Vena qo'llaniladi qayerda?", options: ["Qonni yo'llashtiradi", "Qonni yurakka qaytaradi", "Mushakni harakat ettiradi", "Suyakni tutadi"], correctAnswer: "Qonni yurakka qaytaradi" },
                    { id: 1102, questionText: "Aorta, ae f otining ma'nosi?", options: ["Tizza qopqog'i", "Shox tomir", "Umurtqa", "Qovurg'a"], correctAnswer: "Shox tomir" },
                    { id: 1103, questionText: "Vertebra, ae f nima?", options: ["Qanot", "Qon tomiri", "Umurtqa pog'onasi", "Tish"], correctAnswer: "Umurtqa pog'onasi" },
                    { id: 1104, questionText: "Arteria, ae f qayerda joylashgan?", options: ["Qoll", "Yuz", "Tana", "Barjasi to'g'ri"], correctAnswer: "Barjasi to'g'ri" },
                    { id: 1105, questionText: "Patella, ae f otining ma'nosi?", options: ["Tizza qopqog'i", "Tizza bo'g'imi", "Suyak tarkibi", "Xondra"], correctAnswer: "Tizza qopqog'i" },
                    { id: 1106, questionText: "Costa, ae f nima?", options: ["Ko'krak poydevori", "Ko'krak qafasi", "Ko'krak mushaklari", "Ko'kraksaymon"], correctAnswer: "Ko'krak qafasi" },
                    { id: 1107, questionText: "Sutura, ae f qanday struktura?", options: ["Qon tomiri", "Suyaklar birlashgan joyi", "Mushak", "Boylam"], correctAnswer: "Suyaklar birlashgan joyi" }
                ]
            }
        ]
    },
    {
        id: 2,
        title: "Otning 3 turlanishi",
        description: "3-turlanishdagi otlarning turlari va xususiyatlari.",
        icon: "III",
        rules: [
            {
                id: 21,
                title: "3-turlanish (Declinatio Tertia)",
                description: "Undoshli, unli va aralash turlanish guruhlari.",
                explanation: "Genetivusda -is bilan tugaydi.",
                image: "file:///C:/Users/NotebookService/.gemini/antigravity/brain/d5039e09-3714-40e5-a612-19632e30082f/latin_grammar_manuscript_pro_ultra_1774416239521.png",
                items: [
                    { id: 210, latin: "Apex, apicis m", uzbek: "Uchi", description: "3-turlanish otining uchi" },
                    { id: 211, latin: "Lex, legis f", uzbek: "Qonun", description: "Tibbiyot qonuni" },
                    { id: 212, latin: "Corpus, corporis n", uzbek: "Tana", description: "Tana asosiy qismi" },
                    { id: 213, latin: "Tempus, temporis n", uzbek: "Vaqt", description: "Vaqt o'lchamlari" },
                    { id: 214, latin: "Mons, montis m", uzbek: "Tog'", description: "Suyakda o'tkir o'siq" },
                    { id: 215, latin: "Ars, artis f", uzbek: "San'at", description: "Tibbiyot san'ati" },
                    { id: 216, latin: "Nox, noctis f", uzbek: "Tun", description: "Tun vaqti" },
                    { id: 217, latin: "Pes, pedis m", uzbek: "Oyoq", description: "Oyoq tarkibi" },
                    { id: 218, latin: "Vox, vocis f", uzbek: "Ovoz", description: "Ovozning sharaflari" },
                    { id: 219, latin: "Crux, crucis f", uzbek: "Xoch", description: "Shakl turlari" }
                ],
                questions: [
                    { id: 2100, questionText: "Apex, apicis m otining ma'nosi?", options: ["Qonun", "Uchi", "Tana", "Vaqt"], correctAnswer: "Uchi" },
                    { id: 2101, questionText: "Lex, legis f qanday otlanadi?", options: ["1-turlanish", "2-turlanish", "3-turlanish", "4-turlanish"], correctAnswer: "3-turlanish" },
                    { id: 2102, questionText: "Corpus, corporis n nima degani?", options: ["Vaqt", "Tana", "Ovoz", "Oyoq"], correctAnswer: "Tana" },
                    { id: 2103, questionText: "Tempus, temporis n otining genetivusi?", options: ["Temporis", "Tempora", "Temporie", "Temporium"], correctAnswer: "Temporis" },
                    { id: 2104, questionText: "Mons, montis m qayda joylashgan?", options: ["Suyakda", "Mushakda", "Qonda", "Tog'da"], correctAnswer: "Suyakda" },
                    { id: 2105, questionText: "Ars, artis f otining ma'nosi?", options: ["Qonun", "Vaqt", "San'at", "Oyoq"], correctAnswer: "San'at" },
                    { id: 2106, questionText: "Nox, noctis f nima?", options: ["Kun", "Tun", "Hid", "Vaqt"], correctAnswer: "Tun" },
                    { id: 2107, questionText: "Pes, pedis m bo'yicha to'g'ri javob?", options: ["Oyoq poydevori", "Oyoq", "Oyoq mushaklari", "Oyoq suyagi"], correctAnswer: "Oyoq" }
                ]
            }
        ]
    },
    {
        id: 3,
        title: "Sifatning 1 va 2 guruhlari",
        description: "Sifatlarning turlanish tartibi va guruhlanishi.",
        icon: "A",
        rules: [
            {
                id: 31,
                title: "Sifat guruhlari",
                description: "1 va 2-guruh sifatlari haqida ma'lumot.",
                explanation: "Sifatlar otlar kabi turlanadi.",
                image: "file:///C:/Users/NotebookService/.gemini/antigravity/brain/d5039e09-3714-40e5-a612-19632e30082f/latin_grammar_manuscript_pro_ultra_1774416239521.png",
                items: [
                    { id: 310, latin: "Magnus, a, um", uzbek: "Katta", description: "Sifat 1-2 guruh" },
                    { id: 311, latin: "Parvus, a, um", uzbek: "Kichik", description: "Sifat 1-2 guruh" },
                    { id: 312, latin: "Bonus, a, um", uzbek: "Yaxshi", description: "Sifat 1-2 guruh" },
                    { id: 313, latin: "Malus, a, um", uzbek: "Yomon", description: "Sifat 1-2 guruh" },
                    { id: 314, latin: "Fortis, e", uzbek: "Kuchli", description: "Sifat 3 guruh" },
                    { id: 315, latin: "Nobilis, e", uzbek: "Shongli", description: "Sifat 3 guruh" },
                    { id: 316, latin: "Terribilis, e", uzbek: "Dahshatli", description: "Sifat 3 guruh" },
                    { id: 317, latin: "Acer, acris, acre", uzbek: "O'tkir", description: "Sifat 3 guruh" },
                    { id: 318, latin: "Facilis, e", uzbek: "Oson", description: "Sifat 3 guruh" },
                    { id: 319, latin: "Difficilis, e", uzbek: "Qiyin", description: "Sifat 3 guruh" }
                ],
                questions: [
                    { id: 3100, questionText: "Magnus, a, um qaysi guruhga tegishli?", options: ["1-guruh", "2-guruh", "1-2 guruh", "3-guruh"], correctAnswer: "1-2 guruh" },
                    { id: 3101, questionText: "Parvus, a, um otining ma'nosi?", options: ["Katta", "Kichik", "Yaxshi", "Yomon"], correctAnswer: "Kichik" },
                    { id: 3102, questionText: "Bonus, a, um nima degani?", options: ["Yomon", "Yaxshi", "Katta", "Kichik"], correctAnswer: "Yaxshi" },
                    { id: 3103, questionText: "Fortis, e qaysi guruhga tegishli?", options: ["1-2 guruh", "3-guruh", "4-turlanish", "5-turlanish"], correctAnswer: "3-guruh" },
                    { id: 3104, questionText: "Nobilis, e bo'yicha to'g'ri javob?", options: ["Kuchli", "Shongli", "Oson", "Qiyin"], correctAnswer: "Shongli" },
                    { id: 3105, questionText: "Acer, acris, acre nima?", options: ["Oson", "O'tkir", "Qiyin", "Katta"], correctAnswer: "O'tkir" },
                    { id: 3106, questionText: "Facilis, e otining ma'nosi?", options: ["Qiyin", "Oson", "Og'ir", "Yumshoq"], correctAnswer: "Oson" },
                    { id: 3107, questionText: "Difficilis, e nima degani?", options: ["Oson", "Qiyin", "Yaxshi", "Yomon"], correctAnswer: "Qiyin" }
                ]
            }
        ]
    },
    {
        id: 4,
        title: "Tibbiyot: Mimika mushaklari",
        description: "Yuz mimikasida qatnashadigan mushaklar va ularning vazifalari.",
        icon: "M",
        rules: [
            {
                id: 41,
                title: "Mimika mushaklari (Musculi faciei)",
                description: "Yuz ifodasi va harakati uchun mas'ul mushaklar.",
                explanation: "Professional 3D model orqali o'rganing.",
                image: "file:///C:/Users/NotebookService/.gemini/antigravity/brain/d5039e09-3714-40e5-a612-19632e30082f/facial_muscles_pro_ultra_1774416195330.png",
                items: [
                    { id: 1, latin: "M. occipitofrontalis", uzbek: "Peshona-ensa mushagi", description: "Peshonani tirishtiradi - Yuz ifodasi mushagi", image: "https://via.placeholder.com/400?text=Occipitofrontalis" },
                    { id: 2, latin: "M. orbicularis oculi", uzbek: "Ko'z atrofidagi halqasimon mushak", description: "Ko'zni yumadi - Qimirlatish va yumish uchun", image: "https://via.placeholder.com/400?text=Orbicularis+Oculi" },
                    { id: 3, latin: "M. corrugator supercilii", uzbek: "Qoshni tirishtiruvchi mushak", description: "Qoshlarni tortadi - Hayrati ifodasi", image: "https://via.placeholder.com/400?text=Corrugator+Supercilii" },
                    { id: 4, latin: "M. procerus", uzbek: "Burun usti mushagi", description: "Takabburlik ifodasi - Peshona qismi", image: "https://via.placeholder.com/400?text=Procerus" },
                    { id: 5, latin: "M. nasalis", uzbek: "Burun mushagi", description: "Burunni toraytiradi - Tarbiyasiz mushak", image: "https://via.placeholder.com/400?text=Nasalis" },
                    { id: 6, latin: "M. levator labii superioris", uzbek: "Yuqori labni ko'taruvchi mushak", description: "Labni ko'taradi - Hamaqat ifodasi", image: "https://via.placeholder.com/400?text=Levator+Labii+Superioris" },
                    { id: 7, latin: "M. levator labii superioris alaeque nasi", uzbek: "Yuqori lab va burun qanotini ko'taruvchi mushak", description: "Burunni ko'taradi - O'ziga xoslik", image: "https://via.placeholder.com/400?text=Levator+Labii+Alae+Nasi" },
                    { id: 8, latin: "M. zygomaticus major", uzbek: "Katta yonoq mushagi", description: "Kulish mushagi - Kulishda qatnashadi", image: "https://via.placeholder.com/400?text=Zygomaticus+Major" },
                    { id: 9, latin: "M. zygomaticus minor", uzbek: "Kichik yonoq mushagi", description: "Labni tortadi - Kichik mushak", image: "https://via.placeholder.com/400?text=Zygomaticus+Minor" },
                    { id: 10, latin: "M. risorius", uzbek: "Kulgich mushagi", description: "Yon tomonga tortadi - Sehrali kuloq", image: "https://via.placeholder.com/400?text=Risorius" },
                    { id: 11, latin: "M. buccinator", uzbek: "Lunj mushagi", description: "Yonoqni bosadi - Sakni tinatadi", image: "https://via.placeholder.com/400?text=Buccinator" },
                    { id: 12, latin: "M. orbicularis oris", uzbek: "Og'iz atrofidagi halqasimon mushak", description: "Og'izni yumadi - Sut emish uchun", image: "https://via.placeholder.com/400?text=Orbicularis+Oris" },
                    { id: 13, latin: "M. depressor anguli oris", uzbek: "Og'iz burchagini tushiruvchi mushak", description: "Xafa ifoda - Qayg'u ifodasi", image: "https://via.placeholder.com/400?text=Depressor+Anguli+Oris" },
                    { id: 14, latin: "M. depressor labii inferioris", uzbek: "Pastki labni tushiruvchi mushak", description: "Labni pastga tortadi - Og'izni ochadi", image: "https://via.placeholder.com/400?text=Depressor+Labii+Inferioris" },
                    { id: 15, latin: "M. mentalis", uzbek: "Iyak mushagi", description: "Iyakni ko'taradi - O'tkazoq ifodasi", image: "https://via.placeholder.com/400?text=Mentalis" },
                    { id: 16, latin: "Platysma", uzbek: "Bo'yinning teri osti mushagi", description: "Yuz mimikasida qatnashadi - Bo'yinda", image: "https://via.placeholder.com/400?text=Platysma" },
                    { id: 17, latin: "M. masseter", uzbek: "Chaynash mushagi", description: "Jag'ni ko'taradi - Eng kuchli mushak", image: "https://via.placeholder.com/400?text=Masseter" },
                    { id: 18, latin: "M. temporalis", uzbek: "Chakka mushagi", description: "Jag'ni yopadi - Chakka sohasida", image: "https://via.placeholder.com/400?text=Temporalis" },
                    { id: 19, latin: "M. pterygoideus medialis", uzbek: "Ichki qanotsimon mushak", description: "Harakatlantiradi - Jag'ni oldinga suradi", image: "https://via.placeholder.com/400?text=Pterygoideus+Medialis" },
                    { id: 20, latin: "M. pterygoideus lateralis", uzbek: "Tashqi qanotsimon mushak", description: "Oldinga suradi - Jag'ni harakatlantiradi", image: "https://via.placeholder.com/400?text=Pterygoideus+Lateralis" }
                ],
                questions: [
                    { id: 4100, questionText: "M. occipitofrontalis qaysi funktsiyani bajaradi?", options: ["Jag'ni ko'taradi", "Peshonani tirishtiradi", "Ko'zni yumadi", "Labni tortadi"], correctAnswer: "Peshonani tirishtiradi" },
                    { id: 4101, questionText: "M. orbicularis oculi qanday mushak?", options: ["Burun mushagi", "Ko'z atrofidagi halqasimon mushak", "Lunj mushagi", "Chaynash mushagi"], correctAnswer: "Ko'z atrofidagi halqasimon mushak" },
                    { id: 4102, questionText: "M. corrugator supercilii nima qiladi?", options: ["Labni ko'taradi", "Qoshlarni tortadi", "Ko'zni yumadi", "Burunni toraytiradi"], correctAnswer: "Qoshlarni tortadi" },
                    { id: 4103, questionText: "M. zygomaticus major qaysi ifodada qatnashadi?", options: ["Xafalik", "Qayg'u", "Kuluq", "Hayrat"], correctAnswer: "Kuluq" },
                    { id: 4104, questionText: "M. buccinator qayda joylashgan?", options: ["Yuzda", "Lunj qismida", "Bo'yinda", "Sochda"], correctAnswer: "Lunj qismida" },
                    { id: 4105, questionText: "M. orbicularis oris nima uchun kerak?", options: ["Og'izni yumadi", "Sut emish", "Tishni egalash", "Barjasi to'g'ri"], correctAnswer: "Barjasi to'g'ri" },
                    { id: 4106, questionText: "M. masseter nima?", options: ["Yuzshuv mushagi", "Chaynash mushagi", "Titirattiruvchi mushak", "Tirishtiruvchi mushak"], correctAnswer: "Chaynash mushagi" },
                    { id: 4107, questionText: "Platysma qayda joylashgan?", options: ["Yuzda", "Ko'kraks", "Bo'yinda", "Oyoqda"], correctAnswer: "Bo'yinda" }
                ]
            }
        ]
    },
    {
        id: 5,
        title: "Tibbiyot: Kalla suyaklari",
        description: "Bosh chanog'i va yuz qismini tashkil etuvchi suyaklar.",
        icon: "S",
        rules: [
            {
                id: 51,
                title: "Kalla suyaklari (Ossa cranii)",
                description: "Miya va yuz qismi suyaklari.",
                explanation: "Vizual model orqali suyaklarni o'rganing.",
                image: "file:///C:/Users/NotebookService/.gemini/antigravity/brain/d5039e09-3714-40e5-a612-19632e30082f/human_skull_anatomy_pro_ultra_1774416218498.png",
                items: [
                    { id: 1, latin: "Os frontale", uzbek: "peshona suyagi", description: "Miya qutisi suyagi - Peshona qismi", image: "https://via.placeholder.com/400?text=Os+Frontale" },
                    { id: 2, latin: "Os parietale", uzbek: "tepa suyagi", description: "Yon va yuqori suyak - Kalla tepasi", image: "https://via.placeholder.com/400?text=Os+Parietale" },
                    { id: 3, latin: "Os temporale", uzbek: "chakka suyagi", description: "Chakka qismi - Quloq joylashgan", image: "https://via.placeholder.com/400?text=Os+Temporale" },
                    { id: 4, latin: "Os occipitale", uzbek: "ensa suyagi", description: "Orqa qism - Kalla orqasi", image: "https://via.placeholder.com/400?text=Os+Occipitale" },
                    { id: 5, latin: "Os sphenoidale", uzbek: "ponasimon suyagi", description: "Asosiy suyak - Markaziy", image: "https://via.placeholder.com/400?text=Os+Sphenoidale" },
                    { id: 6, latin: "Os ethmoidale", uzbek: "g'alvirsimon suyagi", description: "Markaziy suyak - Burun qismi", image: "https://via.placeholder.com/400?text=Os+Ethmoidale" },
                    { id: 7, latin: "processus styloideus", uzbek: "bigizsimon o'siq", description: "O'tkir o'siq - Quloq orqasi", image: "https://via.placeholder.com/400?text=Processus+Styloideus" },
                    { id: 8, latin: "Maxilla", uzbek: "yuqori jag' suyagi", description: "Yuz suyagi - Tishlar poydevori", image: "https://via.placeholder.com/400?text=Maxilla" },
                    { id: 9, latin: "Mandibula", uzbek: "pastki jag' suyagi", description: "Harakatchan suyak - Tishli qism", image: "https://via.placeholder.com/400?text=Mandibula" },
                    { id: 10, latin: "Os zygomaticum", uzbek: "yonoq suyagi", description: "Yuz suyagi - Qoqon qismi", image: "https://via.placeholder.com/400?text=Os+Zygomaticum" },
                    { id: 11, latin: "Os nasale", uzbek: "burun suyagi", description: "Burun qismi - Burun ustuki", image: "https://via.placeholder.com/400?text=Os+Nasale" },
                    { id: 12, latin: "Os lacrimale", uzbek: "ko'z yosh suyagi", description: "Kichik suyak - Ko'z qosasi", image: "https://via.placeholder.com/400?text=Os+Lacrimale" },
                    { id: 13, latin: "Os palatinum", uzbek: "tanglay suyagi", description: "Tanglay qismi - Ko'krak ostagi", image: "https://via.placeholder.com/400?text=Os+Palatinum" },
                    { id: 14, latin: "Concha nasalis inferior", uzbek: "pastki burun chig'anog'i", description: "Burunda - Havoning namlanishi", image: "https://via.placeholder.com/400?text=Concha+Nasalis" },
                    { id: 15, latin: "Vomer", uzbek: "dimog' suyagi", description: "Burun to'sig'i - Markaziy to'siq", image: "https://via.placeholder.com/400?text=Vomer" },
                    { id: 16, latin: "Os hyoideum", uzbek: "til osti suyagi", description: "Bo'yinda - Sustak suyagi", image: "https://via.placeholder.com/400?text=Os+Hyoideum" },
                    { id: 17, latin: "Corpus vertebrae", uzbek: "umurtqa tanasi", description: "Skelet asosi - Omurti qismi", image: "https://via.placeholder.com/400?text=Corpus+Vertebrae" },
                    { id: 18, latin: "Scapula", uzbek: "kurak", description: "Yelka - Orqaning yuqori suyagi", image: "https://via.placeholder.com/400?text=Scapula" },
                    { id: 19, latin: "Clavicula", uzbek: "o'mrov", description: "Suyak - Qo'lni qo'lga bog'laydi", image: "https://via.placeholder.com/400?text=Clavicula" },
                    { id: 20, latin: "Sternum", uzbek: "to'sh suyagi", description: "Oldingi qism - Ko'krak qafasi", image: "https://via.placeholder.com/400?text=Sternum" }
                ],
                questions: [
                    { id: 5100, questionText: "Os frontale qaysi qismi?", options: ["Chapqa suyagi", "Peshona suyagi", "Endi qotibli suyak", "Jag' suyagi"], correctAnswer: "Peshona suyagi" },
                    { id: 5101, questionText: "Os parietale qayerda joylashgan?", options: ["Burun", "Ko'z", "Kalla tepa", "Jag'"], correctAnswer: "Kalla tepa" },
                    { id: 5102, questionText: "Os temporale qanday suyak?", options: ["Peshona", "Chakka qismi", "Endi qotibli", "Jag'"], correctAnswer: "Chakka qismi" },
                    { id: 5103, questionText: "Os occipitale nima?", options: ["Tepa suyagi", "Ensa suyagi", "Peshona", "Burun"], correctAnswer: "Ensa suyagi" },
                    { id: 5104, questionText: "Os sphenoidale qaysi maqamda?", options: ["Cheti", "Markaziy", "Boshi", "Orqasi"], correctAnswer: "Markaziy" },
                    { id: 5105, questionText: "Maxilla qanday suyak?", options: ["Pastki jag'", "Yuqori jag'", "Burun", "Ko'z"], correctAnswer: "Yuqori jag'" },
                    { id: 5106, questionText: "Mandibula nima?", options: ["Yuqori jag' suyagi", "Pastki jag' suyagi", "Burun suyagi", "Kuloq suyagi"], correctAnswer: "Pastki jag' suyagi" },
                    { id: 5107, questionText: "Os zygomaticum qaysi anatomiya qismi?", options: ["Burun", "Yonoq", "Ko'z", "Quloq"], correctAnswer: "Yonoq" }
                ]
            }
        ]
    },
    {
        id: 6,
        title: "Tibbiyot: Kalla choklari",
        description: "Suyaklarning birlashgan joylari va choklar terminologiyasi.",
        icon: "C",
        rules: [
            {
                id: 61,
                title: "Kalla choklari (Suturae cranii)",
                description: "Suyaklarning bir-biri bilan birikishi.",
                explanation: "Vizual metodika orqali choklarni eslab qoling.",
                image: "file:///C:/Users/NotebookService/.gemini/antigravity/brain/d5039e09-3714-40e5-a612-19632e30082f/human_skull_anatomy_pro_ultra_1774416218498.png",
                items: [
                    { id: 1, latin: "Sutura parietomastoidea", uzbek: "teppa-so'rg'ichsimon chok", description: "Chok turi - Tepa va so'rg'ich o'rtasi", image: "https://via.placeholder.com/400?text=Sutura+Parietomastoidea" },
                    { id: 2, latin: "Sutura occipitomastoidea", uzbek: "ensa-so'rg'ichsimon chok", description: "Chok turi - Ensa va so'rg'ichi o'rtasi", image: "https://via.placeholder.com/400?text=Sutura+Occipitomastoidea" },
                    { id: 3, latin: "Sutura temporozygomatica", uzbek: "chakka-yanoq choki", description: "Chok turi - Chakka va yanoq o'rtasi", image: "https://via.placeholder.com/400?text=Sutura+Temporozygomatica" },
                    { id: 4, latin: "Sutura zygomaticomaxillaris", uzbek: "yonoq-yuqori jag' choki", description: "Chok turi - Yonoq va jag' o'rtasi", image: "https://via.placeholder.com/400?text=Sutura+Zygomaticomaxillaris" },
                    { id: 5, latin: "Sutura sphenofrontalis", uzbek: "ponasimon peshana choki", description: "Chok turi - Ponasi va peshona o'rtasi", image: "https://via.placeholder.com/400?text=Sutura+Sphenofrontalis" },
                    { id: 6, latin: "Sutura ethmoidolacrimalis", uzbek: "g'alvirsimon ko'zyosh choki", description: "Chok turi - G'alvirsi va ko'z yosh o'rtasi", image: "https://via.placeholder.com/400?text=Sutura+Ethmoidolacrimalis" },
                    { id: 7, latin: "Sutura coronalis", uzbek: "tojsimon chok", description: "Chok turi - Toj shaklidagi", image: "https://via.placeholder.com/400?text=Sutura+Coronalis" },
                    { id: 8, latin: "Sutura frontozygomatica", uzbek: "peshona-yanoq choki", description: "Chok turi - Peshona va yanoq o'rtasi", image: "https://via.placeholder.com/400?text=Sutura+Frontozygomatica" },
                    { id: 9, latin: "Sutura sphenoparietalis", uzbek: "ponasimon tepa choki", description: "Chok turi - Ponasi va tepa o'rtasi", image: "https://via.placeholder.com/400?text=Sutura+Sphenoparietalis" },
                    { id: 10, latin: "Sutura sagittalis", uzbek: "o'qsimon chok", description: "Markaziy chok - O'q shaklidagi", image: "https://via.placeholder.com/400?text=Sutura+Sagittalis" },
                    { id: 11, latin: "Sutura lambdoidea", uzbek: "lyambdasimon chok", description: "Orqa chok - Lambda shaklidagi", image: "https://via.placeholder.com/400?text=Sutura+Lambdoidea" },
                    { id: 12, latin: "Sutura squamosa", uzbek: "pallasimon chok", description: "Yon chok - Palla shaklidagi", image: "https://via.placeholder.com/400?text=Sutura+Squamosa" },
                    { id: 13, latin: "Sutura serrata", uzbek: "arralangan chok", description: "Shakl turi - Arralangan chaki", image: "https://via.placeholder.com/400?text=Sutura+Serrata" },
                    { id: 14, latin: "Sutura plana", uzbek: "tekis chok", description: "Shakl turi - Tekis chaki", image: "https://via.placeholder.com/400?text=Sutura+Plana" },
                    { id: 15, latin: "Schindylesis", uzbek: "shindilez", description: "Birlashuv - Qo'lg'a o'xshash", image: "https://via.placeholder.com/400?text=Schindylesis" },
                    { id: 16, latin: "Gomphosis", uzbek: "mixsimon birlashuv", description: "Tishlar uchun - Tish birikishi", image: "https://via.placeholder.com/400?text=Gomphosis" },
                    { id: 17, latin: "Synchondrosis", uzbek: "tog'ayli birikish", description: "Birikish - Tog'ay orqali", image: "https://via.placeholder.com/400?text=Synchondrosis" },
                    { id: 18, latin: "Synostosis", uzbek: "suyakli birikish", description: "Birikish - Suyak orqali", image: "https://via.placeholder.com/400?text=Synostosis" },
                    { id: 19, latin: "Syndesmosis", uzbek: "boylamli birikish", description: "Birikish - Boylam orqali", image: "https://via.placeholder.com/400?text=Syndesmosis" },
                    { id: 20, latin: "Sutura incisiva", uzbek: "kesuvchi chok", description: "Jag' qismi - Kesish suyagi", image: "https://via.placeholder.com/400?text=Sutura+Incisiva" }
                ],
                questions: [
                    { id: 6100, questionText: "Sutura sagittalis qaysi chok?", options: ["Orqa chok", "O'q shaklidagi chok", "Toj chok", "Palla chok"], correctAnswer: "O'q shaklidagi chok" },
                    { id: 6101, questionText: "Sutura lambdoidea qanday shakl?", options: ["O'q", "Lambda", "Toj", "Palla"], correctAnswer: "Lambda" },
                    { id: 6102, questionText: "Sutura coronalis nima?", options: ["Orqa chok", "O'q chok", "Toj chok", "Yon chok"], correctAnswer: "Toj chok" },
                    { id: 6103, questionText: "Sutura squamosa qayerda?", options: ["Markazida", "Yon qismida", "Orqasida", "Tepasida"], correctAnswer: "Yon qismida" },
                    { id: 6104, questionText: "Sutura serrata qanday chok?", options: ["Tekis", "Arralangan", "O'q", "Toj"], correctAnswer: "Arralangan" },
                    { id: 6105, questionText: "Gomphosis qayerda joylashgan?", options: ["Kalla", "Tishlar", "Umurtqa", "Qovurg'a"], correctAnswer: "Tishlar" },
                    { id: 6106, questionText: "Synchondrosis qanday birlashuv?", options: ["Suyakli", "Tog'ayli", "Boylamli", "Mixsimon"], correctAnswer: "Tog'ayli" },
                    { id: 6107, questionText: "Synostosis nima degani?", options: ["Boylamli birlashuv", "Tog'ayli birlashuv", "Suyakli birlashuv", "Mixsimon"], correctAnswer: "Suyakli birlashuv" }
                ]
            }
        ]
    }
];
