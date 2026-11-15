"""Downloads the homepage and the help page used by build_data.py."""
import html
import os
import re
import subprocess
import sys

RAW = sys.argv[1]
os.makedirs(f"{RAW}/pages", exist_ok=True)


def get(url):
    return subprocess.run(
        ["curl", "-sSL", "-A", "Mozilla/5.0", "--max-time", "60", url], capture_output=True, text=True, errors="replace"
    ).stdout


open(f"{RAW}/home.html", "w").write(get("https://www.cosmet.com.bo/"))
h = get("https://www.cosmet.com.bo/ayuda")
i, j = h.find("maincontent"), h.find("<footer")
t = re.sub(r"<(script|style)[^>]*>.*?</\1>", "", h[i:j], flags=re.S)
t = re.sub(r"<br\s*/?>|</p>|</h\d>|</li>|</tr>|</div>", "\n", t)
t = html.unescape(re.sub("<[^>]+>", "", t))
t = re.sub(r"[ \t]+", " ", t)
t = re.sub(r"\n\s*\n+", "\n", t).strip()
open(f"{RAW}/pages/ayuda.txt", "w").write(t)
print("pages ok", len(t))
