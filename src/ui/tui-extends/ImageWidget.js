
const regexRule = /!\[[^\]]*\]\((?<filename>.*?)(?=\"|\))(?<optionalpart>\".*\")?\)/;

import imgPlaceHolder from "/src/assets/image-placeholder.png"

// TODO: Usa service worker
// https://livebook.manning.com/book/progressive-web-apps/chapter-4/25

// self.addEventListener('fetch', function(event) {                   1
//     if (/\.jpg$/.test(event.request.url)) {                          2
//       event.respondWith(
//         fetch('/images/unicorn.jpg'));                               3
//     }
//   });

export function ImageWidget(basePath) {
    return {
        rule: regexRule,
        toDOM(text) {
            const rule = regexRule;
            const matched = text.match(rule);
            const fileName = matched[1];
            const desc = matched[2];
            const span = document.createElement('span');

            if(fileName.endsWith("drawio.png")){
                span.innerHTML = `xxDIAGRAMAxx -- <a class="widget-anchor" href="${basePath}">${fileName}</a>`;
            }else{
                span.innerHTML = `xxIMAGExx -- <a class="widget-anchor" title="${desc}" href="${basePath}/${fileName}">${fileName}</a>
<img src="${imgPlaceHolder}"  data-git-src="${fileName}" />
`;
            }
            
            return span;
        }
    }
};