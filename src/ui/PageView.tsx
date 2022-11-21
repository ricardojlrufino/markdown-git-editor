import { h } from 'preact';
import { Link } from 'preact-router/match';
import { useEffect, useRef } from 'preact/hooks';
import { style } from '@angular/animations';
const toastui = window.toastui;
const { codeSyntaxHighlight, uml } = toastui.Editor.plugin;
import {ImageWidget} from "./tui-extends/ImageWidget";
import {MermaidBlock} from "./tui-extends/MermaidBlock";

import styles from './_PageView.css?inline';
import { startWith } from 'rxjs/operators';
import ResourceLoader from '../service/ResourceLoader';

export default function PageView({ remaining_path, ...props }) {

    const divRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {

        new ResourceLoader().load(remaining_path).then((data) => {

            const viewer = new toastui.Editor.factory({
                el: document.querySelector('#viewer'),
                viewer: true,
                height: '400px',
                initialValue: data,
                plugins: [uml, [codeSyntaxHighlight], MermaidBlock],
                widgetRules: [ImageWidget("https://fake-base-path/")],
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
