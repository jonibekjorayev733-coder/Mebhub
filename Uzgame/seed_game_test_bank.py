from app.database import Base, engine, sessionLocal
from app.models.game_test_bank import GameTestBank


def seed_if_empty(db, game_key, items):
    existing = db.query(GameTestBank).filter(GameTestBank.game_key == game_key).count()
    if existing > 0:
        print(f"{game_key}: skip ({existing} ta bor)")
        return

    rows = [
        GameTestBank(
            game_key=game_key,
            question=item["q"],
            option_a=item["opts"][0],
            option_b=item["opts"][1],
            option_c=item["opts"][2],
            option_d=item["opts"][3],
            correct_index=item["correct"],
            explanation=item.get("explanation", ""),
            difficulty=item.get("difficulty", "Oson"),
            points=item.get("points", 10),
            is_active=True,
        )
        for item in items
    ]
    db.add_all(rows)
    db.commit()
    print(f"{game_key}: seeded {len(rows)} ta")


millionaire_items = [
    {"q": "O'zbekiston poytaxti?", "opts": ["Toshkent", "Samarqand", "Buxoro", "Navoiy"], "correct": 0, "difficulty": "Oson", "explanation": "Toshkent poytaxt", "points": 100},
    {"q": "2 + 2 = ?", "opts": ["3", "4", "5", "6"], "correct": 1, "difficulty": "Oson", "explanation": "4", "points": 500},
    {"q": "Suv formulasi?", "opts": ["CO2", "H2O", "O2", "NaCl"], "correct": 1, "difficulty": "Oson", "explanation": "H2O", "points": 1000},
    {"q": "Eng katta okean?", "opts": ["Atlantika", "Hind", "Tinch", "Arktika"], "correct": 2, "difficulty": "O'rta", "explanation": "Tinch", "points": 5000},
    {"q": "9 * 9 = ?", "opts": ["72", "81", "91", "99"], "correct": 1, "difficulty": "O'rta", "explanation": "81", "points": 10000},
    {"q": "Yer Quyosh atrofida necha kunda aylanadi?", "opts": ["30", "180", "365", "400"], "correct": 2, "difficulty": "O'rta", "explanation": "365 kun", "points": 25000},
    {"q": "Au qaysi element?", "opts": ["Kumush", "Temir", "Oltin", "Mis"], "correct": 2, "difficulty": "Qiyin", "explanation": "Au = Oltin", "points": 50000},
    {"q": "Pi taxminiy qiymati?", "opts": ["2.14", "3.14", "4.14", "1.14"], "correct": 1, "difficulty": "Qiyin", "explanation": "3.14", "points": 100000},
    {"q": "DNK qayerda?", "opts": ["Yadro", "Ribosoma", "Mitoxondriya", "Sitoplazma"], "correct": 0, "difficulty": "Qiyin", "explanation": "Asosan yadroda", "points": 500000},
    {"q": "2 ning 5-darajasi?", "opts": ["16", "24", "32", "64"], "correct": 2, "difficulty": "Qiyin", "explanation": "32", "points": 1000000},
]

davlat_items = [
    {"q": "Fransiya poytaxti?", "opts": ["Madrid", "Parij", "Berlin", "Rim"], "correct": 1, "difficulty": "Oson", "explanation": "Parij", "points": 10},
    {"q": "Yaponiya poytaxti?", "opts": ["Tokyo", "Seul", "Pekin", "Bangkok"], "correct": 0, "difficulty": "Oson", "explanation": "Tokyo", "points": 10},
    {"q": "Germaniya poytaxti?", "opts": ["Myunxen", "Berlin", "Hamburg", "Bonn"], "correct": 1, "difficulty": "Oson", "explanation": "Berlin", "points": 10},
    {"q": "Braziliya poytaxti?", "opts": ["Rio", "Sao Paulo", "Brazilia", "Salvador"], "correct": 2, "difficulty": "O'rta", "explanation": "Brazilia", "points": 10},
    {"q": "Kanada poytaxti?", "opts": ["Toronto", "Ottava", "Vankuver", "Montreal"], "correct": 1, "difficulty": "O'rta", "explanation": "Ottava", "points": 10},
    {"q": "Italiya poytaxti?", "opts": ["Milan", "Rim", "Neapol", "Turin"], "correct": 1, "difficulty": "O'rta", "explanation": "Rim", "points": 10},
    {"q": "Qozog'iston poytaxti?", "opts": ["Olmaota", "Astana", "Shimkent", "Taraz"], "correct": 1, "difficulty": "O'rta", "explanation": "Astana", "points": 10},
    {"q": "Turkiya poytaxti?", "opts": ["Istanbul", "Anqara", "Izmir", "Bursa"], "correct": 1, "difficulty": "O'rta", "explanation": "Anqara", "points": 10},
    {"q": "Misr poytaxti?", "opts": ["Qohira", "Iskandariya", "Giza", "Luksor"], "correct": 0, "difficulty": "Qiyin", "explanation": "Qohira", "points": 10},
    {"q": "Avstraliya poytaxti?", "opts": ["Sidney", "Melburn", "Kanberra", "Pert"], "correct": 2, "difficulty": "Qiyin", "explanation": "Kanberra", "points": 10},
]

shumod_items = [
    {"q": "5 + 3 = ?", "opts": ["7", "8", "9", "10"], "correct": 1, "difficulty": "Oson", "explanation": "8", "points": 5},
    {"q": "12 × 5 = ?", "opts": ["50", "55", "60", "65"], "correct": 2, "difficulty": "O'rta", "explanation": "60", "points": 10},
    {"q": "100 ÷ 4 = ?", "opts": ["20", "25", "30", "35"], "correct": 1, "difficulty": "O'rta", "explanation": "25", "points": 10},
    {"q": "2⁴ = ?", "opts": ["8", "16", "24", "32"], "correct": 1, "difficulty": "O'rta", "explanation": "16", "points": 10},
    {"q": "√81 = ?", "opts": ["8", "9", "10", "11"], "correct": 1, "difficulty": "O'rta", "explanation": "9", "points": 10},
    {"q": "25% of 80 = ?", "opts": ["15", "20", "25", "30"], "correct": 1, "difficulty": "O'rta", "explanation": "20", "points": 10},
    {"q": "12 - (-8) = ?", "opts": ["4", "14", "20", "24"], "correct": 2, "difficulty": "O'rta", "explanation": "20", "points": 10},
    {"q": "3/4 + 1/4 = ?", "opts": ["1/2", "1", "5/4", "2"], "correct": 1, "difficulty": "O'rta", "explanation": "1", "points": 10},
    {"q": "0.5 × 0.2 = ?", "opts": ["0.1", "0.05", "1", "0.7"], "correct": 0, "difficulty": "O'rta", "explanation": "0.1", "points": 10},
    {"q": "x + 5 = 12 bo'lsa x = ?", "opts": ["5", "7", "10", "12"], "correct": 1, "difficulty": "O'rta", "explanation": "7", "points": 10},
]

yugurish_poyezdi_items = [
    {"q": "Sprinter 100 metrni 12 soniyada yugurdi. O'rtacha tezligi qancha?", "opts": ["6.3 m/s", "8.3 m/s", "10 m/s", "12 m/s"], "correct": 1, "difficulty": "O'rta", "explanation": "v = s/t = 100/12 ≈ 8.3 m/s", "points": 12},
    {"q": "Marafon masofasi qancha?", "opts": ["21.1 km", "42.195 km", "50 km", "100 km"], "correct": 1, "difficulty": "Oson", "explanation": "Rasmiy marafon masofasi 42.195 km", "points": 10},
    {"q": "Agar jamoa 1 har to'g'ri javobda 14% oldinga yursa, 5 ta to'g'ri javobdan keyin nechaga yetadi?", "opts": ["56%", "60%", "70%", "84%"], "correct": 2, "difficulty": "O'rta", "explanation": "14 × 5 = 70%", "points": 12},
    {"q": "Qaysi biri yugurishdan oldingi eng to'g'ri qizish mashqi?", "opts": ["Statik o'tirish", "Dinamik qizish", "Darhol sprint", "Faqat suv ichish"], "correct": 1, "difficulty": "Oson", "explanation": "Dinamik qizish mushaklarni ishga tayyorlaydi", "points": 10},
    {"q": "400 metr yugurishda odatda nechta aylana yuguriladi (stadion 400m bo'lsa)?", "opts": ["0.5", "1", "2", "4"], "correct": 1, "difficulty": "Oson", "explanation": "400m trekda 400m = 1 aylana", "points": 10},
    {"q": "Yugurishda nafas olish ritmi uchun yaxshi usul qaysi?", "opts": ["Nafasni ushlab turish", "Tasodifiy nafas", "Ritmik nafas", "Faqat og'izdan"], "correct": 2, "difficulty": "O'rta", "explanation": "Ritmik nafas olish chidamlilikni oshiradi", "points": 12},
    {"q": "Agar Team 2 3 ta noto'g'ri javob qilsa va umuman oldinga yurmasa, Team 1 4 ta to'g'ri javob bersa (14%), farq qancha bo'ladi?", "opts": ["42%", "56%", "60%", "70%"], "correct": 1, "difficulty": "O'rta", "explanation": "Team 1: 14 × 4 = 56%, Team 2: 0%", "points": 12},
    {"q": "Yugurishda finishga yaqin qismda tezlikni oshirish nima deyiladi?", "opts": ["Recovery", "Sprint finish", "Cooldown", "Plank"], "correct": 1, "difficulty": "Oson", "explanation": "Finish oldidan sprint finish ishlatiladi", "points": 10},
    {"q": "Qaysi poyabzal yugurish uchun mosroq?", "opts": ["Tovoni qattiq etik", "Yugurish krossovkasi", "Sandal", "Shippak"], "correct": 1, "difficulty": "Oson", "explanation": "Yugurish krossovkasi amortizatsiya beradi", "points": 10},
    {"q": "Yugurishdan keyin mushak tiklanishi uchun eng foydali odat?", "opts": ["Suv ichmaslik", "Cooldown va cho'zilish", "Darhol yotib qolish", "Ovqat yemay yurish"], "correct": 1, "difficulty": "O'rta", "explanation": "Cooldown va cho'zilish tiklanishni tezlashtiradi", "points": 12},
    {"q": "30 soniyada 150 metr yugurilgan bo'lsa, tezlik qancha?", "opts": ["3 m/s", "4 m/s", "5 m/s", "6 m/s"], "correct": 2, "difficulty": "O'rta", "explanation": "v = 150/30 = 5 m/s", "points": 12},
    {"q": "Jamoaviy yugurish viktorinasida motivatsiya uchun eng muhim omil qaysi?", "opts": ["Bir-birini qo'llab-quvvatlash", "Faqat tanqid", "Sukut", "Faqat individual o'yin"], "correct": 0, "difficulty": "Oson", "explanation": "Jamoaviy qo'llab-quvvatlash natijani oshiradi", "points": 10},
]

bilimli_items = [
    {"q": "Albert Eynshteyn kimdir?", "opts": ["Fizikamedlyaksabab birlashma", "Fizikamedlyaksabab", "Biologiyadagi birlashma", "Chemist"], "correct": 0, "difficulty": "Oson", "explanation": "Albert Eynshteyn mashhur fizikachi", "points": 10},
    {"q": "Quyosh sistemamizda nechta sayyora?", "opts": ["7", "8", "9", "10"], "correct": 1, "difficulty": "Oson", "explanation": "8 ta sayyora: Merkuriy, Venera, Yer, Mars, Yupiter, Saturn, Uran, Neptun", "points": 10},
    {"q": "Eng katta okean?", "opts": ["Atlantika", "Hind", "Tinch", "Arktika"], "correct": 2, "difficulty": "Oson", "explanation": "Tinch okean eng katta", "points": 10},
    {"q": "Yer Quyosh atrofida necha kunda aylanadi?", "opts": ["250", "300", "365", "400"], "correct": 2, "difficulty": "O'rta", "explanation": "365 kun - bir yil", "points": 12},
    {"q": "DNA nimani anglatadi?", "opts": ["Digital Network Access", "Deoxyribonucleic Acid", "Data Nucleic Assembly", "DNA Network Archive"], "correct": 1, "difficulty": "O'rta", "explanation": "DNA = Deoxyribonucleic Acid, hayot uchun muhim", "points": 12},
    {"q": "Eng uzun darya?", "opts": ["Amazon", "Nil", "Yantszi", "Missisippi"], "correct": 1, "difficulty": "O'rta", "explanation": "Nil darya - eng uzun", "points": 12},
    {"q": "Pi taxminiy qiymati?", "opts": ["2.14", "3.14", "4.14", "5.14"], "correct": 1, "difficulty": "Qiyin", "explanation": "Pi ≈ 3.14159...", "points": 15},
    {"q": "Au kimyoviy elementida qaysi metal?", "opts": ["Kumush", "Temir", "Oltin", "Mis"], "correct": 2, "difficulty": "Qiyin", "explanation": "Au = Oltin", "points": 15},
    {"q": "Eng kattaetapi yuqori tog'?", "opts": ["Everest", "K2", "Kilimanjaro", "McKinley"], "correct": 0, "difficulty": "Oson", "explanation": "Everest 8848 metr", "points": 10},
    {"q": "Yer qancha yoshda?", "opts": ["2 milliard yil", "3 milliard yil", "4.5 milliard yil", "5 milliard yil"], "correct": 2, "difficulty": "Qiyin", "explanation": "Yer taxminiy 4.5 milliard yil eski", "points": 15},
    {"q": "Qaysi davlat eng katta kontinent?", "opts": ["Rossiya", "Kanada", "Avstraliya", "Braziliya"], "correct": 0, "difficulty": "O'rta", "explanation": "Rossiya eng katta davlat", "points": 12},
    {"q": "Baxriddan yigindisi?", "opts": ["5", "6", "7", "8"], "correct": 1, "difficulty": "Oson", "explanation": "5 + 1 = 6", "points": 10},
]


if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    db = sessionLocal()
    try:
        seed_if_empty(db, "millionaire", millionaire_items)
        seed_if_empty(db, "davlatni_topish", davlat_items)
        seed_if_empty(db, "shumod", shumod_items)
        seed_if_empty(db, "yugurish_poyezdi", yugurish_poyezdi_items)
        seed_if_empty(db, "bilimli_oquvchi", bilimli_items)
        # Create baraban if doesn't exist (alias for millionaire format)
        seed_if_empty(db, "baraban", millionaire_items)
    finally:
        db.close()
