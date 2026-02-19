import os

path = r'c:\Innova8\Easy Ranch-cattle project\SmartCattle AI\src\index.css'

def fix_css_file(file_path):
    print(f"Fixing {file_path}...")
    try:
        # Try reading as UTF-16 first because the spaces suggest 2-byte encoding misinterpreted as 1-byte
        with open(file_path, 'rb') as f:
            raw = f.read()
        
        # If it looks like UTF-16 (le or be), decode it
        decoded = None
        for enc in ['utf-16', 'utf-16-le', 'utf-16-be', 'utf-8']:
            try:
                decoded = raw.decode(enc)
                if ' ' in decoded and len(decoded) > 100: # Check if it actually worked
                    # If we see many " " after "a", it might be the corruption
                    break
            except:
                continue
        
        if not decoded:
            print("Could not decode file.")
            return

        # Alternative: if it was written as UTF-8 but with null bytes
        if '\x00' in decoded:
            decoded = decoded.replace('\x00', '')
        
        # If it's the specific "spaced out" corruption seen in logs
        # Example: " . i n p u t " -> ".input"
        # Since I see spaces in the view_file, and those are likely actual space characters (0x20)
        # because the tool interpreted the null bytes as spaces or the echo command added them.
        
        import re
        # This regex looks for patterns like " c o l o r : " and collapses them
        # We only want to collapse if it looks consistently spaced
        
        def collapse_spaced_text(text):
            # Find blocks of spaced text
            # A block is at least 3 characters separated by single spaces
            # Example: "b a c k g r o u n d"
            pattern = re.compile(r'(([a-zA-Z0-0\.\#\-\*\/]) )+([a-zA-Z0-0\.\#\-\*\/])')
            
            def replacer(match):
                return match.group(0).replace(' ', '')
            
            return pattern.sub(replacer, text)

        # The previous view_file output showed lines like:
        # 614:  . i n p u t - w i t h - i c o n - w r a p p e r   { 
        # It's likely that the file is UTF-8 but contains these literal spaces.
        
        lines = decoded.splitlines()
        fixed_lines = []
        for line in lines:
            if '  ' in line: # Likely a spaced-out line
                # Check for the pattern of single characters followed by spaces
                # We can try to strip all spaces and see if it makes sense, 
                # but CSS needs spaces in some places.
                # However, the corruption seems to be "char space char space"
                
                # Simple heuristic: if more than 50% of characters are spaces and they are interleaved
                stripped = line.strip()
                if len(stripped) > 4:
                    # Check if every second char is a space
                    if all(stripped[i] == ' ' for i in range(1, len(stripped), 2)):
                        line = stripped.replace(' ', '')
            fixed_lines.append(line)
            
        final_content = '\n'.join(fixed_lines)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(final_content)
        print("Done.")

    except Exception as e:
        print(f"Error: {e}")

fix_css_file(path)
