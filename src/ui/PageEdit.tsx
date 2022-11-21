import { h } from 'preact';
import { Link } from 'preact-router/match';
import { useEffect, useRef } from 'preact/hooks';
import ResourceLoader from '../service/ResourceLoader';
const toastui = window.toastui;
const { codeSyntaxHighlight , uml} = toastui.Editor.plugin;
import {ImageWidget} from "./tui-extends/ImageWidget";
import {MermaidBlock} from "./tui-extends/MermaidBlock";


export default function PageEdit({ remaining_path, ...props }) {

    const divRef = useRef<HTMLIFrameElement>(null);

    const resource:string = remaining_path;

    const uploadImage = (blob:any, editor_callback:Function) =>{

     // let name = prompt("Informe o nome do arquivo");

      new ResourceLoader().uploadImage(resource, blob).then((uploadedImageURL) => {
        let desc = uploadedImageURL;
        editor_callback(uploadedImageURL, desc);
      });

    }

    useEffect(() => {
      
      new ResourceLoader().load(remaining_path).then((data) => {

            const editor = new toastui.Editor({
                el: document.querySelector('#viewer'),
                viewer: false,
                height: '400px',
                initialValue:  data,
                initialEditType: 'wysiwyg',
                plugins: [uml, [codeSyntaxHighlight], MermaidBlock],
                widgetRules: [ImageWidget("https://fake-base-path/")],
                hooks : {
                  addImageBlobHook : (blob:any, callback:Function) => {
                    uploadImage(blob, callback);
                  }
                }
              });

        });  

    }, [remaining_path])
    

    return (
        <>
            <ul class="breadcrumb">
                <li class="">Edit: {remaining_path}</li>
            </ul>

            <div class="content">
                <div id="viewer">
                </div>
            </div>
           
        </>
    )
}
