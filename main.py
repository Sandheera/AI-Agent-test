from decision.planner import plan
from memory.memory_manager import MemoryManager
from actions.read_pdf import read_pdf
import os


def main():
    print("BMAD Agent starting...")

    # Initialize memory
    memory = MemoryManager()

    print("\nChoose resume input type:")
    print("1 - Paste resume text")
    print("2 - Load resume from PDF")

    choice = input("Enter choice (1 or 2): ").strip()

    if choice == "2":
        pdf_path = input("Enter PDF file path: ").strip()

        if not os.path.exists(pdf_path):
            print("❌ PDF file not found.")
            return

        resume_text = read_pdf(pdf_path)

        if not resume_text:
            print("❌ Failed to extract text from PDF.")
            return

    else:
        resume_text = input("Paste resume text (single line): ").strip()

        if not resume_text:
            print("❌ No resume text provided.")
            return

    # Run BMAD decision logic
    decision = plan(resume_text)

    # Save to memory
    memory.save_decision({
        "resume": resume_text,
        "decision": decision
    })

    # Output result
    print("\nAgent decision:")
    print(decision)


if __name__ == "__main__":
    main()
