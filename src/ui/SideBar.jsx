import { useState, useEffect } from 'preact/hooks';
import { Link } from 'preact-router/match';

import "./sideBar.css" 

export function SideBar() {


  useEffect(() => {
    
    const list = document.querySelectorAll('.list');

    function accordion(e){
        e.stopPropagation(); 
        e.preventDefault();

        if(this.classList.contains('active')){
            this.classList.remove('active');
        }
        else if(this.parentElement.parentElement.classList.contains('active')){
            this.classList.add('active');
        }
        else{
            for(let i = 0; i < list.length; i++){
              list[i].classList.remove('active');
            }
                this.classList.add('active');
            }
    }

    // Add handler
    for(let i = 0; i < list.length; i++ ){
        list[i].addEventListener('click', accordion);
    }


  }, [])
  

  return (
    <>
   
   <ul class="menu">
   <li class="list"><a href="#">List 1 </a> 
      <ul class="items">
         <li><a href="#"> Item 1-1</a></li>
         <li><a href="#"> Item 1-2</a></li>
         <li><a href="#"> Item 1-3</a></li>
      </ul>
   </li>
   <li class="list"><a href="#">List 2</a> 
      <ul class="items">
         <li> <a href="#" > Item 2-1 </a></li>
         <li> <a href="#" > Item 2-2 </a></li>
         <li> <a href="#" > Item 2-3 </a></li>
      </ul>
   </li>
   <li class="list"><a href="#">List 3</a> 
      <ul class="items">
         <li> <a href="#" > Item 3-1 </a></li>
         <li> <a href="#" > Item 3-2 </a></li>
         <li> <a href="#" > Item 3-2 </a></li>
      </ul>
   </li>
   <li class="list"><a href="#">List 4</a> 
      <ul class="items">
         <li> <a href="#" > Item 4-1 </a></li>
         <li> <a href="#" > Item 4-2 </a></li>
         <li class="list"><a href="#">List 4-1</a> 
            <ul  class="items">
               <li> <a href="#" > Item 4-1-1</a></li>
               <li> <a href="#" > Item 4-1-2</a></li>
               <li class="list"><a href="#">List 4-2</a> 
                  <ul  class="items">
                     <li> <a href="#" > Item 4-2-1</a></li>
                     <li> <a href="#" > Item 4-2-2</a></li>
                  </ul>
               </li>
            </ul>
         </li>
      </ul>
   </li>
</ul>



      </>
  )
}
