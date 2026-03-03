"""
browser_runner.py — Runs browser agent in a separate subprocess.
This avoids event loop conflicts with FastAPI's async loop.

Usage: python browser_runner.py <task_file.json> <result_file.json>
"""

import sys
import json
import asyncio
import os

# Add agent_service to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from dotenv import load_dotenv
load_dotenv()

from browser import _run_browser_agent_async


async def main():
    if len(sys.argv) < 3:
        print("Usage: python browser_runner.py <task_file.json> <result_file.json>")
        sys.exit(1)

    task_file = sys.argv[1]
    result_file = sys.argv[2]

    with open(task_file) as f:
        task_data = json.load(f)

    result = await _run_browser_agent_async(
        task=task_data["task"],
        start_url=task_data.get("url"),
        max_steps=task_data.get("max_steps", 12),
        credentials=task_data.get("credentials"),
    )

    with open(result_file, 'w') as f:
        json.dump(result, f)

    print(f"Browser done: success={result.get('success')}, steps={len(result.get('steps', []))}")


if __name__ == "__main__":
    asyncio.run(main())