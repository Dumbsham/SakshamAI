import os
import json
import base64
from typing import Annotated, TypedDict
from dotenv import load_dotenv
from langchain_google_vertexai import ChatVertexAI
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, ToolMessage
from langgraph.graph import StateGraph, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from google.cloud import texttospeech
from google.cloud import speech
from google.oauth2 import service_account
from tools import ALL_TOOLS

load_dotenv()

creds_dict = json.loads(os.getenv("GCP_CREDENTIALS_JSON"))
credentials = service_account.Credentials.from_service_account_info(
    creds_dict,
    scopes=["https://www.googleapis.com/auth/cloud-platform"]
)

GOOGLE_PROJECT_ID = os.getenv("GOOGLE_PROJECT_ID")

VOICE_MAP = {
    "hindi":   {"language_code": "hi-IN",  "name": "hi-IN-Chirp3-HD-Aoede"},
    "tamil":   {"language_code": "ta-IN",  "name": "ta-IN-Chirp3-HD-Aoede"},
    "telugu":  {"language_code": "te-IN",  "name": "te-IN-Chirp3-HD-Aoede"},
    "marathi": {"language_code": "mr-IN",  "name": "mr-IN-Chirp3-HD-Aoede"},
    "english": {"language_code": "en-IN",  "name": "en-IN-Chirp3-HD-Aoede"},
}

STT_LANG_MAP = {
    "hindi":   "hi-IN",
    "tamil":   "ta-IN",
    "telugu":  "te-IN",
    "marathi": "mr-IN",
    "english": "en-IN",
}

def speak(text: str, language: str = "hindi") -> str:
    if not text or not text.strip():
        return None
    voice_cfg = VOICE_MAP.get(language, VOICE_MAP["hindi"])
    client = texttospeech.TextToSpeechClient(credentials=credentials)
    response = client.synthesize_speech(
        input=texttospeech.SynthesisInput(text=text),
        voice=texttospeech.VoiceSelectionParams(
            language_code=voice_cfg["language_code"],
            name=voice_cfg["name"]
        ),
        audio_config=texttospeech.AudioConfig(
            audio_encoding=texttospeech.AudioEncoding.MP3
        )
    )
    return base64.b64encode(response.audio_content).decode("utf-8")

def transcribe(audio_bytes: bytes, language: str = "hindi") -> str:
    lang_code = STT_LANG_MAP.get(language, "hi-IN")
    client = speech.SpeechClient(credentials=credentials)
    response = client.recognize(
        config=speech.RecognitionConfig(
            encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
            sample_rate_hertz=48000,
            language_code=lang_code,
            alternative_language_codes=["en-IN"],
            enable_automatic_punctuation=True,
        ),
        audio=speech.RecognitionAudio(content=audio_bytes)
    )
    return " ".join(r.alternatives[0].transcript for r in response.results)

# ── LangGraph State ──────────────────────────────────────────────
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    language: str
    selected_career: str
    user_transcript: str
    courses: list
    jobs: list
    schemes: list
    ui_actions: list
    education_level: str

LANG_INSTRUCTIONS = {
    "hindi":   "हमेशा हिंदी में जवाब दो। छोटे, warm जवाब — 2-3 वाक्य। Markdown मत use करो।",
    "tamil":   "எப்போதும் தமிழில் பதில் சொல்லுங்கள். சுருக்கமாக 2-3 வாக்கியங்கள்.",
    "telugu":  "ఎల్లప్పుడూ తెలుగులో సమాధానం చెప్పండి. 2-3 వాక్యాలు మాత్రమే.",
    "marathi": "नेहमी मराठीत उत्तर द्या. 2-3 वाक्ये.",
    "english": "Always respond in simple English. 2-3 sentences only.",
}

def make_llm():
    return ChatVertexAI(
        model="gemini-2.0-flash-001",
        project=GOOGLE_PROJECT_ID,
        location="us-central1",
        credentials=credentials,
        temperature=0.1,
    ).bind_tools(ALL_TOOLS, tool_choice="auto")

def agent_node(state: AgentState):
    language = state.get("language", "hindi")
    selected_career = state.get("selected_career", "")
    user_transcript = state.get("user_transcript", "")
    education_level = state.get("education_level", "padha nahi")
    lang_instruction = LANG_INSTRUCTIONS.get(language, LANG_INSTRUCTIONS["hindi"])

    system_content = f"""You are a warm AI career counselor for Indian women.
{lang_instruction}

Selected career: {selected_career}
User background: {user_transcript}
Education level: {education_level}

CRITICAL TOOL RULES — you MUST call tools, NEVER just describe what you will do:

1. User says jobs/kaam/naukri/rojgar/placement → IMMEDIATELY call get_filtered_jobs(career="{selected_career}", job_type="local", education_level="{education_level}"), THEN call trigger_ui_action(action="scroll_to_jobs")

2. User says courses/seekhna/sikhna/training/padhai → IMMEDIATELY call get_filtered_courses(career="{selected_career}", language="{language}"), THEN call trigger_ui_action(action="scroll_to_courses")

3. User says schemes/yojana/sarkar/madad/loan/government → IMMEDIATELY call get_govt_schemes(career="{selected_career}", language="{language}"), THEN call trigger_ui_action(action="scroll_to_schemes")

4. User says "LinkedIn kholo" / "open LinkedIn" → call trigger_ui_action(action="open_url", platform="LinkedIn")
   User says "Upwork kholo" / "open Upwork" → call trigger_ui_action(action="open_url", platform="Upwork")
   User says "Fiverr kholo" / "open Fiverr" → call trigger_ui_action(action="open_url", platform="Fiverr")
   User says any "[platform] kholo" / "open [platform]" → call trigger_ui_action(action="open_url", platform="[platform name, case-insensitive]")
   Supported platforms: LinkedIn, Upwork, Fiverr, Naukri, Internshala, Freelancer, Apna, WorkIndia, Meesho, Urban Company, JustDial, Udemy, YouTube

5. User says ANYTHING about opening/applying/registering/login/signup on a website → IMMEDIATELY call browse_website. NEVER ask for URL. Use these URLs:
   - LinkedIn jobs → url="https://www.linkedin.com/jobs/search/?keywords={selected_career}"
   - LinkedIn login → url="https://www.linkedin.com/login"
   - Apna App → url="https://apna.co"
   - PMKVY → url="https://www.pmkvyofficial.org"
   - Urban Company → url="https://professionals.urbancompany.com/register"
   - WorkIndia → url="https://www.workindia.in"
   - Upwork → url="https://www.upwork.com/nx/find-work/"
   - Fiverr → url="https://www.fiverr.com/start_selling"
   RULE: NEVER say "please give me URL" — just call browse_website immediately.

6. After browse_website returns:
   - If action="needs_credentials" → tell user in {language}: "Is website pe login karna hoga. Apna email aur password chat mein bhejo, main login karwa dungi." Then call trigger_ui_action(action="show_credentials_form", url=login_url)
   - If action="open_url" → tell user the page is opening and call trigger_ui_action(action="open_url", url=<the_url>)
   - If action="browser_result" and success=true → tell user the task is done!
   - If screenshot is available → tell user you can see the page

7. User provides email/password for a site → call browse_website again with the original task, including credentials.

IMPORTANT: After calling tools, give a SHORT confirmation in {language} — do NOT list the results yourself, they are shown in UI automatically.
"""

    messages = [SystemMessage(content=system_content)]
    for msg in state["messages"]:
        if hasattr(msg, 'content') and msg.content:
            messages.append(msg)
        elif hasattr(msg, 'tool_calls') and msg.tool_calls:
            messages.append(msg)
        elif isinstance(msg, ToolMessage):
            messages.append(msg)

    llm = make_llm()
    response = llm.invoke(messages)
    return {"messages": [response]}

def tool_node_with_state(state: AgentState):
    tool_node = ToolNode(ALL_TOOLS)
    result = tool_node.invoke({"messages": state["messages"]})

    new_courses = state.get("courses", [])
    new_jobs = state.get("jobs", [])
    new_schemes = state.get("schemes", [])
    new_ui_actions = list(state.get("ui_actions", []))

    for msg in result.get("messages", []):
        if isinstance(msg, ToolMessage):
            try:
                data = json.loads(msg.content)
                if "courses" in data:
                    new_courses = data["courses"]
                if "platforms" in data:
                    new_jobs = data["platforms"]
                if "schemes" in data:
                    new_schemes = data["schemes"]
                if data.get("action"):
                    action_entry = {
                        "action": data["action"],
                        "url": data.get("url"),
                    }
                    # Preserve browser-specific fields
                    if data.get("screenshot"):
                        action_entry["screenshot"] = data["screenshot"]
                    if data.get("summary"):
                        action_entry["summary"] = data["summary"]
                    if data.get("steps"):
                        action_entry["steps"] = data["steps"]
                    if data.get("success") is not None:
                        action_entry["success"] = data["success"]
                    if data.get("site"):
                        action_entry["site"] = data["site"]
                    if data.get("site_name"):
                        action_entry["site_name"] = data["site_name"]
                    if data.get("login_url"):
                        action_entry["login_url"] = data["login_url"]
                    if data.get("signup_url"):
                        action_entry["signup_url"] = data["signup_url"]
                    if data.get("reason"):
                        action_entry["reason"] = data["reason"]
                    if data.get("final_url"):
                        action_entry["final_url"] = data["final_url"]
                    new_ui_actions.append(action_entry)
            except Exception as e:
                print(f"Tool parse error: {e}")

    return {
        "messages": result.get("messages", []),
        "courses": new_courses,
        "jobs": new_jobs,
        "schemes": new_schemes,
        "ui_actions": new_ui_actions,
    }

def should_continue(state: AgentState) -> str:
    last = state["messages"][-1]
    if hasattr(last, "tool_calls") and last.tool_calls:
        return "tools"
    return END

def build_graph():
    graph = StateGraph(AgentState)
    graph.add_node("agent", agent_node)
    graph.add_node("tools", tool_node_with_state)
    graph.set_entry_point("agent")
    graph.add_conditional_edges("agent", should_continue, {"tools": "tools", END: END})
    graph.add_edge("tools", "agent")
    return graph.compile()

GRAPH = build_graph()

def run_agent(
    user_message: str,
    history: list,
    selected_career: str,
    user_transcript: str,
    language: str = "hindi",
    courses: list = None,
    jobs: list = None,
    schemes: list = None,
    education_level: str = "padha nahi",
) -> dict:

    lc_history = []
    for h in history:
        if h["role"] == "user" and h.get("content"):
            lc_history.append(HumanMessage(content=h["content"]))
        elif h["role"] == "assistant" and h.get("content"):
            lc_history.append(AIMessage(content=h["content"]))

    lc_history.append(HumanMessage(content=user_message))

    result = GRAPH.invoke(AgentState(
        messages=lc_history,
        language=language,
        selected_career=selected_career,
        user_transcript=user_transcript,
        courses=courses or [],
        jobs=jobs or [],
        schemes=schemes or [],
        ui_actions=[],
        education_level=education_level,
    ))

    # DEBUG
    print("\n========== AGENT DEBUG ==========")
    for msg in result["messages"]:
        print(f"MSG TYPE: {type(msg).__name__}")
        if hasattr(msg, 'tool_calls') and msg.tool_calls:
            print(f"  TOOL CALLS: {msg.tool_calls}")
        if hasattr(msg, 'content') and msg.content:
            print(f"  CONTENT: {str(msg.content)[:200]}")
    print(f"COURSES: {len(result.get('courses', []))} items")
    print(f"JOBS: {len(result.get('jobs', []))} items")
    print(f"SCHEMES: {len(result.get('schemes', []))} items")
    print(f"UI ACTIONS: {json.dumps(result.get('ui_actions', []), default=str)[:500]}")
    print("==================================\n")

    ai_messages = [m for m in result["messages"] if isinstance(m, AIMessage) and not getattr(m, 'tool_calls', None)]
    final_text = ai_messages[-1].content if ai_messages else ""

    audio_base64 = None
    try:
        if final_text.strip():
            audio_base64 = speak(final_text, language)
    except Exception as e:
        print(f"TTS error: {e}")

    new_history = history + [
        {"role": "user", "content": user_message},
        {"role": "assistant", "content": final_text},
    ]

    ui_actions = result.get("ui_actions", [])

    # Find the most relevant action to surface
    # Priority: needs_credentials > browser_result > open_url > scroll/show actions
    primary_action = {}
    for action in ui_actions:
        act = action.get("action", "")
        if act == "needs_credentials":
            primary_action = action
            break
        elif act == "browser_result":
            primary_action = action
            break
        elif act == "open_url" and not primary_action.get("action"):
            primary_action = action
        elif not primary_action.get("action"):
            primary_action = action

    if not primary_action and ui_actions:
        primary_action = ui_actions[0]

    return {
        "message": final_text,
        "audio": audio_base64,
        "action": primary_action.get("action"),
        "actionPayload": {
            "url": primary_action.get("url"),
            "screenshot": primary_action.get("screenshot"),
            "summary": primary_action.get("summary"),
            "site": primary_action.get("site"),
            "site_name": primary_action.get("site_name"),
            "login_url": primary_action.get("login_url"),
            "signup_url": primary_action.get("signup_url"),
            "reason": primary_action.get("reason"),
            "success": primary_action.get("success"),
            "final_url": primary_action.get("final_url"),
            "steps": primary_action.get("steps"),
        } if primary_action else None,
        "history": new_history,
        "courses": result.get("courses", []),
        "jobs": result.get("jobs", []),
        "schemes": result.get("schemes", []),
        "allUiActions": ui_actions,
    }