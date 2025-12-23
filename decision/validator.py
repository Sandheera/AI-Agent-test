def validate_llm_output(data: dict) -> bool:
    if "score" not in data or "justification" not in data:
        return False

    if not isinstance(data["score"], int):
        return False

    if data["score"] < 0 or data["score"] > 100:
        return False

    if not isinstance(data["justification"], str):
        return False

    return True
