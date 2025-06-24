from pathlib import Path
import shutil

# Define the folders to process
SOURCE_FOLDERS = [
    Path("src/clients"),
    Path("src/contexts"),
    Path("src/hooks"),
    Path("src/includes"),
    Path("src/libs"),
    Path("src/models"),
    Path("src/repositories"),
    Path("src/services"),
]

DEST_BASE = Path(".temp")

def dot_to_camel(name_with_dot: str) -> str:
    parts = name_with_dot.split(".")
    return parts[0] + "".join(p.capitalize() for p in parts[1:])

def process_folder(source_folder: Path):
    if not source_folder.is_dir():
        print(f"🔍 Skipping (not a folder): {source_folder}")
        return

    files = [f for f in source_folder.iterdir() if f.is_file() and f.suffix == ".ts"]
    if not files:
        print(f"🚫 No .ts files in: {source_folder}")
        return

    # Create destination folder path relative to src/
    relative_path = source_folder.relative_to("src")
    dest_folder = DEST_BASE / relative_path
    dest_folder.mkdir(parents=True, exist_ok=True)

    for file_path in files:
        base_name = file_path.stem  # 'user.service' part
        new_name = dot_to_camel(base_name) + ".txt"
        dest_path = dest_folder / new_name

        shutil.copy2(file_path, dest_path)
        print(f"✅ Copied: {file_path} → {dest_path}")

def main():
    for folder in SOURCE_FOLDERS:
        process_folder(folder)

if __name__ == "__main__":
    main()
