from dataclasses import dataclass, field
@dataclass
class CodebaseContext:
    languages: list[str] = field(default_factory=list)
    frameworks: list[str] = field(default_factory=list)
    package_managers: list[str] = field(default_factory=list)

    folder_structure: list[str] = field(default_factory=list)
    important_files: list[str] = field(default_factory=list)

    conventions: dict = field(default_factory=dict)
    patterns: dict = field(default_factory=dict)