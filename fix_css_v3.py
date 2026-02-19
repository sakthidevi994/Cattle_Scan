import os

file_path = r'c:\Innova8\Easy Ranch-cattle project\SmartCattle AI\src\index.css'
with open(file_path, 'r', encoding='utf-16le') as f:
    content = f.read()

# Filter out null bytes or extra spaces if it's utf-16 related corruption
# Actually, if it's "s p a c e d", it looks like:
# ' ' + char + ' ' ...
# Let's try to just remove the spaces if they are between every char.

# If it was redirected via powershell > or >> it might be UTF-16
# Let's read it as bytes and check.
with open(file_path, 'rb') as f:
    data = f.read()

# If it's UTF-16, converting to string usually fixes the "visual spaces" if handled correctly.
# But here it looks like literal spaces were added.

# Let's try to clean it.
clean_content = content.replace('\x00', '') # Remove null bytes
if ' . r e g i s t r a t i o n ' in clean_content:
    # It's definitely spaced.
    # We can't just remove all spaces because valid CSS has spaces.
    # However, if it's char-by-char spacing, we can rebuild it.
    pass

# A better way: just rewrite the file with the correct content for the appended part.
# But I don't want to lose the previous content.

# Let's read the file as a normal string and see.
with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.strip().startswith('.'):
        # Check if it's spaced
        stripped = line.strip()
        if len(stripped) > 3 and stripped[1] == ' ' and stripped[3] == ' ':
            new_lines.append(stripped.replace(' ', '') + '\n')
        else:
            new_lines.append(line)
    else:
        new_lines.append(line)

# This might be too complex for a one-off.
# I'll just restore the file to a known good state and then append properly.
