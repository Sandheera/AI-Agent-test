from fastapi import FastAPI, UploadFile, File
from pydantic import BaseModel
import os
import shutil

from decision.planner import plan
from memory.memory_manager import MemoryManager
from actions.read_pdf import read_pdf

app = FastAPI(docs_url="/docs", redoc_url="/redoc")
memory = MemoryManager()


@app.get("/")
def root():
    return {
        "message": "BMAD AI Agent is running",
        "docs": "http://127.0.0.1:8000/docs",
        "endpoint": "POST /evaluate-resume | POST /evaluate-pdf"
    }


class ResumeRequest(BaseModel):
    resume_text: str


@app.post("/evaluate-resume")
def evaluate_resume(req: ResumeRequest):
    decision = plan(req.resume_text)

    memory.save_decision({
        "resume": req.resume_text,
        "decision": decision
    })

    return decision


@app.post("/evaluate-pdf")
def evaluate_pdf(file: UploadFile = File(...)):
    """
    Upload a PDF resume and evaluate it using the BMAD AI Agent.
    """

    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    resume_text = read_pdf(file_path)
    decision = plan(resume_text)

    memory.save_decision({
        "resume": f"PDF:{file.filename}",
        "decision": decision
    })

    return decision
