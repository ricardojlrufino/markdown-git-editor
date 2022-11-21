import React from 'preact'

export default function Header() {
  return (
    <header class="header">
      <div class="header__brand">
         <span class="header__name">Git <b>DocBook</b></span>
      </div>
      <nav class="nav">
         
         <ul class="nav__list">
            <a href="/" class="nav__item" aria-current="page"> Home </a>
         </ul>
      </nav>
   </header>
  )
}
