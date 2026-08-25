from pathlib import Path


# Folders that are usually not useful for understanding
# the application's own code.
IGNORED_DIRS = {
    ".git",
    "node_modules",
    ".venv",
    "venv",
    "__pycache__",
    "dist",
    "build",
    ".next",
    "coverage",
}


def get_folder_structure(repo_path: Path, max_depth: int = 3) -> list[str]:
    """
    Return a simplified folder/file structure of the repository.
    """

    structure = []

    for path in repo_path.rglob("*"):

        # Ignore unwanted directories
        if any(part in IGNORED_DIRS for part in path.parts):
            continue

        relative_path = path.relative_to(repo_path)

        depth = len(relative_path.parts)

        if depth > max_depth:
            continue

        if path.is_dir():
            structure.append(f"[DIR]  {relative_path}")
        else:
            structure.append(f"[FILE] {relative_path}")

    return sorted(structure)


def find_important_files(repo_path: Path) -> list[str]:
    """
    Find files that are useful for understanding the codebase.
    """

    important_names = {
        "README.md",
        "package.json",
        "requirements.txt",
        "pyproject.toml",
        "pom.xml",
        "build.gradle",
        "build.gradle.kts",
        "go.mod",
        "Cargo.toml",
        "pubspec.yaml",
        "Dockerfile",
        ".env.example",
    }

    files = []

    for path in repo_path.rglob("*"):

        if any(part in IGNORED_DIRS for part in path.parts):
            continue

        if path.is_file() and path.name in important_names:
            files.append(str(path.relative_to(repo_path)))

    return sorted(files)


def analyze_codebase(repo_path: Path) -> dict:
    """
    Analyze the repository structure and important files.
    """

    return {
        "folder_structure": get_folder_structure(repo_path),
        "important_files": find_important_files(repo_path),
    }