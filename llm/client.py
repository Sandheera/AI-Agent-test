import os
import json
from dotenv import load_dotenv

load_dotenv()

USE_REAL_LLM = os.getenv("USE_REAL_LLM", "false").lower() == "true"

if USE_REAL_LLM:
    from openai import OpenAI
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


class LLMClient:
    def evaluate_resume(self, resume_text: str) -> dict:
        """
        Evaluate a resume using either:
        - Mock LLM (safe, no billing)
        - Real LLM (OpenAI), controlled via .env
        """

        # ✅ MOCK MODE (fallback / no billing)
        if not USE_REAL_LLM:
            return {
                "score": 78,
                "justification": "Candidate has relevant programming skills and project experience."
            }

        # 🔥 REAL LLM MODE
        prompt = f"""
You are an HR resume evaluator.

Return ONLY valid JSON.
No markdown.
No explanation outside JSON.

Resume:
{resume_text}

Required JSON format:
{{
  "score": number (0-100),
  "justification": string
}}
"""

        try:
            response = client.chat.completions.create(
                model=os.getenv("OPENAI_MODEL", "gpt-4o-mini"),
                messages=[
                    {"role": "system", "content": "You are a strict JSON-only generator."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2
            )

            content = response.choices[0].message.content
            return json.loads(content)

        except Exception:
            # 🛡️ SAFETY FALLBACK (BMAD principle)
            return {
                "score": 0,
                "justification": "LLM failed or returned invalid output."
            }
