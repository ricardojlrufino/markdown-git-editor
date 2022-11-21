// ref: https://github.com/nhn/tui.editor/blob/master/docs/en/custom-html-renderer.md

import ResourceLoader from '../../service/ResourceLoader';

const resourceLoader = new ResourceLoader();

export function ImageRender(currentResource, modeView) {

    return (node, context) => {
        const { destination } = node;
        const { getChildrenText, skipChildren , origin, entering} = context;
      
        skipChildren();

        let path = resourceLoader.resolveImageRelative(destination, currentResource);

        console.log("[ImageRender] resolved image", path);

        if(modeView && path.endsWith("drawio.png")){

          let alt = getChildrenText(node);
          let html;
          if(modeView){
            html = `
            <img src="${path}" alt="${alt}" data-drawio="true" />
            <div class="drawio-controls">
                <a href="#" class="btn">Ampliar</a>
            </div>
            `;
          }else{
            html = `
            <img src="${path}" alt="${alt}" data-drawio="true" />
            <div class="drawio-controls">
                <a href="#" class="btn">Editar</a>
            </div>
            `;
          }

          let classNames = ["drawio-diagram"];

          return [
            { type: 'openTag', tagName: 'div', outerNewLine: true, classNames, attributes: node.attrs},
            { type: 'html', content: html },
            { type: 'closeTag', tagName: 'div', outerNewLine: true },
          ];

        }else{

          const { origin, entering } = context;
          const result = origin();
          if (entering) {
            result.attributes.src = path;
          }
          
          return result;

            // return {
            //   type: 'openTag',
            //   tagName: 'img',
            //   selfClose: true,
            //   attributes: {
            //     src: path,
            //     alt: getChildrenText(node),
            //   }
            // }

        }
    }
    
  }