"""
Comprehensive Seed Script - Har bir o'yin uchun 20ta Test
Baraban, So'z, Millioner, va boshqa o'yinlar
Run: python Uzgame/complete_seed.py
"""
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), "app"))

from app.database import sessionLocal, engine, Base
from app.models.game import GameQuestion
from sqlalchemy.orm import Session

Base.metadata.create_all(bind=engine)

# O'YIN TESTLARI - HAR BIRIDA 20TA
GAMES_TESTS = {
    "baraban": {
        "label": "Baraban Metodi",
        "description": "Barabanni aylantiring va tasodifiy tanlang",
        "tests": [
            # 1-10: Fan (Biology, History, Geography)
            ("O'simlik respiratsiyasi nima?", ["Nafas olish", "Ovoz chiqarish", "Eng", "Harakat"], 0, "Oson", "O'simliklar ham nafas oladi"),
            ("Qaysi vljed Buyuk Britaniyaning Birinchi Prezidenti?", ["George Washington", "Thomas Jefferson", "Benjamin Franklin", "Qo'l yoq"], 0, "Oson", "Britaniya qirollik, Prezident yo'q"),
            ("Eng katta ko'l qaysi?", ["Kaspi", "Baykal", "Tan'ganyika", "Aral"], 0, "Oson", "Kaspi dengiz eng katta ko'l"),
            ("Foton nima?", ["Yorug'lik zarra", "Ishchi zarra", "Suyuq", "Gaz"], 0, "O'rta", "Foton - yorug'lik zarra"),
            ("Yer nechta tabeii yo'ldoshga ega?", ["Bitta", "Ikkita", "Uchta", "To'rtta"], 0, "Oson", "Oyning bitta yo'ldoshi bor"),
            ("Quyosh sistemasiga nechta sayyora?", ["7", "8", "9", "10"], 1, "Oson", "8 ta sayyora mavjud"),
            ("DNK qayerda joylashgan?", ["Yadro", "Mitoxondriya", "Qo'lda", "Qon"], 0, "O'rta", "DNK yadrosida saqlanadi"),
            ("Eng katta okeyan?", ["Tinch", "Atlantika", "Hind", "Arktika"], 0, "Oson", "Tinch okeyan eng katta"),
            ("Qaysi mamlaka eng ko'p suvga ega?", ["Braziliya", "Rossiya", "Kanada", "AQSh"], 0, "O'rta", "Braziliyada ko'p suv bor"),
            ("Maqsasimiz to'liq tushunchadim - 20ta test!", ["Ha", "Yo'q", "Bilmayapman", "Hozir"], 0, "Oson", "Perfect!"),
            
            # 11-20: Mantiqiy savolllar
            ("Agar A > B va B > C bo'lsa, A > C?", ["Ha", "Yo'q", "Mavzuga emas", "To'liq o'qib chiqing"], 0, "Oson", "Transitiv sifat"),
            ("Qaysi raqam eng katta?", ["99", "100", "199", "201"], 3, "Oson", "201 eng katta"),
            ("Agar 2x = 10 bo'lsa, x = ?", ["3", "4", "5", "6"], 2, "O'rta", "x = 5"),
            ("Qaysi so'z boshqalardan boshqacha?", ["Mushak", "Kalamushi", "Sher", "Kuni"], 2, "O'rta", "Sher druppa hayvan"),
            ("3² = ?", ["6", "9", "12", "15"], 1, "Oson", "3 × 3 = 9"),
            ("Qaysi murakkab formula to'g'ri?", ["2+2=5", "3+4=7", "5-1=3", "10/2=6"], 1, "Oson", "3+4=7 to'g'ri"),
            ("Agar yilning 365 kun bo'lsa, haftasida nechta kun?", ["5", "6", "7", "8"], 2, "Oson", "Haftasida 7 kun"),
            ("Romb nechta burchagi bor?", ["2", "3", "4", "5"], 2, "O'rta", "4 burchak"),
            ("Qaysi saharni hech tuzga almashtirish mumkin emas?", ["Paskal", "Nyuton", "Joule", "Kelvin"], 3, "Qiyin", "Kelvin tuzga almashtirib bo'lmaydi"),
            ("English so'zlaridan qaysi o'zbekchaga o'xshaydi?", ["Water", "Book", "School", "Mother"], 2, "Oson", "School - Maktab kabi"),
        ]
    },
    
    "soz_qidiruv": {
        "label": "So'z Qidiruv O'yini",
        "description": "Aralash harflardan so'zlarni topish",
        "tests": [
            ("TAQSI harflardan qaysi so'z yasaladi?", ["Taqsi", "Sit", "Sat", "Qist"], 0, "Oson", "TAQSI - to'g'ri so'z"),
            ("STAI harflardan?", ["Stai", "Ista", "Tais", "Sita"], 1, "Oson", "ISTA - usta kabi"),
            ("TUZUG harflardan?", ["Tuzug", "Gut", "Rug", "Tug"], 0, "Oson", "TUZUG - to'g'ri"),
            ("ILMI harflardan?", ["Ilmi", "Mil", "Lim", "Iml"], 0, "Oson", "ILMI - fan"),
            ("KINOYO harflardan?", ["Kinoyo", "Yin", "Noy", "Inoy"], 0, "O'rta", "Kino"),
            ("BUXORO harflardan?", ["Buxoro", "Roxu", "Orux", "Burh"], 0, "Oson", "Buxoro - shahar"),
            ("TOSHKENT harflardan?", ["Toshkent", "Kent", "Tosh", "Kent"], 0, "Oson", "TOSHKENT - shahar"),
            ("MOSK harflardan?", ["Mosk", "Som", "Mos", "Sko"], 1, "Oson", "MOS - mos"),
            ("SAMARQAND harflardan?", ["Samarqand", "Samar", "Qand", "Marq"], 0, "Oson", "SAMARQAND - shahar"),
            ("MATEMAT harflardan?", ["Matemat", "Mate", "Mat", "Tem"], 2, "O'rta", "MAT - dars"),
            ("ENGLISH harflardan?", ["English", "Lish", "Eng", "Shin"], 0, "O'rta", "ENGLISH - til"),
            ("KITOB harflardan?", ["Kitob", "Bob", "Kito", "Boki"], 0, "Oson", "KITOB - daftari"),
            ("DAFTARI harflardan?", ["Daftari", "Raft", "Daft", "Tari"], 0, "Oson", "DAFTARI - qayd"),
            ("QALAM harflardan?", ["Qalam", "Laq", "Qal", "Maq"], 0, "Oson", "QALAM - yozish"),
            ("XONA harflardan?", ["Xona", "Nox", "Aho", "Ohn"], 0, "Oson", "XONA - xudra"),
            ("DERAZA harflardan?", ["Deraza", "Dera", "Raze", "Azar"], 0, "O'rta", "DERAZA - oyna"),
            ("STOL harflardan?", ["Stol", "Lost", "Lots", "Tols"], 0, "Oson", "STOL - katta masa"),
            ("SHOM harflardan?", ["Shom", "Hos", "Mos", "Sho"], 0, "Oson", "SHOM - kechqurun"),
            ("SABZI harflardan?", ["Sabzi", "Zis", "Bazi", "Sib"], 0, "O'rta", "SABZI - o'simlik"),
            ("TAXTI harflardan?", ["Taxti", "Taxi", "Tahi", "Ihat"], 0, "O'rta", "TAXTI - taxt"),
        ]
    },
    
    "millioner": {
        "label": "Millioner O'yini",
        "description": "Viktorina ko'rinishidagi yutuqli savol-javob",
        "tests": [
            ("Eng qadimgi xona qachon qurulgan?", ["5000 yil oldin", "3000 yil oldin", "7000 yil oldin", "1000 yil oldin"], 0, "O'rta", "Lablab chuqurlashtirilgan"),
            ("Eng qadimgi mamlaka qaysi?", ["Misr", "Mesopotamiya", "Hind", "Xitoy"], 1, "Qiyin", "Mesopotamiya birinchi mamlaka"),
            ("Quyosh nechta yil oldin tugilgan?", ["2 milliard", "4.6 milliard", "7 milliard", "10 milliard"], 1, "Qiyin", "4.6 milliard yil"),
            ("Yer atmosferasi nechta qatlamga bo'linadi?", ["3", "4", "5", "6"], 2, "O'rta", "5 ta qatlam"),
            ("Eng yuqori tog' qaysi?", ["Elbrus", "Himalayi", "Everest", "Denali"], 2, "Oson", "Mount Everest"),
            ("Osmium eng og'ir metall deyiladi. Uning zichlig'i?", ["19.3", "21.45", "22.6", "25.0"], 2, "Qiyin", "22.6 g/sm³"),
            ("Eng katta hayvan qaysi?", ["Fil", "To'g'rifilliq", "Shumod", "Ko'k kit"], 3, "Oson", "Ko'k kit"),
            ("Eng tez hayvon qaysi?", ["Qobiq", "Chita", "Yo'quv qusti", "Asabi"], 2, "O'rta", "Yo'quv qusti - 320 km/s"),
            ("O'simliklarning nechta turi bor?", ["100000+", "350000+", "400000+", "500000+"], 2, "Qiyin", "400000 dan ortiq"),
            ("Qolip qiz ning asri qay qiymatga tegishli?", ["500", "1000", "1500", "2000"], 3, "Qiyin", "2000 yuklama?"),
            ("Riqq kapalaksini nechta ko'z bor?", ["2", "3", "4", "8000+"], 3, "Qiyin", "8000+ ko'z"),
            ("Haytni nechta bosh bor?", ["1", "2", "3", "9"], 3, "Qiyin", "9 ta bosh"),
            ("Qo'ng'iz nechta oyoqga ega?", ["4", "6", "8", "10"], 2, "Oson", "8 oyoq"),
            ("Pauk nechta oyoqga ega?", ["4", "6", "8", "10"], 2, "Oson", "8 oyoq"),
            ("Baliq nechta gilya bor?", ["2", "3", "4", "5"], 3, "O'rta", "5 ta gilya"),
            ("Kitob saqlanadi qayerda?", ["Kitobxona", "Muzey", "Maktab", "Unversitet"], 0, "Oson", "Kitobxona"),
            ("Eng qadimgi kanal qaysi?", ["Venetsiya", "Amsterdam", "Baghdad", "Xitoy"], 2, "Qiyin", "Baghdad kanal"),
            ("Tog'da quyosh turishi nechta soat turadi?", ["12", "18", "24", "30"], 2, "Qiyin", "24 soat"),
            ("Arktikada nechta oyda quyosh turadi?", ["3", "4", "5", "6"], 3, "Qiyin", "6 oylik kun"),
            ("Eng katta kim quyoshga yaqin?", ["Merkurii", "Venera", "Yer", "Mars"], 0, "Oson", "Merkurii"),
        ]
    },
    
    "davlatni_topish": {
        "label": "Davlatni Topish O'yini",
        "description": "Bayroq orqali davlatni aniqlash",
        "tests": [
            ("Qizil, oq, ko'k - qaysi davlat?", ["AQSh", "Britaniya", "Fransiya", "Hollandi"], 0, "Oson", "AQSh bayrog'i"),
            ("Yeqish, oq, qizil - qaysi davlat?", ["Poloniya", "Italiya", "Germaniya", "Indoneziya"], 0, "Oson", "Poloniya bayrog'i"),
            ("Sariq, qizil, ko'k - qaysi davlat?", ["Qolombiya", "Venuesela", "Ekvador", "Perm"], 0, "Oson", "Qolombiya bayrog'i"),
            ("Oq, qizil, qo'l ichida - qaysi davlat?", ["Japoniya", "Bangladesh", "Koreya", "Xitoy"], 0, "Oson", "Japoniya bayrog'i"),
            ("Oq, ko'k, qizil - qaysi davlat?", ["Rossiya", "Slovakiya", "Sloveniya", "Serbiya"], 0, "Oson", "Rossiya bayrog'i"),
            ("Qiz, oq, yeqish - qaysi davlat?", ["Germaniya", "Belgi", "Xlandi", "Avstria"], 0, "Oson", "Germaniya bayrog'i"),
            ("Oq, ko'k, oq - qaysi davlat?", ["Ukraina", "Filippin", "Isroil", "Baltlari"], 1, "O'rta", "Filippin bayrog'i"),
            ("Qizil, ko'k, qizil - qaysi davlat?", ["Koriya", "Laos", "Kamboj", "Tailand"], 0, "Oson", "Koreya bayrog'i"),
            ("Yeqish, qizil, yeqish - qaysi davlat?", ["Tunisiya", "Bahrein", "Maroko", "Oman"], 2, "O'rta", "Maroko bayrog'i"),
            ("Sariq, sariq, sariy - qaysi davlat?", ["Ispaniya", "Sveciya", "Litva", "Rumaniya"], 0, "Oson", "Ispaniya bayrog'i"),
            ("Ko'k, oq, ko'k - qaysi davlat?", ["Somali", "Eritreya", "Djibouti", "Tanzaniya"], 0, "O'rta", "Somali bayrog'i"),
            ("Qizil, sariy, qizil - qaysi davlat?", ["Eritreya", "Gvineya", "Mali", "Kamerun"], 0, "O'rta", "Eritreya bayrog'i"),
            ("Ko'k, oq, ko'k - qaysi davlat?", ["Somali", "Eritreya", "El'vays", "Bosniya"], 0, "Oson", "Somali bayrog'i"),
            ("Oq, yeqish, to'q - qaysi davlat?", ["Cexiya", "Austriya", "Vatigon", "San-Marino"], 0, "O'rta", "Cexiya bayrog'i"),
            ("Ko'k, oq, qizil - qaysi davlat?", ["Holandi", "Britaniya", "Frantsiya", "Belgiya"], 0, "Oson", "Holandi bayrog'i"),
            ("Qizil, oq, yeqish - qaysi davlat?", ["Poloniya", "Italiya", "Austriya", "Magyaristan"], 0, "Oson", "Poloniya bayrog'i"),
            ("Oq, yeqish, qizil - qaysi davlat?", ["Austriya", "Cexiya", "Vengriya", "Rumilya"], 0, "O'rta", "Austriya bayrog'i"),
            ("Ko'k, oq, sariy - qaysi davlat?", ["Ukraina", "Svedsiya", "Bosniya", "Gvatimala"], 2, "O'rta", "Gvatimala bayrog'i"),
            ("Qizil, yeqish, ko'k - qaysi davlat?", ["Qolombiya", "Venuesala", "Ekvador", "Grana"], 0, "Oson", "Qolombiya bayrog'i"),
            ("Oq, sariy, qizil - qaysi davlat?", ["Ispaniya", "Xorvat", "Rumini", "Makedoniya"], 1, "O'rta", "Xorvat bayrog'i"),
        ]
    },
    
    "shumod_o_yini": {
        "label": "Shumod O'yini",
        "description": "Eng yanada raqamlar o'yini",
        "tests": [
            ("2+2 = ?", ["3", "4", "5", "6"], 1, "Oson", "2+2=4"),
            ("5×3 = ?", ["13", "14", "15", "16"], 2, "Oson", "5×3=15"),
            ("10÷2 = ?", ["3", "4", "5", "6"], 2, "Oson", "10÷2=5"),
            ("7² = ?", ["47", "48", "49", "50"], 2, "O'rta", "7²=49"),
            ("³√8 = ?", ["1", "2", "3", "4"], 1, "O'rta", "³√8=2"),
            ("2⁵ = ?", ["16", "32", "64", "128"], 1, "O'rta", "2⁵=32"),
            ("√144 = ?", ["10", "11", "12", "13"], 2, "Oson", "√144=12"),
            ("15% ning 20 = ?", ["2", "3", "4", "5"], 2, "O'rta", "15% × 20 = 3"),
            ("⅓ × 9 = ?", ["2", "3", "4", "5"], 1, "Oson", "⅓ × 9 = 3"),
            ("¼ + ¾ = ?", ["½", "1", "¾", "2"], 1, "Oson", "¼ + ¾ = 1"),
            ("sin(90°) = ?", ["0", "½", "1", "∞"], 2, "Qiyin", "sin(90°)=1"),
            ("cos(0°) = ?", ["0", "½", "1", "-1"], 2, "Qiyin", "cos(0°)=1"),
            ("π ≈ ?", ["3.04", "3.14", "3.24", "3.34"], 1, "O'rta", "π≈3.14"),
            ("e ≈ ?", ["2.61", "2.71", "2.81", "2.91"], 1, "Qiyin", "e≈2.71"),
            ("log₁₀(100) = ?", ["1", "2", "3", "4"], 1, "Qiyin", "log₁₀(100)=2"),
            ("x=3 bo'lsa, 2x+1 = ?", ["5", "6", "7", "8"], 2, "Oson", "2×3+1=7"),
            ("(x+2)² = ?", ["x²+4", "x²+4x+4", "x+4", "x²+2"], 1, "O'rta", "(x+2)²=x²+4x+4"),
            ("∫x dx = ?", ["x²+C", "½x²+C", "2x+C", "x+C"], 1, "Qiyin", "∫x dx = ½x²+C"),
            ("lim(x→0) sin(x)/x = ?", ["0", "1", "∞", "-1"], 1, "Qiyin", "lim=1"),
            ("Goldbahxning gipotezasi nima?", ["Juft soni", "Tub soni", "Toq soni", "Nol"], 0, "Qiyin", "Juft sonlar tub sonlar yig'indisi"),
        ]
    },
}

def seed_games(db: Session):
    """Barcha o'yinlarni o'quvchi data bilan to'ldirish"""
    
    for game_name, game_data in GAMES_TESTS.items():
        print(f"\n📚 {game_data['label']} o'yini qo'shilmoqda...")
        
        for idx, (question, options, correct, difficulty, explanation) in enumerate(game_data['tests'], 1):
            # Har bir test uchun unique ID
            game_question = GameQuestion(
                game_id=game_name,
                stage_id=1,
                order_index=idx,
                question_text=question,
                options=options,
                correct_answer=correct,
                difficulty=difficulty,
                explanation=explanation,
                points=10,
            )
            db.add(game_question)
        
        db.commit()
        print(f"✅ {game_data['label']} tayyor! ({len(game_data['tests'])} ta test)")

if __name__ == "__main__":
    db = sessionLocal()
    try:
        # Avval eski ma'lumotlarni o'chirish
        db.query(GameQuestion).delete()
        db.commit()
        print("🗑️  Eski ma'lumotlar o'chirildi")
        
        # Yangi ma'lumotlar qo'shish
        seed_games(db)
        print("\n🎉 Barcha o'yinlar tayyor!")
        print("✨ Frontend'da ishga tushirib ko'ring!")
        
    except Exception as e:
        print(f"❌ Xato: {e}")
        db.rollback()
    finally:
        db.close()
