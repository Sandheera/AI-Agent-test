import json
from llm.client import LLMClient
from decision.validator import validate_llm_output


def plan(resume_text: str) -> dict:
    llm = LLMClient()

    raw_output = llm.evaluate_resume(resume_text)

    # Parse JSON
    try:
        data = json.loads(raw_output)
    except Exception:
        return {
            "decision": "REVIEW",
            "reason": "LLM returned invalid JSON"
        }

    # Guardrail validation
    if not validate_llm_output(data):
        return {
            "decision": "REVIEW",
            "reason": "Invalid LLM output"
        }

    score = data["score"]
    justification = data["justification"]

    # Deterministic decision logic
    if score >= 75:
        decision = "SHORTLIST"
    elif score >= 50:
        decision = "REVIEW"
    else:
        decision = "REJECT"

    return {
        "decision": decision,
        "score": score,
        "reason": justification
    }
