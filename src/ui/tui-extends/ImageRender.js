// ref: https://github.com/nhn/tui.editor/blob/master/docs/en/custom-html-renderer.md

import ResourceLoader from '../../service/ResourceLoader';

const resourceLoader = new ResourceLoader();

export function ImageRender(currentResource) {

    return (node, context) => {
        const { destination } = node;
        const { getChildrenText, skipChildren } = context;
      
        skipChildren();

        let path = resourceLoader.resolveImageRelative(destination, currentResource);
      
        return {
          type: 'openTag',
          tagName: 'img',
          selfClose: true,
          attributes: {
            src: path,
            alt: getChildrenText(node),
          }
        };
    }
    
  }