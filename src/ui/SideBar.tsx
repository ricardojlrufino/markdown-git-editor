import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router/match';

import "./sideBar.css" 
import Settings from '../service/Settings';
 
export default function SideBar() {

  const [menuTree, setMenu] = useState([]);

  function loadSettings(){

   let settings = Settings.getSiteSettings();

   fetchMenu(settings["sideBar"]["resource"]);
  }

  function fetchMenu(menuRes:string){

      // Restore from cache e keep loading....
      let rMenuCache = Settings.getOpt(Settings.EDITOR_MENU_CACHE, null);

      if(rMenuCache){
         setMenu(JSON.parse(rMenuCache));
      }

      console.log("Loading menu", menuRes);

      fetch(menuRes).then(async resp => {

         var rMenu = await resp.text();

         localStorage.setItem(Settings.EDITOR_MENU_CACHE, rMenu);

         if(rMenuCache && rMenuCache.length == rMenu.length){
            console.log("Using menu from cache ...");
            return;
         }

         setMenu(JSON.parse(rMenu));

      });

  }

  // Active menu events 
  useEffect(() => {

   loadSettings();

  }, []);

  // Active menu events 
  useEffect(() => {

   var toggler = document.getElementsByClassName("nav-toggle");
   var i;

   for (i = 0; i < toggler.length; i++) {
      toggler[i].addEventListener("click", function(this: any) {
         this.parentElement.querySelector(".submenu").classList.toggle("active");
         this.classList.toggle("caret-down");
      });
   }
   
  }, [menuTree])

  const traverseNode = (node:any) => {
   return (
      <li key={node.title}>
       {node.subItems
         ? 
            <>
               <div class="nav-toggle">{node.title}</div>
               <ul class="submenu">
                  {node.subItems.map((childNode:any) => traverseNode(childNode))}
               </ul>
            </>
         : (
            <a href={node.href}>{node.title}</a>
         )}
      </li>
      );
   };

  return (
   <ul id="sidebar">
      {menuTree.map((node) => traverseNode(node))}
   </ul>
  )
}
