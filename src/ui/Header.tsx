import React from 'preact'
import { useEffect } from 'preact/hooks';

const SiteConfig =  window.DocSiteConfig;

export default function Header() {

  return (
    <header class="header">
      <div class="header__brand">
         <span class="header__name"><b>{SiteConfig.title}</b></span>
      </div>
      <nav class="nav">
         
         <ul class="nav__list">
            <a href={SiteConfig["docs"]["homePage"]} class="nav__item" aria-current="page"> Home </a>
         </ul>
      </nav>
   </header>
  )
}
