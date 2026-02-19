path = r'c:\Innova8\Easy Ranch-cattle project\SmartCattle AI\src\App.css'
with open(path, 'r', encoding='utf-16') as f:
    lines = f.readlines()

# If it's not utf-16, try something else or just skip
# But since I saw the spaces in the view_file (which likely interpreted it as ASCII/UTF-8 and saw nulls as spaces), it's likely UTF-16.

# Let's just truncate the file at the last valid line.
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    valid_content = f.read()

# Remove the corrupted part (spaced out text)
import re
clean_content = re.sub(r'(\. i n p u t .*|h e i g h t .*)', '', valid_content, flags=re.DOTALL)

with open(path, 'w', encoding='utf-8') as f:
    f.write(clean_content)
    f.write("\n.input-with-icon-wrapper {\n    position: relative;\n    display: flex;\n    align-items: center;\n}\n\n.input-icon {\n    position: absolute;\n    left: 1rem;\n    color: var(--text-secondary);\n}\n\n.pl-10 {\n    padding-left: 2.5rem !important;\n}\n\n.h-12 {\n    height: 3rem;\n}\n")
