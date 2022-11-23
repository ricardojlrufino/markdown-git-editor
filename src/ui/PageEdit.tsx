import { h } from 'preact';
import { Link } from 'preact-router/match';
import { useEffect, useRef, useState } from 'preact/hooks';
import ResourceLoader from '../service/ResourceLoader';
const toastui = window.toastui;
const { codeSyntaxHighlight , uml} = toastui.Editor.plugin;
import {ImageWidget} from "./tui-extends/ImageWidget";
import {MermaidBlock} from "./tui-extends/MermaidBlock";
import {ImageRender} from "./tui-extends/ImageRender";

// import Popup  from 'popup-es';

import Popup from "../utils/Popup";
import Alerts from "../utils/Alerts";
import { RouterProps } from 'preact-router';

export default function PageEdit({ url, ...props } : RouterProps) {

    const remaining_path: string = url.substring("/edit/".length) !;

    const divRef = useRef<HTMLElement>(null);

    const popupSaveRef = useRef<any>(null);

    const editorRef = useRef<any>(null);

    const [resource, setResource] = useState(remaining_path) ;

    const testPopup = async (e:any) =>{

      e.preventDefault();

      popupSaveRef.current.show();

    }


    const testModal = async (e:any) =>{

      e.preventDefault();

      let value = await Alerts.confirm("Deseja continuar editando ?");

      alert(value);

    }

    const viewPage = (url:string) =>{

      // TODO: check changes.

      window.location.href = "#/page/"+ url;

    }

    const editPage = (url:string) =>{

      // TODO: check changes.
      
      setResource(url);
      window.location.href = "#/edit/"+ url;


    }

    const saveContent = async () =>{

      if(!editorRef.current) return;
      
      let content = editorRef.current.getMarkdown()!;
      
      let message = await Alerts.prompt("Mensagem de Commit:", "update docs")!;

      if(!message){
        return;
      }

      let branch =  "patch-docs-" + new Date().getTime();

      console.log("Saving resource: " + resource);

      // ask to use new branch
      if(resource.indexOf("patch-docs") == -1){

        branch = await Alerts.prompt("O seguinte branch sera usado para suas modificações:", branch)!;

        debugger;

        if(!branch){
          return;
        }

      }else{
        branch = null!; // force default
      }

     
      console.log("Saving on branch: " + branch);

      new ResourceLoader().save(resource, content, message, branch).then(async resp =>{

          // Flow for new edits (on master)
          if(resource.indexOf("patch-docs") == -1){
             
            let edit = await Alerts.confirm("Salvo ! Deseja continuar editando ?");

            // mudar para novo arquivo
            if(edit){

              editPage(resp);
                
            }else {

              viewPage(resp);

            }

          }else{

            let edit = await Alerts.confirm("Salvo ! Deseja continuar editando ?");

            if(!edit){

              viewPage(resp);

            }

          }

      });

    }

    const uploadImage = (blob:any, editor_callback:Function) =>{

     // let name = prompt("Informe o nome do arquivo");

      new ResourceLoader().uploadImage(resource, blob).then((uploadedImageURL) => {
        let desc = uploadedImageURL;
        editor_callback(uploadedImageURL, desc);
      });

    }

    useEffect(() => {

      console.log("[page-edit] initializing ..");

      new Popup(); // active popups

      new ResourceLoader().load(remaining_path).then((data) => {

            const editor = new toastui.Editor({
                el: document.querySelector('#viewer'),
                viewer: false,
                height: '100%',
                initialValue:  data,
                initialEditType: 'wysiwyg',
                extendedAutolinks: true,
                plugins: [uml, [codeSyntaxHighlight], MermaidBlock],
                // widgetRules: [ImageWidget(remaining_path, false)], // 
                customHTMLRenderer: {
                    image : ImageRender(remaining_path, false)
                },
                hooks : {
                  addImageBlobHook : (blob:any, callback:Function) => {
                    uploadImage(blob, callback);
                  }
                }
            });

            editorRef.current = editor;

        });  

    }, [remaining_path])
    

    return (
        <>
            <ul class="breadcrumb">
                <li class="">Edit: {remaining_path}</li>
                <li> 
                  <a class="btn" onClick={()=> viewPage(remaining_path) }> View  </a>
                  <a class="btn" onClick={()=> saveContent()}> Save  </a>
                  
             
                </li>

                <li> <a href="#" onClick={(e)=> testPopup(e)} >Popup</a> </li>
                <li> <a href="#" onClick={(e)=> testModal(e)} >testModal</a>  </li>
                 
            </ul>

            <div class="content">
                <div id="viewer">
                </div>

                <dialog ref={popupSaveRef} data-popup="fade" class="modal-dialog">
                  <div class="modal-content">
                      <div class="modal-header">
                        <a href="#" class="btn popup-close-button" data-popup-toggle="close">x</a>
                          Dialog
                       </div>
                      <div class="modal-body"> Suas alterações foram salvas. Gostaria de continuar editando   </div>
                      <div class="modal-footer"> 
                        <a href="#" class="btn" data-popup-toggle="close"> OK </a>  
                      </div>
                  </div>	
                </dialog> 
                 
            </div>
           
        </>
    )
}
