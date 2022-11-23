import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router/match';

import "./sideBar.css" 
 
export default function SideBar() {

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
    
   
  }, [])
  

  return (
   <ul id="sidebar">
      <li><a href="/page/docs/Popcorn.md">Popcorn</a></li>
      <li><a href="/page/docs/Readme.md">Readme</a></li>
      <li><div class="nav-toggle">Gitlab</div>
         <ul class="submenu">
            <li><a href="/page/vip51/roteiros/publico/-/blob/feature-testes/subpasta/ROTEIRO_SOBRE_FILE.md">Teste Imagens e Diagramas</a></li>
            <li><a href="/page/vip51/roteiros/publico/-/blob/feature-testes/subpasta/PluginTUI.md">Modelo Plugin TUI</a></li>
            <li><a href="#">Coffee</a></li>
            <li><div class="nav-toggle">Tea</div>
            <ul class="submenu">
               <li>Black Tea</li>
               <li><div class="nav-toggle">Green Tea</div>
                  <ul class="submenu">
                     <li><a href="#">Sencha</a></li>
                     <li>Gyokuro</li>
                     <li>Matcha</li>
                     <li>Pi Lo Chun</li>
                  </ul>
               </li>
               <li>White Tea</li>
            </ul>
            </li>
         </ul>
      </li>
   </ul>
  )
}
