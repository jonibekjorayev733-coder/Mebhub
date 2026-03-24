"""
testnew jadvaliga PostgreSQL da namuna savollar qo'shish
"""
import sys, os
sys.path.insert(0, os.path.dirname(__file__))

from app.models.testnew import TestNew
from app.database import sessionLocal, Base, engine

# Jadval yo'q bo'lsa yaratish
Base.metadata.create_all(bind=engine)

db = sessionLocal()

existing = db.query(TestNew).count()
print(f"Hozirda jadvalda {existing} ta savol bor")

if existing == 0:
    sample_questions = [
        TestNew(
            question="O'zbekistonning poytaxti qaysi shahar?",
            option_a="Toshkent", option_b="Samarqand",
            option_c="Buxoro",   option_d="Namangan",
            correct_index=0, explanation="Toshkent poytaxt",
            difficulty="Oson", points=10),
        TestNew(
            question="2 + 2 = ?",
            option_a="3", option_b="5", option_c="4", option_d="6",
            correct_index=2, explanation="2 + 2 = 4",
            difficulty="Oson", points=10),
        TestNew(
            question="Quyosh sistemasida nechta sayyora bor?",
            option_a="7", option_b="8", option_c="9", option_d="10",
            correct_index=1,
            explanation="8 ta: Merkuriy, Venera, Yer, Mars, Yupiter, Saturn, Uran, Neptun",
            difficulty="O'rta", points=15),
        TestNew(
            question="Eng katta okean qaysi?",
            option_a="Atlantika", option_b="Hind",
            option_c="Arktika",   option_d="Tinch",
            correct_index=3, explanation="Tinch okean eng kattadir",
            difficulty="Oson", points=10),
        TestNew(
            question="Suvning kimyoviy formulasi?",
            option_a="CO2", option_b="NaCl", option_c="O2", option_d="H2O",
            correct_index=3, explanation="Suv = H2O",
            difficulty="Oson", points=10),
        TestNew(
            question="1 km necha metrga teng?",
            option_a="100", option_b="500", option_c="1000", option_d="10000",
            correct_index=2, explanation="1 km = 1000 m",
            difficulty="Oson", points=10),
        TestNew(
            question="Eng uzun daryo qaysi?",
            option_a="Amazonka", option_b="Nil",
            option_c="Yantszi",  option_d="Mississippi",
            correct_index=1, explanation="Nil daryo eng uzun",
            difficulty="Oson", points=10),
        TestNew(
            question="Qaysi sayyora Quyoshga eng yaqin?",
            option_a="Venera", option_b="Yer",
            option_c="Mars",   option_d="Merkuriy",
            correct_index=3, explanation="Merkuriy Quyoshga eng yaqin",
            difficulty="O'rta", points=15),
        TestNew(
            question="O'zbekistonda nechta viloyat mavjud?",
            option_a="10", option_b="11", option_c="12", option_d="14",
            correct_index=2, explanation="12 ta viloyat + Toshkent shahri",
            difficulty="Oson", points=10),
        TestNew(
            question="Insonning normal tana harorati?",
            option_a="35", option_b="36.6", option_c="38", option_d="40",
            correct_index=1, explanation="36.6 daraja Selsiy",
            difficulty="Oson", points=10),
        TestNew(
            question="Oltin kimyoviy belgisi?",
            option_a="Ag", option_b="Fe", option_c="Au", option_d="Cu",
            correct_index=2, explanation="Au - Aurum (lotincha)",
            difficulty="Qiyin", points=20),
        TestNew(
            question="DNK qayerda joylashgan?",
            option_a="Mitoxondriya", option_b="Ribosom",
            option_c="Yadro",        option_d="Xloroplast",
            correct_index=2, explanation="DNK hujayraning yadrosida",
            difficulty="O'rta", points=15),
        TestNew(
            question="Pi soni taxminiy qiymati?",
            option_a="2.14", option_b="3.14", option_c="4.14", option_d="1.41",
            correct_index=1, explanation="Pi = 3.14159...",
            difficulty="O'rta", points=15),
        TestNew(
            question="Yer Quyosh atrofida necha kunda aylanadi?",
            option_a="30", option_b="180", option_c="365", option_d="400",
            correct_index=2, explanation="365 kun = 1 yil",
            difficulty="O'rta", points=15),
        TestNew(
            question="Atom tarkibidagi zarrachalar?",
            option_a="Molekula", option_b="Elektron, Proton, Neytron",
            option_c="Ion",      option_d="Kristall",
            correct_index=1, explanation="Atom: elektron, proton, neytron",
            difficulty="O'rta", points=15),
        TestNew(
            question="Katta odamda nechta tish bor?",
            option_a="28", option_b="30", option_c="32", option_d="36",
            correct_index=2, explanation="32 tish (aql tishi bilan)",
            difficulty="O'rta", points=15),
        TestNew(
            question="Prezident Mirziyoyev qachondan?",
            option_a="2014", option_b="2016", option_c="2018", option_d="2020",
            correct_index=1, explanation="2016 yildan prezident",
            difficulty="O'rta", points=15),
        TestNew(
            question="Samarqand qachon qurilgan?",
            option_a="1-asr", option_b="3-asr",
            option_c="5-asr mil.avv.", option_d="7-asr",
            correct_index=2, explanation="2700 yil oldin qurilgan",
            difficulty="Qiyin", points=20),
    ]

    db.add_all(sample_questions)
    db.commit()
    print(f"✅ {len(sample_questions)} ta savol muvaffaqiyatli qo'shildi!")
else:
    print(f"ℹ️  Jadvalda allaqachon {existing} ta savol bor. Seed bekor qilindi.")

db.close()
