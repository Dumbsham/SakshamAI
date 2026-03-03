"""
browser.py — Core browser automation using browser-use + Playwright
Handles login, signup, job search, and application flows for supported sites.
"""

import os
import json
import asyncio
import base64
from pathlib import Path
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# ── Persistent session storage ───────────────────────────────────
SESSIONS_DIR = Path(__file__).parent / ".browser_sessions"
SESSIONS_DIR.mkdir(exist_ok=True)

CREDENTIALS_FILE = Path(__file__).parent / ".credentials.json"

# ── Site configs ─────────────────────────────────────────────────
SITE_CONFIGS = {
    "linkedin": {
        "name": "LinkedIn",
        "login_url": "https://www.linkedin.com/login",
        "signup_url": "https://www.linkedin.com/signup",
        "check_logged_in_url": "https://www.linkedin.com/feed/",
        "logged_in_indicator": "feed",  # URL contains this when logged in
        "job_search_url": "https://www.linkedin.com/jobs/search/?keywords={query}&location={location}",
    },
    "apna": {
        "name": "Apna App",
        "login_url": "https://apna.co/login",
        "signup_url": "https://apna.co/register",
        "check_logged_in_url": "https://apna.co/",
        "logged_in_indicator": "dashboard",
        "job_search_url": "https://apna.co/jobs?query={query}",
    },
    "workindia": {
        "name": "WorkIndia",
        "login_url": "https://www.workindia.in/login",
        "signup_url": "https://www.workindia.in/register",
        "check_logged_in_url": "https://www.workindia.in/",
        "logged_in_indicator": "profile",
        "job_search_url": "https://www.workindia.in/job-search?search={query}",
    },
    "urbancompany": {
        "name": "Urban Company",
        "login_url": "https://professionals.urbancompany.com/login",
        "signup_url": "https://professionals.urbancompany.com/register",
        "check_logged_in_url": "https://professionals.urbancompany.com/",
        "logged_in_indicator": "dashboard",
        "job_search_url": "https://professionals.urbancompany.com/register",
    },
    "upwork": {
        "name": "Upwork",
        "login_url": "https://www.upwork.com/ab/account-security/login",
        "signup_url": "https://www.upwork.com/nx/signup/",
        "check_logged_in_url": "https://www.upwork.com/nx/find-work/",
        "logged_in_indicator": "find-work",
        "job_search_url": "https://www.upwork.com/nx/search/jobs/?q={query}",
    },
    "fiverr": {
        "name": "Fiverr",
        "login_url": "https://www.fiverr.com/login",
        "signup_url": "https://www.fiverr.com/join",
        "check_logged_in_url": "https://www.fiverr.com/",
        "logged_in_indicator": "dashboard",
        "job_search_url": "https://www.fiverr.com/start_selling",
    },
}


def _detect_site(url: str) -> Optional[str]:
    """Detect which supported site a URL belongs to."""
    url_lower = url.lower()
    for site_key, config in SITE_CONFIGS.items():
        if site_key in url_lower or config["name"].lower().replace(" ", "") in url_lower.replace(" ", ""):
            return site_key
    return None


def _get_stored_credentials(site_key: str) -> Optional[dict]:
    """Load stored credentials for a site."""
    if not CREDENTIALS_FILE.exists():
        return None
    try:
        creds = json.loads(CREDENTIALS_FILE.read_text())
        return creds.get(site_key)
    except Exception:
        return None


def save_credentials(site_key: str, email: str, password: str):
    """Save credentials for a site (called from the API when user provides them)."""
    creds = {}
    if CREDENTIALS_FILE.exists():
        try:
            creds = json.loads(CREDENTIALS_FILE.read_text())
        except Exception:
            pass
    creds[site_key] = {"email": email, "password": password}
    CREDENTIALS_FILE.write_text(json.dumps(creds, indent=2))


def _get_session_path(site_key: str) -> Path:
    """Get the Playwright persistent context storage path for a site."""
    path = SESSIONS_DIR / site_key
    path.mkdir(exist_ok=True)
    return path


async def _take_screenshot(page) -> Optional[str]:
    """Take a screenshot and return as base64."""
    try:
        screenshot_bytes = await page.screenshot(full_page=False)
        return base64.b64encode(screenshot_bytes).decode("utf-8")
    except Exception:
        return None


async def _run_browser_agent_async(
    task: str,
    start_url: Optional[str] = None,
    max_steps: int = 12,
    credentials: Optional[dict] = None,
) -> dict:
    """
    Main browser automation function.
    Uses Playwright with persistent context for session management.
    Uses browser-use Agent for AI-driven navigation when needed.
    """
    from playwright.async_api import async_playwright

    site_key = _detect_site(start_url or "")
    site_config = SITE_CONFIGS.get(site_key, {}) if site_key else {}
    steps = []
    screenshot = None

    # Determine intent from task
    task_lower = task.lower()
    wants_login = any(w in task_lower for w in ["login", "sign in", "signin", "log in"])
    wants_signup = any(w in task_lower for w in ["signup", "sign up", "register", "create account", "join"])
    wants_apply = any(w in task_lower for w in ["apply", "application", "submit"])
    wants_search = any(w in task_lower for w in ["search", "find", "look", "dhundho", "khojo"])

    # Get credentials
    stored_creds = _get_stored_credentials(site_key) if site_key else None
    creds_to_use = credentials or stored_creds

    async with async_playwright() as p:
        # Use persistent context to maintain cookies/sessions across runs
        session_path = _get_session_path(site_key) if site_key else SESSIONS_DIR / "default"
        session_path.mkdir(exist_ok=True)

        browser_context = await p.chromium.launch_persistent_context(
            user_data_dir=str(session_path),
            headless=True,
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            locale="en-IN",
            timezone_id="Asia/Kolkata",
            args=[
                "--disable-blink-features=AutomationControlled",
                "--no-sandbox",
            ],
        )

        page = browser_context.pages[0] if browser_context.pages else await browser_context.new_page()

        # Inject stealth scripts to avoid bot detection
        await page.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
            Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en', 'hi'] });
            window.chrome = { runtime: {} };
        """)

        try:
            # ── STEP 1: Navigate to start URL ────────────────────────
            if start_url:
                steps.append({"step": "navigate", "detail": f"Opening {start_url}"})
                await page.goto(start_url, wait_until="domcontentloaded", timeout=30000)
                await page.wait_for_timeout(2000)

            # ── STEP 2: Check if already logged in ───────────────────
            current_url = page.url
            is_logged_in = False

            if site_config.get("logged_in_indicator"):
                is_logged_in = site_config["logged_in_indicator"] in current_url

            # Also check for common logged-in indicators on page
            if not is_logged_in:
                try:
                    logged_in_selectors = [
                        '[data-testid="nav-profile"]',      # LinkedIn
                        '.profile-icon',                      # Generic
                        '.user-avatar',                       # Generic
                        '[aria-label="Profile"]',             # Generic
                        '.nav-item__profile-member-photo',    # LinkedIn
                    ]
                    for sel in logged_in_selectors:
                        if await page.query_selector(sel):
                            is_logged_in = True
                            break
                except Exception:
                    pass

            steps.append({"step": "check_login", "detail": f"Logged in: {is_logged_in}"})

            # ── STEP 3: Handle Login/Signup if needed ────────────────
            if (wants_login or wants_signup or wants_apply) and not is_logged_in:

                if not creds_to_use:
                    # No credentials available — ask user
                    screenshot = await _take_screenshot(page)
                    await browser_context.close()
                    return {
                        "success": False,
                        "needs_credentials": True,
                        "site": site_key or "unknown",
                        "site_name": site_config.get("name", "this website"),
                        "steps": steps,
                        "screenshot": screenshot,
                        "summary": f"Login required for {site_config.get('name', 'this website')}. Please provide your email and password.",
                        "login_url": site_config.get("login_url", start_url),
                        "signup_url": site_config.get("signup_url", start_url),
                    }

                # Try to login with credentials
                email = creds_to_use.get("email", "")
                password = creds_to_use.get("password", "")

                if wants_signup:
                    signup_url = site_config.get("signup_url", start_url)
                    steps.append({"step": "navigate_signup", "detail": f"Going to signup: {signup_url}"})
                    await page.goto(signup_url, wait_until="domcontentloaded", timeout=30000)
                    await page.wait_for_timeout(2000)
                else:
                    login_url = site_config.get("login_url", start_url)
                    steps.append({"step": "navigate_login", "detail": f"Going to login: {login_url}"})
                    await page.goto(login_url, wait_until="domcontentloaded", timeout=30000)
                    await page.wait_for_timeout(2000)

                # Use browser-use Agent for intelligent form filling
                login_success = await _do_ai_login(page, email, password, site_key, steps)

                if not login_success:
                    # Check if CAPTCHA or OTP is blocking us
                    page_content = await page.content()
                    has_captcha = any(w in page_content.lower() for w in [
                        "captcha", "recaptcha", "hcaptcha", "verify you're human",
                        "security check", "challenge"
                    ])
                    has_otp = any(w in page_content.lower() for w in [
                        "verification code", "otp", "one-time", "enter code",
                        "verify your", "sent a code"
                    ])

                    screenshot = await _take_screenshot(page)

                    if has_captcha:
                        await browser_context.close()
                        return {
                            "success": False,
                            "needs_human": True,
                            "reason": "captcha",
                            "site": site_key,
                            "steps": steps,
                            "screenshot": screenshot,
                            "summary": "CAPTCHA detected. Opening the page in your browser — please complete it manually.",
                            "open_url": page.url,
                        }

                    if has_otp:
                        await browser_context.close()
                        return {
                            "success": False,
                            "needs_human": True,
                            "reason": "otp",
                            "site": site_key,
                            "steps": steps,
                            "screenshot": screenshot,
                            "summary": "OTP verification required. Opening the page in your browser — please enter the code sent to your phone/email.",
                            "open_url": page.url,
                        }

                    await browser_context.close()
                    return {
                        "success": False,
                        "steps": steps,
                        "screenshot": screenshot,
                        "summary": "Login failed. Opening the page so you can login manually.",
                        "open_url": site_config.get("login_url", start_url),
                    }

                steps.append({"step": "login_success", "detail": "Successfully logged in!"})
                await page.wait_for_timeout(3000)

            # ── STEP 4: Search for jobs ──────────────────────────────
            if wants_search or wants_apply:
                search_result = await _do_job_search(page, task, site_key, site_config, steps)
                if not search_result:
                    steps.append({"step": "search", "detail": "Could not find search functionality, showing current page"})

            # ── STEP 5: Apply to job ─────────────────────────────────
            if wants_apply:
                apply_result = await _do_job_apply(page, task, site_key, steps)
                if apply_result.get("needs_human"):
                    screenshot = await _take_screenshot(page)
                    await browser_context.close()
                    return {
                        "success": False,
                        "needs_human": True,
                        "reason": "complex_form",
                        "site": site_key,
                        "steps": steps,
                        "screenshot": screenshot,
                        "summary": apply_result.get("summary", "Application needs manual steps. Opening the page for you."),
                        "open_url": page.url,
                    }

            # ── Final screenshot ─────────────────────────────────────
            screenshot = await _take_screenshot(page)
            final_url = page.url

            await browser_context.close()

            return {
                "success": True,
                "steps": steps,
                "screenshot": screenshot,
                "summary": f"Task completed. Current page: {final_url}",
                "final_url": final_url,
            }

        except Exception as e:
            screenshot = await _take_screenshot(page)
            try:
                await browser_context.close()
            except Exception:
                pass
            return {
                "success": False,
                "steps": steps,
                "screenshot": screenshot,
                "summary": f"Browser error: {str(e)}",
                "open_url": start_url,
            }


async def _do_ai_login(page, email: str, password: str, site_key: str, steps: list) -> bool:
    """
    Attempt to login using intelligent form detection.
    Tries site-specific selectors first, then generic fallback.
    """

    # Site-specific login selectors
    LOGIN_SELECTORS = {
        "linkedin": {
            "email": "#username",
            "password": "#password",
            "submit": '[data-litms-control-urn="login-submit"]',
        },
        "apna": {
            "email": 'input[type="tel"], input[name="phone"], input[type="email"]',
            "password": 'input[type="password"]',
            "submit": 'button[type="submit"]',
        },
        "workindia": {
            "email": 'input[type="tel"], input[name="mobile"], input[type="email"]',
            "password": 'input[type="password"]',
            "submit": 'button[type="submit"]',
        },
        "urbancompany": {
            "email": 'input[type="tel"], input[type="email"]',
            "password": 'input[type="password"]',
            "submit": 'button[type="submit"]',
        },
        "upwork": {
            "email": "#login_username",
            "password": "#login_password",
            "submit": "#login_control_continue",
        },
        "fiverr": {
            "email": 'input[name="login"], input[type="email"]',
            "password": 'input[name="password"]',
            "submit": 'button[type="submit"]',
        },
    }

    # Generic fallback selectors
    GENERIC_SELECTORS = {
        "email": [
            'input[type="email"]',
            'input[name="email"]',
            'input[name="username"]',
            'input[name="login"]',
            'input[id*="email"]',
            'input[id*="user"]',
            'input[placeholder*="email" i]',
            'input[placeholder*="phone" i]',
            'input[type="tel"]',
        ],
        "password": [
            'input[type="password"]',
            'input[name="password"]',
            'input[id*="password"]',
        ],
        "submit": [
            'button[type="submit"]',
            'input[type="submit"]',
            'button:has-text("Sign in")',
            'button:has-text("Log in")',
            'button:has-text("Login")',
            'button:has-text("Continue")',
        ],
    }

    selectors = LOGIN_SELECTORS.get(site_key, {})

    try:
        # ── Fill email/username ──────────────────────────────────
        email_filled = False
        email_selector = selectors.get("email")

        if email_selector:
            el = await page.query_selector(email_selector)
            if el:
                await el.click()
                await el.fill("")
                await page.keyboard.type(email, delay=50)
                email_filled = True

        if not email_filled:
            for sel in GENERIC_SELECTORS["email"]:
                el = await page.query_selector(sel)
                if el and await el.is_visible():
                    await el.click()
                    await el.fill("")
                    await page.keyboard.type(email, delay=50)
                    email_filled = True
                    break

        if not email_filled:
            steps.append({"step": "login_error", "detail": "Could not find email/username field"})
            return False

        steps.append({"step": "fill_email", "detail": "Entered email/username"})

        # Some sites have a "Continue" button before password
        # (LinkedIn's 2-step login, Upwork, etc.)
        await page.wait_for_timeout(1000)

        # Check for continue/next button before password
        continue_selectors = [
            '#login_control_continue',  # Upwork
            'button:has-text("Continue")',
            'button:has-text("Next")',
            'button:has-text("आगे बढ़ें")',
        ]
        for sel in continue_selectors:
            try:
                btn = await page.query_selector(sel)
                if btn and await btn.is_visible():
                    await btn.click()
                    await page.wait_for_timeout(2000)
                    steps.append({"step": "click_continue", "detail": "Clicked continue/next"})
                    break
            except Exception:
                continue

        # ── Fill password ────────────────────────────────────────
        password_filled = False
        password_selector = selectors.get("password")

        if password_selector:
            el = await page.query_selector(password_selector)
            if el:
                await el.click()
                await el.fill("")
                await page.keyboard.type(password, delay=50)
                password_filled = True

        if not password_filled:
            for sel in GENERIC_SELECTORS["password"]:
                el = await page.query_selector(sel)
                if el and await el.is_visible():
                    await el.click()
                    await el.fill("")
                    await page.keyboard.type(password, delay=50)
                    password_filled = True
                    break

        if not password_filled:
            # Some sites (Apna, WorkIndia) use OTP-only login
            steps.append({"step": "no_password", "detail": "No password field found — site may use OTP login"})
            return False

        steps.append({"step": "fill_password", "detail": "Entered password"})

        # ── Click submit ─────────────────────────────────────────
        await page.wait_for_timeout(500)
        submitted = False
        submit_selector = selectors.get("submit")

        if submit_selector:
            btn = await page.query_selector(submit_selector)
            if btn:
                await btn.click()
                submitted = True

        if not submitted:
            for sel in GENERIC_SELECTORS["submit"]:
                try:
                    btn = await page.query_selector(sel)
                    if btn and await btn.is_visible():
                        await btn.click()
                        submitted = True
                        break
                except Exception:
                    continue

        if not submitted:
            # Try pressing Enter as last resort
            await page.keyboard.press("Enter")
            submitted = True

        steps.append({"step": "submit_login", "detail": "Submitted login form"})

        # ── Wait and verify login ────────────────────────────────
        await page.wait_for_timeout(5000)
        current_url = page.url

        # Check for error messages
        page_content = await page.content()
        error_indicators = [
            "incorrect password", "wrong password", "invalid credentials",
            "authentication failed", "login failed", "try again",
            "गलत पासवर्ड", "error"
        ]
        has_error = any(e in page_content.lower() for e in error_indicators)

        if has_error:
            steps.append({"step": "login_failed", "detail": "Login credentials appear incorrect"})
            return False

        # Check for common login page indicators (still on login page = failed)
        login_page_indicators = ["login", "signin", "sign-in", "log-in"]
        still_on_login = any(i in current_url.lower() for i in login_page_indicators)

        if still_on_login:
            # Double check — maybe there's a CAPTCHA or 2FA
            steps.append({"step": "login_uncertain", "detail": f"Still on login page: {current_url}"})
            return False

        return True

    except Exception as e:
        steps.append({"step": "login_error", "detail": f"Login error: {str(e)}"})
        return False


async def _do_job_search(page, task: str, site_key: str, site_config: dict, steps: list) -> bool:
    """Search for jobs on the current site."""
    import re

    # Extract search query from the task
    query_patterns = [
        r"search (?:for )?(.+?) (?:jobs?|positions?|roles?|openings?)",
        r"(?:find|look for|khojo|dhundho) (.+?) (?:jobs?|kaam|naukri)",
        r"(.+?) (?:jobs?|positions?|roles?) (?:in|at|on)",
        r"(?:jobs?|kaam|naukri) (?:for|of|ke liye) (.+)",
    ]

    search_query = ""
    for pattern in query_patterns:
        match = re.search(pattern, task.lower())
        if match:
            search_query = match.group(1).strip()
            break

    if not search_query:
        # Use the full task as search query, cleaned up
        search_query = re.sub(
            r'(on linkedin|on apna|search|find|apply|login|register|jobs?|kaam|naukri|for|ke liye|please|karo|kijiye)',
            '', task.lower()
        ).strip()

    if not search_query:
        search_query = task

    steps.append({"step": "search_query", "detail": f"Searching for: {search_query}"})

    # Extract location
    location = ""
    location_match = re.search(r"in (\w+(?:\s\w+)?)", task.lower())
    if location_match:
        location = location_match.group(1)

    # Try site-specific search URL first
    job_search_url = site_config.get("job_search_url", "")
    if job_search_url:
        import urllib.parse
        search_url = job_search_url.format(
            query=urllib.parse.quote(search_query),
            location=urllib.parse.quote(location) if location else "India"
        )
        steps.append({"step": "navigate_search", "detail": f"Going to: {search_url}"})
        await page.goto(search_url, wait_until="domcontentloaded", timeout=30000)
        await page.wait_for_timeout(3000)
        return True

    # Fallback: Try to find search box on current page
    search_selectors = [
        'input[role="combobox"]',
        'input[aria-label*="search" i]',
        'input[placeholder*="search" i]',
        'input[name="keywords"]',
        'input[name="q"]',
        'input[name="query"]',
        'input[type="search"]',
        '#jobs-search-box-keyword-id-ember',
    ]

    for sel in search_selectors:
        try:
            el = await page.query_selector(sel)
            if el and await el.is_visible():
                await el.click()
                await el.fill("")
                await page.keyboard.type(search_query, delay=30)
                await page.wait_for_timeout(500)
                await page.keyboard.press("Enter")
                await page.wait_for_timeout(3000)
                steps.append({"step": "search_submitted", "detail": f"Searched for: {search_query}"})
                return True
        except Exception:
            continue

    return False


async def _do_job_apply(page, task: str, site_key: str, steps: list) -> dict:
    """Attempt to apply to first matching job."""

    # Wait for job listings to load
    await page.wait_for_timeout(2000)

    # Click first job listing
    job_selectors = [
        '.job-card-container',                    # LinkedIn
        '.jobs-search-results__list-item',        # LinkedIn
        '[data-testid="job-card"]',               # Generic
        '.job-card',                               # Generic
        '.vacancy-card',                           # Apna
        'a[href*="/jobs/"]',                       # Generic
        '.job-listing',                            # Generic
    ]

    job_clicked = False
    for sel in job_selectors:
        try:
            els = await page.query_selector_all(sel)
            if els and len(els) > 0:
                await els[0].click()
                job_clicked = True
                steps.append({"step": "click_job", "detail": "Clicked on first job listing"})
                await page.wait_for_timeout(2000)
                break
        except Exception:
            continue

    if not job_clicked:
        steps.append({"step": "no_jobs", "detail": "Could not find job listings to click"})
        return {"needs_human": True, "summary": "No job listings found. Opening the page for you to search manually."}

    # Look for Apply/Easy Apply button
    apply_selectors = [
        'button:has-text("Easy Apply")',           # LinkedIn
        'button:has-text("Apply")',                # Generic
        'button:has-text("Apply Now")',            # Generic
        'a:has-text("Apply")',                     # Generic
        'button:has-text("अप्लाई करें")',             # Hindi
        'button:has-text("आवेदन करें")',              # Hindi
        '[data-testid="apply-button"]',            # Generic
        '.jobs-apply-button',                      # LinkedIn
        '.apply-button',                           # Generic
    ]

    apply_clicked = False
    for sel in apply_selectors:
        try:
            btn = await page.query_selector(sel)
            if btn and await btn.is_visible():
                await btn.click()
                apply_clicked = True
                steps.append({"step": "click_apply", "detail": "Clicked Apply button"})
                await page.wait_for_timeout(3000)
                break
        except Exception:
            continue

    if not apply_clicked:
        steps.append({"step": "no_apply_button", "detail": "No Apply button found"})
        return {"needs_human": True, "summary": "Could not find Apply button. Opening the job page for you."}

    # Check what happened after clicking Apply
    current_url = page.url
    page_content = await page.content()

    # LinkedIn Easy Apply — has a multi-step form
    is_easy_apply = "easy" in page_content.lower() and "apply" in page_content.lower()

    if is_easy_apply or site_key == "linkedin":
        # Try to handle Easy Apply form
        easy_apply_result = await _handle_easy_apply(page, steps)
        return easy_apply_result

    # External application — opened in new tab
    pages = page.context.pages
    if len(pages) > 1:
        # New tab opened for external application
        new_page = pages[-1]
        steps.append({"step": "external_redirect", "detail": f"Redirected to: {new_page.url}"})
        return {
            "needs_human": True,
            "summary": f"Application redirected to external site: {new_page.url}. Opening for you to complete."
        }

    # Generic application form
    return {"needs_human": True, "summary": "Application form opened. Opening page for you to fill details."}


async def _handle_easy_apply(page, steps: list) -> dict:
    """Handle LinkedIn Easy Apply multi-step form."""

    max_form_steps = 5
    for step_num in range(max_form_steps):
        await page.wait_for_timeout(1500)

        # Check for "Submit application" button
        submit_selectors = [
            'button:has-text("Submit application")',
            'button:has-text("Submit")',
            'button[aria-label="Submit application"]',
        ]
        for sel in submit_selectors:
            try:
                btn = await page.query_selector(sel)
                if btn and await btn.is_visible():
                    await btn.click()
                    steps.append({"step": "submit_application", "detail": "Submitted application!"})
                    await page.wait_for_timeout(2000)
                    return {"success": True, "summary": "Application submitted successfully!"}
            except Exception:
                continue

        # Check for "Next" / "Review" button
        next_selectors = [
            'button:has-text("Next")',
            'button:has-text("Review")',
            'button:has-text("Continue")',
            'button[aria-label="Continue to next step"]',
        ]
        next_clicked = False
        for sel in next_selectors:
            try:
                btn = await page.query_selector(sel)
                if btn and await btn.is_visible():
                    await btn.click()
                    next_clicked = True
                    steps.append({"step": f"form_step_{step_num + 1}", "detail": "Moved to next step"})
                    break
            except Exception:
                continue

        if not next_clicked:
            # Form has required fields we can't fill
            steps.append({"step": "form_stuck", "detail": "Form requires manual input"})
            return {
                "needs_human": True,
                "summary": "Application form needs additional details (resume, phone, etc). Opening for you to complete."
            }

    return {
        "needs_human": True,
        "summary": "Application form is complex. Opening for you to review and submit."
    }