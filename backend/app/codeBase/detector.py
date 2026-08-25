from pathlib import Path


def detect_stack(repo_path: Path) -> dict:

    stack = {
        "languages": [],
        "frameworks": [],
        "package_managers": [],
    }

    # Python
    if (repo_path / "requirements.txt").exists():
        stack["languages"].append("Python")

    if (repo_path / "pyproject.toml").exists():
        stack["languages"].append("Python")

    # JavaScript / TypeScript
    if (repo_path / "package.json").exists():
        stack["languages"].append("JavaScript/TypeScript")

        if (repo_path / "package-lock.json").exists():
            stack["package_managers"].append("npm")

        if (repo_path / "yarn.lock").exists():
            stack["package_managers"].append("yarn")

        if (repo_path / "pnpm-lock.yaml").exists():
            stack["package_managers"].append("pnpm")

    # Java
    if (repo_path / "pom.xml").exists():
        stack["languages"].append("Java")
        stack["package_managers"].append("Maven")

    if (repo_path / "build.gradle").exists() or \
       (repo_path / "build.gradle.kts").exists():
        stack["languages"].append("Java")
        stack["package_managers"].append("Gradle")

    # Go
    if (repo_path / "go.mod").exists():
        stack["languages"].append("Go")

    # Rust
    if (repo_path / "Cargo.toml").exists():
        stack["languages"].append("Rust")

    # Framework detection
    package_json = repo_path / "package.json"

    if package_json.exists():
        import json

        try:
            data = json.loads(package_json.read_text())

            dependencies = {
                **data.get("dependencies", {}),
                **data.get("devDependencies", {}),
            }

            if "react" in dependencies:
                stack["frameworks"].append("React")

            if "next" in dependencies:
                stack["frameworks"].append("Next.js")

            if "vue" in dependencies:
                stack["frameworks"].append("Vue")

            if "express" in dependencies:
                stack["frameworks"].append("Express")

        except json.JSONDecodeError:
            pass

    return stack