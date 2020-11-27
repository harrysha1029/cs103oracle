var thms;
var idx;

fetch("thms.json")
  .then(response => response.json())
  .then(json => {
    thms = json;
    idx = lunr(function () {
      this.ref('idx')
      this.field('name', {"boost":2})
      this.field('category')
      this.field('tags')
      this.field('content')
      thms.forEach(function (doc) {
          this.add(doc)
      }, this)
    });
    handleChange("")
  })

document.getElementById('search').onkeypress = function(e){
  if (!e) e = window.event;
  var keyCode = e.keyCode || e.which;
  if (keyCode == '13'){
    handleChange(document.getElementById('search').value)
    return false;
  }
}

macros = {
    "\\E": "\\mathbb{E}"
    , "\\Var": "\\text{Var}"
    , "\\Cov": "\\text{Cov}"
    , "\\N":"\\mathbb{N}"
    , "\\Q":"\\mathbb{Q}"
    , "\\R":"\\mathbb{R}"
    , "\\Var":"\\mathrm{Var}"
    , "\\entails":"\\Vdash"
    , "\\forces":"\\Vdash"
    , "\\proves":"\\vdash"
    , "\\tequiv":"\\models \\leftmodels"
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
};

function render_entry(e) {
  name = e.name
  category = e.category
  content = e.content
  type = e.type
  return `<h2> <span class=\"type-str\">${type.toProperCase()}:</span> ${name} </h2>  <div class=\"thm-content\"> ${content} </div>`
}

function handleChange(input) {
    things = document.getElementById("things")
    input = input.trimRight()
    if (input.length == 0) {
      things.innerHTML = "Search something :)"
    } else {
      things.innerHTML = ""
      h = idx.search(input + "*^2 " + input + "~2" )
      // TODO this search term could probably be improved
      h.forEach(entry => {
        things.innerHTML = things.innerHTML + render_entry(thms[entry.ref])
        things.innerHTML += "<div class=\"divider\"> </div>"
      });
      if (Object.keys(h).length == 0) {
        things.innerHTML = "Sorry no results :("

      }

      renderMathInElement(document.body, {
        delimiters: [
          {left: "$$", right: "$$", display: true},
          {left: "$", right: "$", display:false},
          {left: "\\(", right: "\\)", display:false},
          {left: "\\[", right: "\\]", display:true}
        ],
        macros: macros,
        throwOnError: false
      });
    }
}
