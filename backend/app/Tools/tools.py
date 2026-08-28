import json
import subprocess
from pathlib import Path
from langchain_core.tools import tool


@tool
def read_file(repo_path: str, file_path: str, max_chars: int = 2500) -> str:
    """
    Reads the content of a file safely, returning up to max_chars.
    If the file is a Jupyter Notebook (.ipynb), extracts code and markdown cells cleanly.

    Args:
        repo_path (str): The path to the repository.
        file_path (str): The path to the file to be read.
        max_chars (int): Max characters to return to preserve LLM token context.

    Returns:
        str: The content or summary of the file.
    """
    path = Path(repo_path) / file_path

    if not path.exists():
        return f"Error: The file at {file_path} does not exist."

    try:
        raw_text = path.read_text(encoding="utf-8", errors="replace")

        # Clean extraction for Jupyter Notebooks
        if file_path.endswith(".ipynb"):
            try:
                nb = json.loads(raw_text)
                cells = []
                for cell in nb.get("cells", []):
                    cell_type = cell.get("cell_type", "code")
                    source = "".join(cell.get("source", []))
                    if source.strip():
                        cells.append(f"[{cell_type.upper()}]\n{source}")
                extracted = "\n\n".join(cells)
                if len(extracted) > max_chars:
                    return extracted[:max_chars] + f"\n... [Truncated {len(extracted) - max_chars} characters]"
                return extracted
            except Exception:
                pass

        if len(raw_text) > max_chars:
            return raw_text[:max_chars] + f"\n... [Truncated {len(raw_text) - max_chars} characters]"

        return raw_text
    except Exception as e:
        return f"Error reading file {file_path}: {e}"


@tool
def write_file(repo_path: str, file_path: str, content: str) -> str:
    """
    Writes content to a file in the repository.

    Args:
        repo_path (str): The path to the repository.
        file_path (str): The path to the file to be written.
        content (str): The content to write to the file.

    Returns:
        str: A message indicating the result of the operation.
    """
    path = Path(repo_path) / file_path

    path.parent.mkdir(
        parents=True,
        exist_ok=True
    )

    try:
        path.write_text(content, encoding="utf-8")
        return f"Successfully wrote {len(content)} characters to {file_path}."
    except Exception as e:
        return f"Error writing to {file_path}: {e}"


@tool
def search_code(
    repo_path: str,
    query: str,
    max_results: int = 15
) -> str:
    """Search for a text pattern inside repository source files."""
    repo = Path(repo_path)
    results = []

    for path in repo.rglob("*"):
        if not path.is_file():
            continue
        if any(p in path.parts for p in [".git", "node_modules", ".venv", "venv", "__pycache__"]):
            continue

        try:
            content = path.read_text(encoding="utf-8", errors="ignore")
            if query.lower() in content.lower():
                results.append(str(path.relative_to(repo)))
                if len(results) >= max_results:
                    break
        except Exception:
            continue

    if not results:
        return f"No matches found for: {query}"

    return "\n".join(results)


@tool
def run_tests(repo_path: str) -> str:
    """Run the project's test suite."""
    result = subprocess.run(
        ["pytest"],
        cwd=repo_path,
        capture_output=True,
        text=True,
        timeout=120
    )

    stdout = result.stdout[-1500:] if result.stdout else ""
    stderr = result.stderr[-1500:] if result.stderr else ""

    return (
        f"Exit code: {result.returncode}\n\n"
        f"STDOUT:\n{stdout}\n\n"
        f"STDERR:\n{stderr}"
    )