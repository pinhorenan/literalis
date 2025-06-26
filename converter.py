from pathlib import Path
import shutil

SOURCE_FOLDERS = [
    Path("src/clients"),
    Path("src/includes"),
    Path("src/libs"),
    Path("src/models"),
    Path("src/repositories"),
    Path("src/services"),
    Path("tests/services"),
]

DEST_BASE = Path(".temp")

def dot_to_camel(name_with_dot: str) -> str:
    parts = name_with_dot.split(".")
    return parts[0] + "".join(p.capitalize() for p in parts[1:])

def get_base_folder(path: Path) -> str:
    """Retorna a pasta raiz como 'src' ou 'tests'."""
    parts = path.parts
    for base in ["src", "tests"]:
        if base in parts:
            return base
    return parts[0]  # fallback

def process_folder(source_folder: Path):
    if not source_folder.is_dir():
        print(f"🔍 Skipping (not a folder): {source_folder}")
        return

    files = [f for f in source_folder.iterdir() if f.is_file() and f.suffix == ".ts"]
    if not files:
        print(f"🚫 No .ts files in: {source_folder}")
        return

    base = get_base_folder(source_folder)
    relative_path = source_folder.relative_to(base)
    dest_folder = DEST_BASE / base / relative_path
    dest_folder.mkdir(parents=True, exist_ok=True)

    files_coverted = 0

    for file_path in files:
        base_name = file_path.stem
        new_name = dot_to_camel(base_name) + ".txt"
        dest_path = dest_folder / new_name

        shutil.copy2(file_path, dest_path)
        files_coverted += 1

    print(f"✅ Processed {files_coverted} files from {source_folder}")

def main():
    for folder in SOURCE_FOLDERS:
        process_folder(folder)

if __name__ == "__main__":
    main()
