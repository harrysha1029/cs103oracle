""" 
Takes TEX_PATH the tex file containing all the theorems
and definitions, and generates THMS_PATH, a json containing 
all the theorems in html form.
"""

import json
import re
from pprint import pprint

import pypandoc
from tqdm import tqdm

THMS_PATH = "thms.json"
TEX_PATH = "tex/cs103.tex"


def load_json(path):
    with open(path, "r") as f:
        return json.load(f)


def save_json(j, path):
    with open(path, "w") as f:
        return json.dump(j, f, indent=4)


def flatten(l):
    return [item for sublist in l for item in sublist]


def parse_tex_entry(entry, section):
    """
    Parses a single entry (theorem or definition)
    to json with content converted to html
    """
    _type = entry[0]
    content = entry[1]
    content_lines = [x.strip() for x in content.split("\n")]
    name = content_lines.pop(0)[1:-1]
    if content_lines[0][0] == "%":
        tags = content_lines.pop(0)[8:]
    else:
        tags = ""

    content = "\n".join(content_lines)
    return {
        "type": _type,
        "name": name,
        "tags": tags,
        "category": section,
        "content": tex2html(content),
    }


def parse_tex_section(section):
    """
    Parses a single section
    to json with content converted to html
    """
    right_brace_ind = section.index("}")
    section_name = section[:right_brace_ind]
    content = section[right_brace_ind + 1 :]
    entries = re.findall(
        r"begin{(theorem|definition|lemma)}(.*?)\\end{(theorem|definition|lemma)}",
        content,
        re.DOTALL,
    )
    return [parse_tex_entry(e, section_name) for e in entries]


def parse_tex(fname):
    """Converts a latex document into a json of
    entries
    """
    with open(fname, "r") as f:
        text = f.read()
    sections = text.split("\\section{")[1:]
    entries = flatten([parse_tex_section(x) for x in tqdm(sections)])
    for i, x in enumerate(entries):
        x.update({"idx": i})
    return entries


def tex2html(x):
    """
    Converts x which is tex code to html code
    using the pypandoc library.
    """
    return pypandoc.convert_text(x, "html", format="tex", extra_args=["--mathjax"])


if __name__ == "__main__":
    parsed = parse_tex(TEX_PATH)
    save_json(parsed, THMS_PATH)
