import os
import json
import urllib.parse
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
    else:
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
def get_govt_schemes(career: str, education_level: str = "any", language: str = "hindi") -> dict:
    """
    Get relevant government schemes for the user's specific career using Gemini.
    Args:
        career: Career name e.g. 'Tailor', 'Web Developer', 'Beauty Expert', 'Teacher'
        education_level: padha nahi, 5th tak, 10th tak, 12th/college, any
        language: hindi, tamil, telugu, marathi, english
    """
    import re
    from langchain_google_vertexai import ChatVertexAI
    from google.oauth2 import service_account

    try:
        creds_dict = json.loads(os.getenv("GCP_CREDENTIALS_JSON"))
        credentials = service_account.Credentials.from_service_account_info(
            creds_dict, scopes=["https://www.googleapis.com/auth/cloud-platform"]
        )
        llm = ChatVertexAI(
            model="gemini-2.0-flash-001",
            project=os.getenv("GOOGLE_PROJECT_ID"),
            location="us-central1",
            credentials=credentials,
            temperature=0.1,
        )
        lang_instruction = {
            "hindi": "Respond with name, benefit, eligibility fields in Hindi language",
            "tamil": "Respond with name, benefit, eligibility fields in Tamil language",
            "telugu": "Respond with name, benefit, eligibility fields in Telugu language",
            "marathi": "Respond with name, benefit, eligibility fields in Marathi language",
            "english": "Respond with name, benefit, eligibility fields in English",
        }.get(language, "Respond in Hindi")

        prompt = (
            "You are an expert on Indian government schemes for women.\n"
            f"Find the 4 most relevant government schemes for a woman working as: {career}\n"
            f"Education level: {education_level}\n\n"
            f"IMPORTANT: {lang_instruction}\n"
            "Only keep the URL in English (government URLs must stay in English).\n\n"
            "Return ONLY a valid JSON array, no extra text:\n"
            "[{ \"name\": \"Scheme name\", \"benefit\": \"benefit\", "
            "\"eligibility\": \"eligibility\", \"url\": \"url\" }]\n\n"
            "Use only real URLs: pmvishwakarma.gov.in, pmkvyofficial.org, "
            "mudra.org.in, startupindia.gov.in, skillindiadigital.gov.in\n"
            f"Focus on schemes most relevant to {career} profession."
        )
        from langchain_core.messages import HumanMessage
        response = llm.invoke([HumanMessage(content=prompt)])
        text = response.content
        json_match = re.search(r'\[.*?\]', text, re.DOTALL)
        if json_match:
            schemes = json.loads(json_match.group())
            return {"schemes": schemes[:4], "action": "show_schemes"}
    except Exception as e:
        print(f"Gemini schemes error: {e}")

    fallback = [
        {"name": "PM Kaushal Vikas Yojana (PMKVY)", "benefit": "Free skill training + certificate + ₹8,000 reward",
         "eligibility": "Open to all", "url": "https://www.pmkvyofficial.org"},
        {"name": "MUDRA Loan - Shishu", "benefit": "Up to ₹50,000 loan without collateral",
         "eligibility": "Anyone starting small business", "url": "https://www.mudra.org.in"},
        {"name": "Skill India Digital", "benefit": "Free online courses in 500+ skills",
         "eligibility": "Open to all", "url": "https://www.skillindiadigital.gov.in"},
        {"name": "Startup India - Women", "benefit": "Mentorship + funding access + business support",
         "eligibility": "Women entrepreneurs", "url": "https://www.startupindia.gov.in"},
    ]
    return {"schemes": fallback, "action": "show_schemes"}

<<<<<<< HEAD

@tool
def trigger_ui_action(action: str, url: str = None) -> dict:
=======
PLATFORM_URLS = {
    "linkedin": "https://www.linkedin.com",
    "upwork": "https://www.upwork.com",
    "fiverr": "https://www.fiverr.com",
    "naukri": "https://www.naukri.com",
    "internshala": "https://internshala.com",
    "freelancer": "https://www.freelancer.in",
    "apna": "https://apna.co",
    "workindia": "https://www.workindia.in",
    "meesho": "https://supplier.meesho.com",
    "urban company": "https://professionals.urbancompany.com",
    "justdial": "https://www.justdial.com",
    "udemy": "https://www.udemy.com",
    "youtube": "https://www.youtube.com",
}

@tool  
def trigger_ui_action(action: str, url: str = None, platform: str = None) -> dict:
>>>>>>> 3afa6946910e3c0d6e731f4dd773c69308ccf98e
    """
    Trigger a UI action on the frontend.
    Args:
        action: scroll_to_courses | scroll_to_jobs | scroll_to_schemes | open_url
        url: URL to open (only for open_url action)
        platform: Platform name to open (e.g. 'LinkedIn', 'Upwork') — used to resolve URL if url is not provided
    """
    resolved_url = url
    if action == "open_url" and not url and platform:
        resolved_url = PLATFORM_URLS.get(platform.lower().strip())
    return {"triggered": True, "action": action, "url": resolved_url}


@tool
def browse_website(task: str, url: str) -> dict:
    """
    Open a website and perform actions like searching jobs, signing up, logging in, or applying.
    ALWAYS call this when user wants to open/apply/register/signup/login on any website.
    DO NOT ask user for URL — use these known URLs:
    - LinkedIn jobs → https://www.linkedin.com/jobs/search/?keywords=<career>
    - LinkedIn login → https://www.linkedin.com/login
    - Apna App → https://apna.co
    - PMKVY → https://www.pmkvyofficial.org
    - Urban Company → https://professionals.urbancompany.com/register
    - WorkIndia → https://www.workindia.in
    - Upwork → https://www.upwork.com/nx/find-work/
    - Fiverr → https://www.fiverr.com/start_selling

    Args:
        task: What to do, e.g. 'search web developer jobs in Delhi on LinkedIn and apply'
        url: Starting URL for the task
    """
    import subprocess
    import sys
    import tempfile
    import json as _json
    import os as _os

    task_data = {"task": task, "url": url, "max_steps": 12}

    # Check if we have stored credentials for this site
    from browser import _detect_site, _get_stored_credentials
    site_key = _detect_site(url)
    if site_key:
        stored_creds = _get_stored_credentials(site_key)
        if stored_creds:
            task_data["credentials"] = stored_creds

    with tempfile.NamedTemporaryFile(mode='w', suffix='.json', delete=False) as f:
        _json.dump(task_data, f)
        task_file = f.name

    result_file = task_file.replace('.json', '_result.json')

    try:
        script_dir = _os.path.dirname(_os.path.abspath(__file__))
        runner = _os.path.join(script_dir, 'browser_runner.py')

        proc = subprocess.run(
            [sys.executable, runner, task_file, result_file],
            timeout=300,  # 5 min for complex flows like login+search+apply
            capture_output=True,
            text=True
        )

        print(f"Browser stdout: {proc.stdout[-500:] if proc.stdout else 'none'}")
        if proc.stderr:
            print(f"Browser stderr: {proc.stderr[-500:]}")

        if _os.path.exists(result_file):
            with open(result_file) as f:
                result = _json.load(f)

            # If browser needs credentials, surface that to the agent
            if result.get("needs_credentials"):
                return {
                    "action": "needs_credentials",
                    "site": result.get("site", "unknown"),
                    "site_name": result.get("site_name", "this website"),
                    "login_url": result.get("login_url"),
                    "signup_url": result.get("signup_url"),
                    "screenshot": result.get("screenshot"),
                    "summary": result.get("summary"),
                }

            # If browser needs human intervention (CAPTCHA, OTP, complex form)
            if result.get("needs_human"):
                return {
                    "action": "open_url",
                    "url": result.get("open_url", url),
                    "reason": result.get("reason", "manual_needed"),
                    "screenshot": result.get("screenshot"),
                    "summary": result.get("summary"),
                    "steps": result.get("steps", []),
                }

            return {
                "action": "browser_result",
                "success": result.get("success", False),
                "steps": result.get("steps", []),
                "screenshot": result.get("screenshot"),
                "summary": result.get("summary", "Task completed"),
                "final_url": result.get("final_url"),
            }
        else:
            return {
                "action": "browser_result",
                "success": False,
                "summary": f"Browser runner did not produce output. stderr: {proc.stderr[-200:] if proc.stderr else 'none'}",
            }
    except subprocess.TimeoutExpired:
        return {"action": "open_url", "url": url, "summary": "Browser timed out. Opening the page for you."}
    except Exception as e:
        print(f"Browser tool error: {e}")
        return {"action": "open_url", "url": url, "summary": f"Browser error: {str(e)}. Opening the page for you."}
    finally:
        for f_path in [task_file, result_file]:
            try:
                _os.unlink(f_path)
            except Exception:
                pass


ALL_TOOLS = [get_filtered_courses, get_filtered_jobs, get_govt_schemes, trigger_ui_action, browse_website]