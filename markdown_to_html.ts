import { marked } from 'marked';
import * as fs from 'fs';
import sanitizeHtml from 'sanitize-html';

let output = fs.readFileSync('./test.md');
let output_s = output.toString();

let html = marked.parse(output_s);

console.log(html)

console.log(sanitizeHtml(html),{allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'del'])})
let html2 = '<meta name="viewport" content="width=device-width, initial-scale=1">\n<link rel="stylesheet" href="github-markdown.css"><script src="https://cdn.jsdelivr.net/gh/google/code-prettify@master/loader/run_prettify.js"></script><article class="markdown-body">' + html + '\n</article>'

let test = fs.openSync("test.html","w");
fs.writeFileSync(test,html2);