"""
Add comprehensive anatomical terminology to database
Lug'atlarni database-ga qo'shish: 30 learning items + 30 test questions per topic
"""

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.models.base import TestSet, Question, Option
import json

# Database connection
POSTGRESQL_URL = 'postgresql://postgres:jonibek@127.0.0.1:5432/med'
engine = create_engine(POSTGRESQL_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Topics data with learning items and test questions
anatomical_topics = {
    "Dent Anatomiyasi": {
        "description": "Tish va tish atrofidagi anatomik strukturalar",
        "learning_items": [
            {"latin": "dens", "uzbek": "tish"},
            {"latin": "corona dentis", "uzbek": "tish toji"},
            {"latin": "cervix dentis", "uzbek": "tish bo'yni"},
            {"latin": "radix dentis", "uzbek": "tish ildizi"},
            {"latin": "pulpa dentis", "uzbek": "tish pulpasi"},
            {"latin": "dentinum", "uzbek": "dentin"},
            {"latin": "enamelum", "uzbek": "emal"},
            {"latin": "cementum", "uzbek": "sement qavati"},
            {"latin": "apex radicis", "uzbek": "ildiz uchi"},
            {"latin": "canalis radicis", "uzbek": "ildiz kanali"},
            {"latin": "ligamentum periodontale", "uzbek": "periodont bog'lami"},
            {"latin": "gingiva", "uzbek": "milk"},
            {"latin": "nervus", "uzbek": "nerv"},
            {"latin": "dens incisivus", "uzbek": "kurak tish"},
            {"latin": "dens caninus", "uzbek": "qoziq tish"},
            {"latin": "dens premolaris", "uzbek": "kichik oziq tish"},
            {"latin": "dens molaris", "uzbek": "katta oziq tish"},
            {"latin": "dens deciduus", "uzbek": "sut tishi"},
            {"latin": "dens permanens", "uzbek": "doimiy tish"},
            {"latin": "dens serotinus", "uzbek": "kech chiqadigan tish (aql tish)"},
            {"latin": "arcus dentalis", "uzbek": "tish yoyi"},
            {"latin": "dens molaris tertius", "uzbek": "uchinchi molyar tish (aql tish)"},
            {"latin": "alveolus dentis", "uzbek": "tish katagi (alveolasi)"},
            {"latin": "processus alveolaris", "uzbek": "alveolar o'siq"},
            {"latin": "foramen apicale", "uzbek": "apikalni teshik"},
            {"latin": "naris", "uzbek": "burun teshigi"},
            {"latin": "furcation", "uzbek": "ildizlar ajralmasi"},
            {"latin": "sulcus gingivalis", "uzbek": "milk uchumligi"},
            {"latin": "junctional epithelium", "uzbek": "bog'lanuv epiteliy"},
            {"latin": "dentin tubules", "uzbek": "dentin tubchilari"},
        ],
        "test_questions": [
            {
                "question": "Tish tojini lotincha nomi nima?",
                "options": ["dens", "corona dentis", "radix dentis", "cervix dentis"],
                "correct": 1
            },
            {
                "question": "Tish ildizini qanday ataydi?",
                "options": ["pulpa dentis", "radix dentis", "apex dentis", "canalis dentis"],
                "correct": 1
            },
            {
                "question": "Tish o'zining qaysi qavati eng qattiq?",
                "options": ["dentin", "emal", "sement", "pulpa"],
                "correct": 1
            },
            {
                "question": "Milk lotincha nomi qanday?",
                "options": ["palatum", "gingiva", "lingua", "labium"],
                "correct": 1
            },
            {
                "question": "Kurak tish lotincha nomi?",
                "options": ["dens molaris", "dens caninus", "dens incisivus", "dens premolaris"],
                "correct": 2
            },
            {
                "question": "Qoziq tish lotincha?",
                "options": ["dens incisivus", "dens caninus", "dens molaris", "dens premolaris"],
                "correct": 1
            },
            {
                "question": "Aql tish (serotinus) nimani anglatadi?",
                "options": ["doimiy tish", "sut tishi", "kech chiqadigan tish", "kichik tish"],
                "correct": 2
            },
            {
                "question": "Dentin nima?",
                "options": ["tish tojini qoplaydi", "tish ildiz qavati", "tish oqlig'i", "tish ichidagi shuya"],
                "correct": 2
            },
            {
                "question": "Emal qaysi qavat?",
                "options": ["ichki", "tashqi qattiq", "o'rta", "eng ichida"],
                "correct": 1
            },
            {
                "question": "Periodont bog'lami qaysi struktura?",
                "options": ["tish va suyak o'rtasidagi bog'lanish", "tish va milk o'rtasidagi", "tish ichidagi", "tish toji"],
                "correct": 0
            },
            {
                "question": "Tish bo'yni latinca nomi?",
                "options": ["cervix dentis", "corona dentis", "radix dentis", "apex dentis"],
                "correct": 0
            },
            {
                "question": "Katta oziq tish lotincha nomi?",
                "options": ["dens molaris", "dens premolaris", "dens caninus", "dens incisivus"],
                "correct": 0
            },
            {
                "question": "Sut tishi lotincha?",
                "options": ["dens permanens", "dens deciduus", "dens serotinus", "dens molaris"],
                "correct": 1
            },
            {
                "question": "Tish yoyi latinca?",
                "options": ["arcus dentalis", "dens molaris", "pulpa dentis", "gingiva"],
                "correct": 0
            },
            {
                "question": "Tish pulpasi nima?",
                "options": ["tish tojining qavati", "tish ichidagi shuya", "tish katagidir", "tish bo'yni"],
                "correct": 1
            },
            {
                "question": "Kichik oziq tish qanday nomlanadi?",
                "options": ["dens molaris", "dens premolaris", "dens incisivus", "dens caninus"],
                "correct": 1
            },
            {
                "question": "Ildiz kanali latinca?",
                "options": ["canalis radicis", "apex radicis", "foramen dentis", "alveolus dentis"],
                "correct": 0
            },
            {
                "question": "Tish katagi (alveoli) nima?",
                "options": ["tish ildizining oxiri", "tish joylashtirilgan shoxcha", "tish tojining yuqori qismi", "tish bo'yni"],
                "correct": 1
            },
            {
                "question": "Sement qavati qaysi struktura?",
                "options": ["tish ildizini qoplaydigan qavat", "tish tojini qoplaydi", "tish ichidagi", "tish yuzidagi"],
                "correct": 0
            },
            {
                "question": "Ildiz uchi latinca nomi?",
                "options": ["apex radicis", "corona radicis", "cervix radicis", "pulpa radicis"],
                "correct": 0
            },
            {
                "question": "Tish yoyi qaysi tishlardan iborat?",
                "options": ["barcha tishlar", "faqat mollyarlar", "faqat premollyarlar", "faqat incisivlar"],
                "correct": 0
            },
            {
                "question": "Uchinchi mollyar tish nima?",
                "options": ["sut tishi", "aql tishi", "qoziq tishi", "kurak tishi"],
                "correct": 1
            },
            {
                "question": "Latinca 'dens' so'zi nimani anglatadi?",
                "options": ["milk", "lab", "tish", "burun"],
                "correct": 2
            },
            {
                "question": "Nervus latinca nima?",
                "options": ["mushatnishagi", "nerv", "suyak", "bog'lanish"],
                "correct": 1
            },
            {
                "question": "Pulpa dentis qaerda joylashgan?",
                "options": ["tish tojida", "tish ildizida", "tish suyagi ichida", "tish qabig'ida"],
                "correct": 2
            },
            {
                "question": "Dentin tubchilari nima?",
                "options": ["tish qavatlari", "tish ichidagi kanallar", "tish ildizlari", "tish cheklari"],
                "correct": 1
            },
            {
                "question": "Junctional epithelium qaysi joyda?",
                "options": ["tish va suyak o'rtasida", "tish va milk o'rtasida", "tish va emal o'rtasida", "tish va dentin o'rtasida"],
                "correct": 1
            },
            {
                "question": "Apikalni teshik latinca?",
                "options": ["foramen apicale", "apex apicale", "foramina apicales", "canalis apicale"],
                "correct": 0
            },
            {
                "question": "Tish atrofidagi halqasimon mushatnishagi qanday nomlanadi?",
                "options": ["orbicularis oris", "masseter", "temporalis", "buccinator"],
                "correct": 0
            },
            {
                "question": "Ildizlar ajralishi latinca?",
                "options": ["furcation", "bifurcation", "trifurcation", "root divergence"],
                "correct": 0
            },
        ]
    },
    
    "Kalla Suyaklari (Kranium)": {
        "description": "Bosh suyagining tarkibiy qismlari",
        "learning_items": [
            {"latin": "os frontale", "uzbek": "peshona suyagi"},
            {"latin": "os parietale", "uzbek": "tepa suyagi"},
            {"latin": "os temporale", "uzbek": "chakka suyagi"},
            {"latin": "os occipitale", "uzbek": "ensa suyagi"},
            {"latin": "os sphenoidale", "uzbek": "ponasimon suyagi"},
            {"latin": "os ethmoidale", "uzbek": "g'alvirsimon suyagi"},
            {"latin": "processus styloideus", "uzbek": "bigizsimon o'siq"},
            {"latin": "maxilla", "uzbek": "yuqori jag' suyagi"},
            {"latin": "mandibula", "uzbek": "pastki jag' suyagi"},
            {"latin": "os zygomaticum", "uzbek": "yonoq suyagi"},
            {"latin": "os nasale", "uzbek": "burun suyagi"},
            {"latin": "os lacrimale", "uzbek": "ko'z yosh suyagi"},
            {"latin": "os palatinum", "uzbek": "tanglay suyagi"},
            {"latin": "concha nasalis inferior", "uzbek": "pastki burun chig'anog'i"},
            {"latin": "vomer", "uzbek": "dimog' suyagi"},
            {"latin": "os hyoideum", "uzbek": "til osti suyagi"},
            {"latin": "neurocranium", "uzbek": "miyaning qavati"},
            {"latin": "viscerocranium", "uzbek": "yuz suyaklari"},
            {"latin": "cranium", "uzbek": "bosh suyagi"},
            {"latin": "calvaria", "uzbek": "kalla (bosh kubbolasi)"},
            {"latin": "foramen magnum", "uzbek": "katta teshik"},
            {"latin": "condylus occipitalis", "uzbek": "ensa kondili"},
            {"latin": "processus mastoideus", "uzbek": "so'rg'ichsimon o'siq"},
            {"latin": "sella turcica", "uzbek": "poyezdchi orindig'i"},
            {"latin": "sphenoid sinus", "uzbek": "ponasimon sinus"},
            {"latin": "frontal sinus", "uzbek": "peshona sinusi"},
            {"latin": "maxillary sinus", "uzbek": "yuqori jag' sinusi"},
            {"latin": "temporal fossa", "uzbek": "chakka to'pi"},
            {"latin": "pterygoid fossa", "uzbek": "qanotsimon to'pi"},
            {"latin": "infratemporal fossa", "uzbek": "chakka osti to'pi"},
        ],
        "test_questions": [
            {
                "question": "Peshona suyagi lotincha?",
                "options": ["os parietale", "os frontale", "os temporale", "os occipitale"],
                "correct": 1
            },
            {
                "question": "Tepa suyagi nima?",
                "options": ["os frontale", "os temporale", "os parietale", "os occipitale"],
                "correct": 2
            },
            {
                "question": "Chakka suyagi lotincha nomi?",
                "options": ["os temporale", "os nasale", "os lacrimale", "os zygomaticum"],
                "correct": 0
            },
            {
                "question": "Ensa suyagi qanday nomlanadi?",
                "options": ["os parietale", "os occipitale", "os sphenoidale", "os temporale"],
                "correct": 1
            },
            {
                "question": "Ponasimon suyagi latinca?",
                "options": ["os ethmoidale", "os sphenoidale", "os nasale", "os temporale"],
                "correct": 1
            },
            {
                "question": "G'alvirsimon suyagi nima?",
                "options": ["os sphenoidale", "os ethmoidale", "os nasale", "os lacrimale"],
                "correct": 1
            },
            {
                "question": "Yuqori jag' suyagi lotincha?",
                "options": ["mandibula", "maxilla", "os zygomaticum", "os nasale"],
                "correct": 1
            },
            {
                "question": "Pastki jag' suyagi nima?",
                "options": ["maxilla", "mandibula", "os zygomaticum", "os palatinum"],
                "correct": 1
            },
            {
                "question": "Yonoq suyagi latinca?",
                "options": ["os nasale", "os zygomaticum", "os lacrimale", "os palatinum"],
                "correct": 1
            },
            {
                "question": "Burun suyagi qanday nomlanadi?",
                "options": ["os vomer", "os nasale", "os lacrimale", "os zygomaticum"],
                "correct": 1
            },
            {
                "question": "Ko'z yosh suyagi lotincha?",
                "options": ["os nasale", "os lacrimale", "os zygomaticum", "os temporale"],
                "correct": 1
            },
            {
                "question": "Tanglay suyagi nima?",
                "options": ["os vomer", "os lacrimale", "os palatinum", "os nasale"],
                "correct": 2
            },
            {
                "question": "Pastki burun chig'anog'i latinca?",
                "options": ["concha nasalis superior", "concha nasalis media", "concha nasalis inferior", "vomer"],
                "correct": 2
            },
            {
                "question": "Dimog' suyagi qanday nomlanadi?",
                "options": ["os vomer", "os palatinum", "os nasale", "os lacrimale"],
                "correct": 0
            },
            {
                "question": "Til osti suyagi lotincha?",
                "options": ["os lacrimale", "os hyoideum", "os nasale", "os vomer"],
                "correct": 1
            },
            {
                "question": "Neurocranium nimani anglatadi?",
                "options": ["yuz suyaklari", "miyaning qavati", "tish suyaklari", "jag' suyaklari"],
                "correct": 1
            },
            {
                "question": "Viscerocranium nima?",
                "options": ["miyaning qavati", "yuz suyaklari", "burun suyaklari", "tish suyaklari"],
                "correct": 1
            },
            {
                "question": "Katta teshik latinca?",
                "options": ["foramen magnum", "foramen spinosum", "foramen lacerum", "foramen ovale"],
                "correct": 0
            },
            {
                "question": "Ensa kondili nima?",
                "options": ["ensa suyagining chiqintisi", "jag' suyagining boshlig'i", "tepa suyagining oxiri", "chakka suyagining qismi"],
                "correct": 0
            },
            {
                "question": "So'rg'ichsimon o'siq nima?",
                "options": ["chakka suyagining chiqintisi", "ensa suyagining chiqintisi", "peshona suyagining chiqintisi", "jag' suyagining chiqintisi"],
                "correct": 0
            },
            {
                "question": "Poyezdchi orindig'i latinca?",
                "options": ["sella turcica", "crista galli", "cribriform plate", "perpendicular plate"],
                "correct": 0
            },
            {
                "question": "Ponasimon sinus qaerda joylashgan?",
                "options": ["peshonada", "ponasimon suyagida", "chakka suyagida", "yonoq suyagida"],
                "correct": 1
            },
            {
                "question": "Peshona sinusi nima?",
                "options": ["peshona suyagidagi bo'shlik", "yonoq suyagidagi bo'shlik", "chakka suyagidagi bo'shlik", "ponasimon suyagidagi bo'shlik"],
                "correct": 0
            },
            {
                "question": "Yuqori jag' sinusi lotincha?",
                "options": ["frontal sinus", "sphenoid sinus", "maxillary sinus", "temporal sinus"],
                "correct": 2
            },
            {
                "question": "Chakka to'pi latinca?",
                "options": ["temporal fossa", "infratemporal fossa", "pterygopalatine fossa", "pterygoid fossa"],
                "correct": 0
            },
            {
                "question": "Qanotsimon to'pi nima?",
                "options": ["temporal fossa", "pterygoid fossa", "infratemporal fossa", "pterygopalatine fossa"],
                "correct": 1
            },
            {
                "question": "Chakka osti to'pi qanday nomlanadi?",
                "options": ["temporal fossa", "pterygoid fossa", "infratemporal fossa", "pterygopalatine fossa"],
                "correct": 2
            },
            {
                "question": "Kranium nima?",
                "options": ["faqat yuz suyaklari", "faqat miya suyaklari", "miya va yuz suyaklarining birgaligi", "faqat jag' suyaklari"],
                "correct": 2
            },
            {
                "question": "Kalla (calvaria) nima?",
                "options": ["bosh suyagining to'lib ketgan qismi", "bosh suyagining bo'sh qismi", "yuz suyaklari", "chakka suyagi"],
                "correct": 1
            },
            {
                "question": "Bigizsimon o'siq qaerda joylashgan?",
                "options": ["peshona suyagida", "chakka suyagida", "ensa suyagida", "ponasimon suyagida"],
                "correct": 2
            },
        ]
    },
}

try:
    # First, create test sets for each topic
    for topic_name, topic_data in anatomical_topics.items():
        print(f"\nProcessing topic: {topic_name}")
        
        # Create test set
        test_set = TestSet(
            title=topic_name,
            description=topic_data["description"],
            category="Anatomiya",
            difficulty_level="Medium",
            total_questions=len(topic_data["test_questions"])
        )
        session.add(test_set)
        session.commit()
        
        # Add questions
        for idx, q_data in enumerate(topic_data["test_questions"], 1):
            question = Question(
                test_set_id=test_set.id,
                question_text=q_data["question"],
                question_number=idx,
                explanation=""
            )
            session.add(question)
            session.commit()
            
            # Add options
            for opt_idx, option_text in enumerate(q_data["options"]):
                option = Option(
                    question_id=question.id,
                    option_text=option_text,
                    is_correct=(opt_idx == q_data["correct"]),
                    option_number=opt_idx + 1
                )
                session.add(option)
            
            session.commit()
        
        print(f"  ✓ Added {len(topic_data['test_questions'])} questions for {topic_name}")
    
    print("\n✅ All anatomical topics added successfully!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    session.rollback()
finally:
    session.close()
