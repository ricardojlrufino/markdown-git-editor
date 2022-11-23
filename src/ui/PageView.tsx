import { h } from 'preact';
import { Link } from 'preact-router/match';
import { useEffect, useRef } from 'preact/hooks';
import { style } from '@angular/animations';
const toastui = window.toastui;
const { codeSyntaxHighlight, uml } = toastui.Editor.plugin;
import {ImageWidget} from "./tui-extends/ImageWidget";
import {MermaidBlock} from "./tui-extends/MermaidBlock";
import {ImageRender} from "./tui-extends/ImageRender";
import {LinkAfterRender} from "./tui-extends/LinkAfterRender";


import styles from './_PageView.css?inline';
import { startWith } from 'rxjs/operators';
import ResourceLoader from '../service/ResourceLoader';

export default function PageView({ remaining_path, ...props }) {

    const divRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {

        function onEditorLoad(editor:any){

            LinkAfterRender(editor, remaining_path); // tranform links

            // var el = editor.preview.previewContent;
            // var imgs = el.querySelectorAll("img");

            // imgs.forEach((myimg:any) => {

            //     var txt=document.createElement("span");
            //     txt.innerHTML="Whatever text you want to write . . .";

            //     if(myimg.nextSibling){
            //         myimg.parentNode.insertBefore(txt,myimg.nextSibling);
            //       }else{
            //         myimg.parentNode.appendChild(txt);
            //       }
            // });

        }

        new ResourceLoader().load(remaining_path).then((data) => {

            const viewer = new toastui.Editor.factory({
                el: document.querySelector('#viewer'),
                viewer: true,
                extendedAutolinks: true,
                height: '400px',
                initialValue: data,
                plugins: [uml, [codeSyntaxHighlight], MermaidBlock],
                // widgetRules: [ImageWidget(remaining_path)], // Nao funciona no viewer
                customHTMLRenderer: {
                   image : ImageRender(remaining_path, true)
                },
                linkAttribute: {
                    target: '_blank',
                    contenteditable: 'false',
                    rel: 'noopener noreferrer'
                },
                events: {
                    load : onEditorLoad
                }
              });

            // viewer.setMarkdown(await data.text());

            //document.querySelector(".toastui-editor-contents").contenteditable = false;;

            // Disable All editing features
            document.querySelectorAll("[contenteditable=true]").forEach(el => el.setAttribute("contentEditable", false));

            // var html = viewer.getHTML();

            // var content = `
            //     <link rel="stylesheet" href="https://sindresorhus.com/github-markdown-css/github-markdown.css"></link>
            //     ${html}
            // `;

            // if (divRef.current) {
            //     divRef.current.srcdoc = content;
            // }
            
        });  

    }, [remaining_path])
    

    return (
        <>

            <style>
                {styles}
            </style>

            <ul class="breadcrumb">
                <li class="">View: {remaining_path}</li>
                <li class=""> <Link activeClassName="active" href={"/edit/"+remaining_path}>Edit Page</Link></li>
            </ul>

            <div class="content">
                <div id="viewer">
                </div>

                {/* <iframe ref={divRef} style="width:100%"/> */}

            </div>
           
        </>
    )
}
