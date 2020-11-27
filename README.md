A searchable website containing key definitions and theorems from CS103: Mathematical Foundations of Computer at Stanford.

# Adding and updating

## Setup
Install the python libraries `pip install requirements.txt -r`. You'll also need pandoc on your computer which is used to convert tex to html.

## Add new things
To add a new theorem or definition, go to `tex/cs103.tex` and simply add definitions and theorems to the file. Use the structure

```latex
\begin{theorem}[<Name of theorem>]
    % tags: SAT complete, cook 
    <content>
\end{theorem}
```

Where tags is an optional line containing some tags to be used in the search.

## Convert
To update the website, run `python compile.py` and the tex will be parsed into html.

## Just the pdf
You can also simply compile the tex file into a pdf if you don't need the website.

## Changing search criterion
This project uses [lunr.js](https://lunrjs.com/guides/searching.html) to implement the search.
