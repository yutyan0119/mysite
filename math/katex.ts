const katex = require('katex');
const marked = require('marked');

const renderer = new marked.Renderer();

function mathsExpression(expr:string) {
  if (expr.match(/^\$\$[\s\S]*\$\$$/)) {
    expr = expr.substr(2, expr.length - 4);
    return katex.renderToString(expr, { displayMode: true });
  } else if (expr.match(/^\$[\s\S]*\$$/)) {
    expr = expr.substr(1, expr.length - 2);
    return katex.renderToString(expr, { isplayMode: false });
  }
}

const rendererCode = renderer.code;
renderer.code = function(code:any, lang:any, escaped:any) {
  if (!lang) {
    const math = mathsExpression(code);
    if (math) {
      return math;
    }
  }

  return rendererCode(code, lang, escaped);
};

const rendererCodespan = renderer.codespan;
renderer.codespan = function(text:any) {
  const math = mathsExpression(text);

  if (math) {
    return math;
  }

  return rendererCodespan(text);
};

const md = '`$$c=\sqrt{a^2 + b^2}$$`';

console.log(marked.parse(md, { renderer: renderer }));