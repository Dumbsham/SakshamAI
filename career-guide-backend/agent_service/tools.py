import os
import json
import urllib.parse
from googleapiclient.discovery import build
from langchain_core.tools import tool

YOUTUBE_API_KEY = os.getenv("YOUTUBE_API_KEY")

def _youtube_search(career: str, language: str = "hindi", level: str = "beginner") -> list:
    lang_queries = {
        "hindi": f"{career} सीखें {level}",
        "tamil": f"{career} கற்றுக்கொள்ளுங்கள்",
        "telugu": f"{career} నేర్చుకోండి",
        "marathi": f"{career} शिका",
        "english": f"learn {career} {level} tutorial"
    }
    query = lang_queries.get(language, f"learn {career}")
    try:
        youtube = build("googleapiclient", "v3", developerKey=YOUTUBE_API_KEY)
        # Fallback — direct URL since youtube API needs special setup
    except:
        pass
    
    q = urllib.parse.quote(query)
    return [
        {
            "title": f"{career} - {level.capitalize()} Course ({language.capitalize()})",
            "platform": "YouTube",
            "url": f"https://www.youtube.com/results?search_query={q}",
            "level": level
        },
        {
            "title": f"{career} Complete Tutorial",
            "platform": "Udemy",
            "url": f"https://www.udemy.com/courses/search/?q={urllib.parse.quote(career)}&sort=highest-rated",
            "level": level
        }
    ]

@tool
def get_filtered_courses(career: str, language: str = "hindi", level: str = "beginner") -> dict:
    """
    Find courses for a career filtered by language and level.
    Args:
        career: Career name e.g. 'Web Developer', 'Tailor', 'Beauty Expert'
        language: hindi, tamil, telugu, marathi, english
        level: beginner, intermediate, advanced
    """
    courses = _youtube_search(career, language, level)
    return {"courses": courses, "action": "show_courses"}

@tool
def get_filtered_jobs(career: str, job_type: str = "local", education_level: str = "padha nahi") -> dict:
    """
    Get job platforms smartly filtered by career type AND user education level.
    Args:
        career: Career name e.g. 'Tailor', 'Web Developer', 'Beauty Expert'
        job_type: local, freelance, professional
        education_level: padha nahi | 5th tak | 10th tak | 12th/college
    """
    q = urllib.parse.quote(career)
    slug = career.lower().replace(" ", "-")
    whatsapp_tip = {"name": "WhatsApp Tip", "url": None, "type": "tip",
                    "tip": f"Apne 10 contacts ko message karo: 'Main {career} ka kaam karti hoon'. Pehla customer wahi se milega!",
                    "isTip": True}

    # Education-based platform logic
    # padha nahi / 5th tak → only hyper-local, no-literacy platforms
    # 10th tak → local + some freelance
    # 12th/college → all platforms including professional

    if education_level in ("padha nahi", "5th tak"):
        platforms = [
            {"name": "Apna App", "url": f"https://apna.co/jobs?query={q}", "type": "local",
             "tip": "Hindi mein local jobs — seedha search karo", "isTip": False},
            {"name": "WorkIndia", "url": f"https://www.workindia.in/job-search?search={q}", "type": "local",
             "tip": "Blue collar jobs, Hindi support, free registration", "isTip": False},
            {"name": "Urban Company", "url": "https://professionals.urbancompany.com/register", "type": "local",
             "tip": "Beauty, cooking, cleaning — ghar se kaam karo", "isTip": False},
            whatsapp_tip,
        ]

    elif education_level == "10th tak":
        platforms = [
            {"name": "Apna App", "url": f"https://apna.co/jobs?query={q}", "type": "local",
             "tip": "Local jobs seedha Hindi mein", "isTip": False},
            {"name": "WorkIndia", "url": f"https://www.workindia.in/job-search?search={q}", "type": "local",
             "tip": "Blue collar jobs, Hindi support", "isTip": False},
            {"name": "JustDial", "url": f"https://www.justdial.com/{slug}-jobs", "type": "local",
             "tip": "Apne sheher ke local employers ko directly call karo", "isTip": False},
            {"name": "Meesho", "url": "https://supplier.meesho.com/registration", "type": "freelance",
             "tip": "Ghar se reselling — koi investment nahi", "isTip": False},
            whatsapp_tip,
        ]

    else:  # 12th/college
        if job_type == "freelance":
            platforms = [
                {"name": "Upwork", "url": "https://www.upwork.com/freelancer/registration", "type": "freelance",
                 "tip": "International clients — profile banao aur projects lo", "isTip": False},
                {"name": "Fiverr", "url": "https://www.fiverr.com/start_selling", "type": "freelance",
                 "tip": "Apni service list karo — bilkul free", "isTip": False},
                {"name": "Meesho", "url": "https://supplier.meesho.com/registration", "type": "freelance",
                 "tip": "Ghar se reselling shuru karo", "isTip": False},
                whatsapp_tip,
            ]
        else:
            platforms = [
                {"name": "LinkedIn", "url": f"https://www.linkedin.com/jobs/search/?keywords={q}", "type": "full-time",
                 "tip": "Professional jobs — profile banao aur apply karo", "isTip": False},
                {"name": "Apna App", "url": f"https://apna.co/jobs?query={q}", "type": "local",
                 "tip": "Local jobs bhi milenge", "isTip": False},
                {"name": "Upwork", "url": "https://www.upwork.com/freelancer/registration", "type": "freelance",
                 "tip": "Freelance clients internationally", "isTip": False},
                {"name": "Fiverr", "url": "https://www.fiverr.com/start_selling", "type": "freelance",
                 "tip": "Gig-based kaam shuru karo", "isTip": False},
            ]

    return {"platforms": platforms, "action": "show_jobs"}

@tool
def get_govt_schemes(career: str, education_level: str = "any") -> dict:
    """
    Get relevant government schemes for a career/skill.
    Args:
        career: Career name
        education_level: padha nahi, 5th tak, 10th tak, 12th/college, any
    """
    all_schemes = [
        {
            "name": "PM Vishwakarma Yojana",
            "benefit": "Free skill training + ₹15,000 toolkit + ₹3 lakh loan at 5% interest",
            "eligibility": "Artisans and craftspeople",
            "url": "https://pmvishwakarma.gov.in",
            "forCareers": ["tailor", "silai", "beauty", "carpenter", "potter", "weaver"]
        },
        {
            "name": "Pradhan Mantri Kaushal Vikas Yojana (PMKVY)",
            "benefit": "Free skill training + certificate + ₹8,000 reward",
            "eligibility": "10th pass preferred, but open to all",
            "url": "https://www.pmkvyofficial.org",
            "forCareers": ["any"]
        },
        {
            "name": "Startup India - Women Entrepreneurs",
            "benefit": "Business registration support + mentorship + funding access",
            "eligibility": "Women starting their own business",
            "url": "https://www.startupindia.gov.in",
            "forCareers": ["business", "entrepreneur", "freelance", "any"]
        },
        {
            "name": "MUDRA Loan - Shishu Scheme",
            "benefit": "Up to ₹50,000 loan without collateral to start business",
            "eligibility": "Anyone starting a small business",
            "url": "https://www.mudra.org.in",
            "forCareers": ["any"]
        },
        {
            "name": "Skill India Digital",
            "benefit": "Free online courses in 500+ skills with certificates",
            "eligibility": "Open to all",
            "url": "https://www.skillindiadigital.gov.in",
            "forCareers": ["any"]
        },
        {
            "name": "PM SVANidhi (Street Vendor Loan)",
            "benefit": "₹10,000-₹50,000 loan for street vendors and small sellers",
            "eligibility": "Small vendors and home-based sellers",
            "url": "https://pmsvanidhi.mohua.gov.in",
            "forCareers": ["vendor", "seller", "meesho", "reselling", "any"]
        }
    ]

    career_lower = career.lower()
    relevant = []
    for scheme in all_schemes:
        if "any" in scheme["forCareers"]:
            relevant.append(scheme)
        elif any(keyword in career_lower for keyword in scheme["forCareers"]):
            relevant.insert(0, scheme)  # relevant ones first

    # Deduplicate
    seen = set()
    unique = []
    for s in relevant:
        if s["name"] not in seen:
            seen.add(s["name"])
            unique.append(s)

    return {"schemes": unique[:4], "action": "show_schemes"}

@tool  
def trigger_ui_action(action: str, url: str = None) -> dict:
    """
    Trigger a UI action on the frontend.
    Args:
        action: scroll_to_courses | scroll_to_jobs | scroll_to_schemes | open_url
        url: URL to open (only for open_url)
    """
    return {"triggered": True, "action": action, "url": url}

ALL_TOOLS = [get_filtered_courses, get_filtered_jobs, get_govt_schemes, trigger_ui_action]