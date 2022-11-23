
import ResourceLoader from '../../service/ResourceLoader';
const resourceLoader = new ResourceLoader();

export function LinkAfterRender(editor, currentResource){

    var el = editor.preview.previewContent;
    var links = el.querySelectorAll("a");

    links.forEach((link) => {

        link.setAttribute("target", "_blank");

        link.onclick = (e) => {

            let href = link.href;

            debugger;

            // Relative links on render will append current origin... need remove
            if(href.startsWith(window.location.origin)){
                href = "./"+href.substring(window.location.origin.length+1);
            }

            let linkInfo = resourceLoader.resolveLink(href, currentResource);

            if(linkInfo.internal){

                e.preventDefault();
                
                window.location = "#/page" + linkInfo.linkRel;
            }
            
        }

    });

}