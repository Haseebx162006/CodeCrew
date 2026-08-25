from pathlib import Path

from langchain_core.tools import Tool

@tool
def read_file(repo_path: str, file_path: str) -> str:

    """
    Reads the content of a file and returns it as a string.

    Args:
        repo_path (str): The path to the repository.
        file_path (str): The path to the file to be read.

    Returns:
        str: The content of the file.
    """

    path = Path(repo_path) / file_path

    if not path.exists():
        return f"Error: The file at {file_path} does not exist."
    
    return path.read_text()



@tool
def write_file(repo_path: str, file_path: str, content: str) -> str:
    """
    Writes content to a file.

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
        path.write_text(content)
        return f"Successfully wrote to {file_path}."
    except Exception as e:
        return f"Error writing to {file_path}: {e}"
    


def search_code(
    repo_path: str,
    query: str
) -> str:
    """Search for a text pattern inside repository source files."""

    repo = Path(repo_path)
    results = []

    for path in repo.rglob("*"):

        if not path.is_file():
            continue

        if ".git" in path.parts:
            continue

        try:
            content = path.read_text(
                encoding="utf-8"
            )
        except (UnicodeDecodeError, PermissionError):
            continue

        if query.lower() in content.lower():

            results.append(
                str(path.relative_to(repo))
            )

    if not results:
        return f"No matches found for: {query}"

    return "\n".join(results)


import subprocess

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

    return (
        f"Exit code: {result.returncode}\n\n"
        f"STDOUT:\n{result.stdout}\n\n"
        f"STDERR:\n{result.stderr}"
    )

    