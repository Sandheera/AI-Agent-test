import json
from pathlib import Path


class MemoryManager:
    def __init__(self):
        self.memory_file = Path("memory/data/decisions.json")

        if not self.memory_file.exists():
            self.memory_file.parent.mkdir(parents=True, exist_ok=True)
            self.memory_file.write_text("[]")

    def save_decision(self, record: dict):
        data = json.loads(self.memory_file.read_text())
        data.append(record)
        self.memory_file.write_text(json.dumps(data, indent=2))
