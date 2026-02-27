import os
import json
import base64
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

from agent import run_agent, transcribe, speak

app = FastAPI(title="Saksham Agent Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Health check ─────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "service": "Saksham LangGraph Agent"}

# ── Transcribe audio ─────────────────────────────────────────────
@app.post("/transcribe")
async def transcribe_audio(
    audio: UploadFile = File(...),
    language: str = Form("hindi")
):
    try:
        audio_bytes = await audio.read()
        transcript = transcribe(audio_bytes, language)
        return {"transcript": transcript}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ── Agent chat ───────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    history: list = []
    context: dict = {}
    courses: list = []
    jobs: list = []
    schemes: list = []

@app.post("/chat")
async def chat(req: ChatRequest):
    try:
        language = req.context.get("language", "hindi")
        selected_career = req.context.get("selectedCareer", "")
        user_transcript = req.context.get("transcript", "")
        education_level = req.context.get("educationLevel", "padha nahi")

        result = run_agent(
            user_message=req.message,
            history=req.history,
            selected_career=selected_career,
            user_transcript=user_transcript,
            language=language,
            courses=req.courses,
            jobs=req.jobs,
            schemes=req.schemes,
            education_level=education_level,
        )
        return result
    except Exception as e:
        print(f"Agent error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

# ── TTS only ─────────────────────────────────────────────────────
class SpeakRequest(BaseModel):
    text: str
    language: str = "hindi"

@app.post("/speak")
async def speak_text(req: SpeakRequest):
    try:
        audio = speak(req.text, req.language)
        return {"audio": audio}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)