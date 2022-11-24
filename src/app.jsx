import { useEffect, useState } from 'preact/hooks'
import preactLogo from './assets/preact.svg'
import { createBrowserHistory, createHashHistory } from 'history';
// import './app.static.css'
import './app.scss'

import SideBar from './ui/SideBar'
import Header from './ui/Header';
import Router from 'preact-router'
import Home from './pages/Home'
import { Error } from './pages/Error'
import PageView from './ui/PageView'
import PageEdit from './ui/PageEdit'
import Auth from './service/Auth';

export function App() {

   useEffect(() => {

      Auth.handleAuth();

   }, [])
   
   return (
      <>
         <Header />
         <main>
            <nav class="main__nav">
               <div class="nav__search">
                  <input placeholder="Type to search" class="nav__search-input" />
               </div>
               <div class="TreeNavigation">
                  <SideBar />
               </div>
            </nav>
            <div class="container">

               <Router history={createHashHistory()}>
                  <Home path="/" />
                  <PageView path="/page/:remaining_path*" />
                  <PageEdit path="/edit/:remaining_path*" />
                  <Error type="404" default />
               </Router>

            </div>
         </main>
      </>
   )
}
