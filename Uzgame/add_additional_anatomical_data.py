"""
Add additional anatomical topics: Sutures and Muscles
Qolla chiklari va Mushaklari database-ga qo'shish
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.base import TestSet, Question, Option

POSTGRESQL_URL = 'postgresql://postgres:jonibek@127.0.0.1:5432/med'
engine = create_engine(POSTGRESQL_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Additional topics
additional_topics = {
    "Kalla Chiklari (Suturae)": {
        "description": "Bosh suyaklari orasidagi bog'lanishlar",
        "learning_items": [
            {"latin": "sutura parietomastoidea", "uzbek": "tepa-so'rg'ichsimon chok"},
            {"latin": "sutura occipitomastoidea", "uzbek": "ensa-so'rg'ichsimon chok"},
            {"latin": "sutura temporozygomatica", "uzbek": "chakka-yonoq choki"},
            {"latin": "sutura zygomaticomaxillaris", "uzbek": "yonoq-yuqori jag' choki"},
            {"latin": "sutura sphenofrontalis", "uzbek": "ponasimon-peshona choki"},
            {"latin": "sutura ethmoidolacrimalis", "uzbek": "g'alvirsimon-ko'zyosh choki"},
            {"latin": "sutura coronalis", "uzbek": "tojsimon chok"},
            {"latin": "sutura frontozygomatica", "uzbek": "peshona-yonoq choki"},
            {"latin": "sutura sphenoparietalis", "uzbek": "ponasimon-tepa choki"},
            {"latin": "sutura sagittalis", "uzbek": "o'q tekis chok"},
            {"latin": "sutura lambdoidea", "uzbek": "lambda choki"},
            {"latin": "fontanella anterior", "uzbek": "oldingi yumshoq suyak joyish"},
            {"latin": "fontanella posterior", "uzbek": "orqa yumshoq suyak joyish"},
            {"latin": "fontanella sphenoidalis", "uzbek": "ponasimon yumshoq suyak joyish"},
            {"latin": "fontanella mastoidea", "uzbek": "so'rg'ichsimon yumshoq suyak joyish"},
            {"latin": "synchondrosis", "uzbek": "suyak o'rtasidagi yumshok bog'lanish"},
            {"latin": "symphysis", "uzbek": "suyak o'rtasidagi qattiq bog'lanish"},
            {"latin": "syndesmosis", "uzbek": "suyak o'rtasidagi tog'ay bog'lanish"},
            {"latin": "zygomatic arch", "uzbek": "yonoq kamar"},
            {"latin": "temporal bone", "uzbek": "chakka suyagi"},
        ],
        "test_questions": [
            {
                "question": "Tepa-so'rg'ichsimon chok latinca?",
                "options": ["sutura temporozygomatica", "sutura parietomastoidea", "sutura occipitomastoidea", "sutura sphenofrontalis"],
                "correct": 1
            },
            {
                "question": "Ensa-so'rg'ichsimon chok nima?",
                "options": ["sutura occipitomastoidea", "sutura parietomastoidea", "sutura temporozygomatica", "sutura coronalis"],
                "correct": 0
            },
            {
                "question": "Chakka-yonoq choki lotincha?",
                "options": ["sutura temporozygomatica", "sutura sphenofrontalis", "sutura zygomaticomaxillaris", "sutura ethmoidolacrimalis"],
                "correct": 0
            },
            {
                "question": "Yonoq-yuqori jag' choki qanday nomlanadi?",
                "options": ["sutura temporozygomatica", "sutura zygomaticomaxillaris", "sutura sphenofrontalis", "sutura coronalis"],
                "correct": 1
            },
            {
                "question": "Ponasimon-peshona choki latinca?",
                "options": ["sutura sphenofrontalis", "sutura ethmoidolacrimalis", "sutura frontozygomatica", "sutura sphenoparietalis"],
                "correct": 0
            },
            {
                "question": "G'alvirsimon-ko'zyosh choki nima?",
                "options": ["sutura sphenofrontalis", "sutura ethmoidolacrimalis", "sutura frontozygomatica", "sutura coronalis"],
                "correct": 1
            },
            {
                "question": "Tojsimon chok lotincha?",
                "options": ["sutura lambdoidea", "sutura sagittalis", "sutura coronalis", "sutura lambdoidea"],
                "correct": 2
            },
            {
                "question": "Peshona-yonoq choki qanday nomlanadi?",
                "options": ["sutura frontozygomatica", "sutura coronalis", "sutura sphenofrontalis", "sutura ethmoidolacrimalis"],
                "correct": 0
            },
            {
                "question": "Ponasimon-tepa choki latinca?",
                "options": ["sutura sphenoparietalis", "sutura sphenofrontalis", "sutura coronalis", "sutura sagittalis"],
                "correct": 0
            },
            {
                "question": "O'q tekis chok nima?",
                "options": ["sutura sagittalis", "sutura lambdoidea", "sutura coronalis", "sutura temporozygomatica"],
                "correct": 0
            },
            {
                "question": "Lambda choki lotincha?",
                "options": ["sutura sagittalis", "sutura lambdoidea", "sutura coronalis", "sutura temporozygomatica"],
                "correct": 1
            },
            {
                "question": "Oldingi yumshoq suyak joyish nima?",
                "options": ["fontanella posterior", "fontanella anterior", "fontanella sphenoidalis", "fontanella mastoidea"],
                "correct": 1
            },
            {
                "question": "Orqa yumshoq suyak joyish latinca?",
                "options": ["fontanella anterior", "fontanella posterior", "fontanella sphenoidalis", "fontanella mastoidea"],
                "correct": 1
            },
            {
                "question": "Ponasimon yumshoq suyak joyish qanday nomlanadi?",
                "options": ["fontanella anterior", "fontanella sphenoidalis", "fontanella mastoidea", "fontanella anterior"],
                "correct": 1
            },
            {
                "question": "So'rg'ichsimon yumshoq suyak joyish nima?",
                "options": ["fontanella anterior", "fontanella posterior", "fontanella sphenoidalis", "fontanella mastoidea"],
                "correct": 3
            },
            {
                "question": "Synchondrosis nimani anglatadi?",
                "options": ["qattiq bog'lanish", "yumshoq bog'lanish", "tog'ay bog'lanishi", "sust bog'lanish"],
                "correct": 1
            },
            {
                "question": "Symphysis nima?",
                "options": ["suyak o'rtasidagi yumshok bog'lanish", "suyak o'rtasidagi qattiq bog'lanish", "suyak o'rtasidagi tog'ay bog'lanish", "suyak o'rtasidagi ichki bog'lanish"],
                "correct": 1
            },
            {
                "question": "Syndesmosis lotincha?",
                "options": ["yumshoq bog'lanish", "tog'ay bog'lanish", "suyak o'rtasidagi bog'lanish", "qattiq bog'lanish"],
                "correct": 1
            },
            {
                "question": "Yonoq kamar qanday nomlanadi?",
                "options": ["temporal arch", "zygomatic arch", "maxillary arch", "mandibular arch"],
                "correct": 1
            },
            {
                "question": "Chiklarin asosiy vazifasi nima?",
                "options": ["suyaklarni o'zaro bog'lash", "suyaklarga harakat berish", "qon o'tkazish", "nerv o'tkazish"],
                "correct": 0
            },
            {
                "question": "Fontanellalar nimani anglatadi?",
                "options": ["suyak teshiklari", "suyak o'siqlarini", "yumshoq suyak joyishlari", "suyak sinuslari"],
                "correct": 2
            },
            {
                "question": "Sutura saggitalis qaerda joylashgan?",
                "options": ["tepa suyagi o'rtasida", "peshona va ensa o'rtasida", "chakka suyagi o'rtasida", "yonoq suyaklar o'rtasida"],
                "correct": 0
            },
            {
                "question": "Sutura lambdoidea nima?",
                "options": ["tepa va ensa suyaklar o'rtasidagi", "peshona va tepa o'rtasidagi", "chakka va ensa o'rtasidagi", "yonoq va peshona o'rtasidagi"],
                "correct": 0
            },
            {
                "question": "Sutura coronalis qaerda?",
                "options": ["tepa va ensa o'rtasida", "peshona va tepa o'rtasida", "chakka va yonoq o'rtasida", "yuqori jag' va ponasimon o'rtasida"],
                "correct": 1
            },
            {
                "question": "Fontanella anterior qaysi choklar kesishida?",
                "options": ["sagittalis va coronalis", "sagittalis va lambdoidea", "temporozygomatica va sphenofrontalis", "zygomaticomaxillaris va ethmoidolacrimalis"],
                "correct": 0
            },
            {
                "question": "Fontanella posterior qaysi choklar kesishida?",
                "options": ["sagittalis va coronalis", "sagittalis va lambdoidea", "temporozygomatica va sphenofrontalis", "zygomaticomaxillaris va ethmoidolacrimalis"],
                "correct": 1
            },
            {
                "question": "Yonoq kamar qaysi suyaklardan tashkil topgan?",
                "options": ["peshona va tepa", "chakka va yonoq", "yuqori jag' va yonoq", "tepa va ensa"],
                "correct": 2
            },
            {
                "question": "Chiklaring o'sishi jamiyati nima?",
                "options": ["qandaydir harakat", "imobilizatsiya (doimiy bog'lanish)", "harakatlanuvchanligi", "faqat shuya o'tkazish"],
                "correct": 1
            },
            {
                "question": "Temporozygomatica choki qaysi mustahkam joyda?",
                "options": ["yuqorida", "o'rta qismida", "pastka", "tomonda"],
                "correct": 2
            },
            {
                "question": "Sutura parietomastoidea qaysi yonida joylashgan?",
                "options": ["oldingi qismida", "o'rta qismida", "orka qismida", "tomonda"],
                "correct": 3
            },
        ]
    },
    
    "Yuz va Og'iz Mushaklari": {
        "description": "Yuz va og'iz bo'shlig'ining mushatnishaklari",
        "learning_items": [
            {"latin": "M. occipitofrontalis", "uzbek": "peshona-ensa mushagi"},
            {"latin": "M. orbicularis oculi", "uzbek": "ko'z atrofidagi halqasimon mushak"},
            {"latin": "M. corrugator supercilii", "uzbek": "qoshni tirishtiruvchi mushak"},
            {"latin": "M. procerus", "uzbek": "burun usti mushagi"},
            {"latin": "M. nasalis", "uzbek": "burun mushagi"},
            {"latin": "M. levator labii superioris", "uzbek": "yuqori labni ko'taruvchi mushak"},
            {"latin": "M. levator labii superioris alaeque nasi", "uzbek": "yuqori lab va burun qanotini ko'taruvchi mushak"},
            {"latin": "M. zygomaticus major", "uzbek": "katta yonoq mushagi"},
            {"latin": "M. zygomaticus minor", "uzbek": "kichik yonoq mushagi"},
            {"latin": "M. risorius", "uzbek": "kulgich mushagi"},
            {"latin": "M. buccinator", "uzbek": "lunj mushagi"},
            {"latin": "M. orbicularis oris", "uzbek": "og'iz atrofidagi halqasimon mushak"},
            {"latin": "M. depressor anguli oris", "uzbek": "og'iz burchagini tushiruvchi mushak"},
            {"latin": "M. depressor labii inferioris", "uzbek": "pastki labni tushiruvchi mushak"},
            {"latin": "M. mentalis", "uzbek": "iyak mushagi"},
            {"latin": "Platysma", "uzbek": "bo'yinning teri osti mushagi"},
            {"latin": "M. masseter", "uzbek": "chaynov mushagi"},
            {"latin": "M. temporalis", "uzbek": "chakka mushagi"},
            {"latin": "M. mylohyoideus", "uzbek": "pastki jag'–tilosti mushagi"},
            {"latin": "M. digastricus", "uzbek": "ikki qorinchali mushak"},
        ],
        "test_questions": [
            {
                "question": "Peshona-ensa mushagi latinca?",
                "options": ["M. orbicularis oculi", "M. occipitofrontalis", "M. nasalis", "M. procerus"],
                "correct": 1
            },
            {
                "question": "Ko'z atrofidagi halqasimon mushak nima?",
                "options": ["M. corrugator supercilii", "M. orbicularis oculi", "M. procerus", "M. nasalis"],
                "correct": 1
            },
            {
                "question": "Qoshni tirishtiruvchi mushak lotincha?",
                "options": ["M. orbicularis oculi", "M. corrugator supercilii", "M. procerus", "M. nasalis"],
                "correct": 1
            },
            {
                "question": "Burun usti mushagi qanday nomlanadi?",
                "options": ["M. nasalis", "M. procerus", "M. orbicularis oculi", "M. corrugator supercilii"],
                "correct": 1
            },
            {
                "question": "Burun mushagi latinca?",
                "options": ["M. procerus", "M. nasalis", "M. orbicularis oculi", "M. levator labii superioris"],
                "correct": 1
            },
            {
                "question": "Yuqori labni ko'taruvchi mushak nima?",
                "options": ["M. levator labii superioris", "M. depressor labii inferioris", "M. orbicularis oris", "M. buccinator"],
                "correct": 0
            },
            {
                "question": "Yuqori lab va burun qanotini ko'taruvchi mushak lotincha?",
                "options": ["M. levator labii superioris", "M. levator labii superioris alaeque nasi", "M. nasalis", "M. procerus"],
                "correct": 1
            },
            {
                "question": "Katta yonoq mushagi qanday nomlanadi?",
                "options": ["M. zygomaticus minor", "M. zygomaticus major", "M. risorius", "M. buccinator"],
                "correct": 1
            },
            {
                "question": "Kichik yonoq mushagi latinca?",
                "options": ["M. zygomaticus major", "M. zygomaticus minor", "M. risorius", "M. buccinator"],
                "correct": 1
            },
            {
                "question": "Kulgich mushagi nima?",
                "options": ["M. buccinator", "M. risorius", "M. orbicularis oris", "M. nasalis"],
                "correct": 1
            },
            {
                "question": "Lunj mushagi lotincha?",
                "options": ["M. risorius", "M. buccinator", "M. orbicularis oris", "M. depressor anguli oris"],
                "correct": 1
            },
            {
                "question": "Og'iz atrofidagi halqasimon mushak qanday nomlanadi?",
                "options": ["M. buccinator", "M. orbicularis oris", "M. mentalis", "M. risorius"],
                "correct": 1
            },
            {
                "question": "Og'iz burchagini tushiruvchi mushak latinca?",
                "options": ["M. orbicularis oris", "M. depressor anguli oris", "M. depressor labii inferioris", "M. mentalis"],
                "correct": 1
            },
            {
                "question": "Pastki labni tushiruvchi mushak nima?",
                "options": ["M. depressor anguli oris", "M. depressor labii inferioris", "M. mentalis", "M. buccinator"],
                "correct": 1
            },
            {
                "question": "Iyak mushagi qanday nomlanadi?",
                "options": ["M. depressor labii inferioris", "M. mentalis", "M. orbicularis oris", "Platysma"],
                "correct": 1
            },
            {
                "question": "Bo'yinning teri osti mushagi latinca?",
                "options": ["M. sternocleidomastoideus", "Platysma", "M. trapezius", "M. mylohyoideus"],
                "correct": 1
            },
            {
                "question": "Chaynov mushagi lotincha?",
                "options": ["M. temporalis", "M. masseter", "M. mylohyoideus", "M. digastricus"],
                "correct": 1
            },
            {
                "question": "Chakka mushagi nima?",
                "options": ["M. masseter", "M. temporalis", "M. digastricus", "M. mylohyoideus"],
                "correct": 1
            },
            {
                "question": "Pastki jag'–tilosti mushagi latinca?",
                "options": ["M. mylohyoideus", "M. digastricus", "M. stylohyoideus", "M. sternohyoideus"],
                "correct": 0
            },
            {
                "question": "Ikki qorinchali mushak qanday nomlanadi?",
                "options": ["M. mylohyoideus", "M. stylohyoideus", "M. digastricus", "M. sternohyoideus"],
                "correct": 2
            },
            {
                "question": "Yuz mimikasi uchun eng muhim mushaklari qaysi?",
                "options": ["o'ziq tishi mushaklari", "yuz mushatnishaklari", "bo'yn mushaklari", "miyalari"],
                "correct": 1
            },
            {
                "question": "Chaynov harakati uchun asosiy mushaklar qaysi?",
                "options": ["M. buccinator va M. nasalis", "M. masseter va M. temporalis", "M. risorius va M. zygomaticus", "M. orbicularis oris va M. buccinator"],
                "correct": 1
            },
            {
                "question": "Jag'ni ochish uchun ishlaydigan mushak qaysi?",
                "options": ["M. masseter", "M. temporalis", "M. digastricus", "M. mylohyoideus"],
                "correct": 2
            },
            {
                "question": "Surat o'zgartirishdagi eng muhim mushaklar?",
                "options": ["o'ziq tishi mushaklari", "yuz mushatnishaklari (M. zygomaticus, M. orbicularis)", "tannafas mushaklari", "bo'yn mushaklari"],
                "correct": 1
            },
            {
                "question": "Kulgichlik harakati uchun ishlaydigan mushaklar?",
                "options": ["M. risorius va M. zygomaticus", "M. masseter va M. temporalis", "M. buccinator va M. nasalis", "M. orbicularis oris va M. depressor anguli oris"],
                "correct": 0
            },
            {
                "question": "Lablarni yumish uchun ishlaydigan mushak?",
                "options": ["M. levator labii superioris", "M. depressor labii inferioris", "M. orbicularis oris", "M. risorius"],
                "correct": 2
            },
            {
                "question": "Yo'l chiqarish harakati uchun ishlaydigan mushak?",
                "options": ["M. orbicularis oris", "M. buccinator", "M. nasalis", "M. mentalis"],
                "correct": 1
            },
            {
                "question": "Qoshni ko'tarish uchun ishlaydigan mushak?",
                "options": ["M. procerus", "M. occipitofrontalis", "M. corrugator supercilii", "M. nasalis"],
                "correct": 1
            },
            {
                "question": "Tilni harakat qilish uchun ishlaydi?",
                "options": ["M. orbicularis oris", "M. mylohyoideus", "M. buccinator", "M. masseter"],
                "correct": 1
            },
            {
                "question": "Yuz mushatnishakalarining asosiy xususiyati nima?",
                "options": ["suyakga birikgan", "teri solinadi", "qattiq", "ichki organlarni harakat qiladi"],
                "correct": 1
            },
        ]
    },

    "Og'iz Bo'shlig'i Strukturasi": {
        "description": "Og'iz bo'shlig'ining anatomik tarkibi",
        "learning_items": [
            {"latin": "cavitas oris", "uzbek": "og'iz bo'shlig'i"},
            {"latin": "gingiva", "uzbek": "milk"},
            {"latin": "palatum", "uzbek": "tanglay"},
            {"latin": "palatum durum", "uzbek": "qattiq tanglay"},
            {"latin": "palatum molle", "uzbek": "yumshoq tanglay"},
            {"latin": "lingua", "uzbek": "til"},
            {"latin": "labium", "uzbek": "lab"},
            {"latin": "labium superius", "uzbek": "yuqori lab"},
            {"latin": "labium inferius", "uzbek": "pastki lab"},
            {"latin": "bucca", "uzbek": "lunj"},
            {"latin": "mandibula", "uzbek": "pastki jag'"},
            {"latin": "maxilla", "uzbek": "yuqori jag'"},
            {"latin": "articulatio temporomandibularis", "uzbek": "chakka-pastki jag' bo'g'imi"},
            {"latin": "alveolus dentis", "uzbek": "tish katagi"},
            {"latin": "uvula", "uzbek": "tilcha"},
            {"latin": "tonsilla", "uzbek": "bodomcha bez"},
            {"latin": "sulcus gingivalis", "uzbek": "milk uchumligi"},
            {"latin": "junctional epithelium", "uzbek": "bog'lanuv epiteliy"},
            {"latin": "frenulum labii", "uzbek": "lab bog'lamasi"},
            {"latin": "frenulum linguae", "uzbek": "til bog'lamasi"},
            {"latin": "dorsum linguae", "uzbek": "til ustki qismi"},
            {"latin": "apex linguae", "uzbek": "til uchi"},
            {"latin": "radix linguae", "uzbek": "til ildizi"},
            {"latin": "fungiform papillae", "uzbek": "qo'ziqsimon papillalar"},
            {"latin": "circumvallate papillae", "uzbek": "halqasimon papillalar"},
            {"latin": "filiform papillae", "uzbek": "tolali papillalar"},
            {"latin": "hard palate mucosa", "uzbek": "qattiq tanglay mukozasi"},
            {"latin": "soft palate mucosa", "uzbek": "yumshoq tanglay mukozasi"},
            {"latin": "buccal mucosa", "uzbek": "lunj mukozasi"},
            {"latin": "gingival sulcus", "uzbek": "milk uchumligi"},
        ],
        "test_questions": [
            {
                "question": "Og'iz bo'shlig'i latinca?",
                "options": ["cavittas oris", "cavitas oris", "cavita oris", "cavitates oris"],
                "correct": 1
            },
            {
                "question": "Milk nima?",
                "options": ["tish o'rtasidagi to'qimasi", "jag' o'rtasidagi to'qimasi", "yag'ni og'iz bo'shlig'ini qoplaydigan", "tilning qismi"],
                "correct": 2
            },
            {
                "question": "Tanglay latinca?",
                "options": ["labium", "palatum", "lingua", "bucca"],
                "correct": 1
            },
            {
                "question": "Qattiq tanglay qanday nomlanadi?",
                "options": ["palatum molle", "palatum durum", "palatum osseum", "hard palate"],
                "correct": 1
            },
            {
                "question": "Yumshoq tanglay nima?",
                "options": ["palatum durum", "palatum molle", "palatum osseum", "soft palate"],
                "correct": 1
            },
            {
                "question": "Til latinca?",
                "options": ["lingua", "lingue", "linguae", "linguam"],
                "correct": 0
            },
            {
                "question": "Lab lotincha?",
                "options": ["lingua", "labium", "bucca", "maxilla"],
                "correct": 1
            },
            {
                "question": "Yuqori lab qanday nomlanadi?",
                "options": ["labium inferius", "labium superius", "labium majus", "labium minus"],
                "correct": 1
            },
            {
                "question": "Pastki lab latinca?",
                "options": ["labium superius", "labium inferius", "labium majus", "labium minus"],
                "correct": 1
            },
            {
                "question": "Lunj qanday nomlanadi?",
                "options": ["lingua", "maxilla", "bucca", "mandibula"],
                "correct": 2
            },
            {
                "question": "Pastki jag' lotincha?",
                "options": ["maxilla", "mandibula", "mandible", "mandibularis"],
                "correct": 1
            },
            {
                "question": "Yuqori jag' nima?",
                "options": ["mandibula", "maxilla", "maxillaris", "maxillery"],
                "correct": 1
            },
            {
                "question": "Chakka-pastki jag' bo'g'imi latinca?",
                "options": ["articulatio maxillomandibularis", "articulatio temporomandibularis", "articulation temporomaxillaris", "articulation mandibularis"],
                "correct": 1
            },
            {
                "question": "Tish katagi qanday nomlanadi?",
                "options": ["alveolis dentis", "alveolus dentis", "alveoli dentium", "alveoli dentium"],
                "correct": 1
            },
            {
                "question": "Tilcha (uvula) nima?",
                "options": ["tanglay o'siq", "tilning qismi", "tanglay o'rta qismining o'siq qismi", "milk qismi"],
                "correct": 2
            },
            {
                "question": "Bodomcha bez latinca?",
                "options": ["tonsillae", "tonsilla", "tonsilae", "tonsillaris"],
                "correct": 1
            },
            {
                "question": "Milk uchumligi nima?",
                "options": ["sulcus gingivalis", "sulcus palatine", "sulcus linquae", "sulcus buccalis"],
                "correct": 0
            },
            {
                "question": "Bog'lanuv epiteliy qaerda joylashgan?",
                "options": ["til va tish o'rtasida", "tish va milk o'rtasida", "tanglay va tilning kesishmasida", "jag' suyagi va millk o'rtasida"],
                "correct": 1
            },
            {
                "question": "Lab bog'lamasi latinca?",
                "options": ["frenulum linguae", "frenulum labii", "frenulum maxillae", "frenulum mandibulae"],
                "correct": 1
            },
            {
                "question": "Til bog'lamasi nima?",
                "options": ["frenulum labii", "frenulum linguae", "frenulum buccale", "frenulum palatine"],
                "correct": 1
            },
            {
                "question": "Til ustki qismi qanday nomlanadi?",
                "options": ["apex linguae", "dorsum linguae", "radix linguae", "ventral linguae"],
                "correct": 1
            },
            {
                "question": "Til uchi latinca?",
                "options": ["dorsum linguae", "apex linguae", "radix linguae", "ventral linguae"],
                "correct": 1
            },
            {
                "question": "Til ildizi nima?",
                "options": ["apex linguae", "dorsum linguae", "radix linguae", "ventral linguae"],
                "correct": 2
            },
            {
                "question": "Qo'ziqsimon papillalar qaerda?",
                "options": ["til uchida", "til o'rtasida", "til ildizida", "tanglay ustida"],
                "correct": 0
            },
            {
                "question": "Halqasimon papillalar (circumvallate) nima?",
                "options": ["til uchidagi kichik chiqintilar", "til ildizidagi halqasimon strukturalar", "tanglay ustidagi chiqintilar", "lunj teri ustidagi"],
                "correct": 1
            },
            {
                "question": "Tolali papillalar (filiform) qaerda?",
                "options": ["til ustki qismida", "til ildizida", "tanglay ustida", "lunj ustida"],
                "correct": 0
            },
            {
                "question": "Qattiq tanglay mukozasi nima?",
                "options": ["yumshoq tanglay qoplaydigan", "qattiq tanglay qoplaydigan", "tilni qoplaydigan", "jag'ni qoplaydigan"],
                "correct": 1
            },
            {
                "question": "Yumshoq tanglay mukozasi latinca?",
                "options": ["hard palate mucosa", "soft palate mucosa", "palate mucosa", "palatine mucosa"],
                "correct": 1
            },
            {
                "question": "Lunj mukozasi nima?",
                "options": ["buccal mucosa", "gingival mucosa", "palatal mucosa", "lingual mucosa"],
                "correct": 0
            },
            {
                "question": "Og'iz bo'shlig'ining kirish qismi nima?",
                "options": ["orificio oris", "ostium oris", "fauces", "rima oris"],
                "correct": 3
            },
            {
                "question": "Og'iz bo'shlig'ining eng muhim organi qaysi?",
                "options": ["jag'", "tanglay", "til", "tishlar"],
                "correct": 2
            },
        ]
    },
}

try:
    for topic_name, topic_data in additional_topics.items():
        print(f"\nProcessing: {topic_name}")
        
        test_set = TestSet(
            title=topic_name,
            description=topic_data["description"],
            category="Anatomiya",
            difficulty_level="Medium",
            total_questions=len(topic_data["test_questions"])
        )
        session.add(test_set)
        session.commit()
        
        for idx, q_data in enumerate(topic_data["test_questions"], 1):
            question = Question(
                test_set_id=test_set.id,
                question_text=q_data["question"],
                question_number=idx,
                explanation=""
            )
            session.add(question)
            session.commit()
            
            for opt_idx, option_text in enumerate(q_data["options"]):
                option = Option(
                    question_id=question.id,
                    option_text=option_text,
                    is_correct=(opt_idx == q_data["correct"]),
                    option_number=opt_idx + 1
                )
                session.add(option)
            
            session.commit()
        
        print(f"  ✓ {topic_name} - {len(topic_data['test_questions'])} questions added")
    
    print("\n✅ All additional topics added successfully!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    session.rollback()
finally:
    session.close()
