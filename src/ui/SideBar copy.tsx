import { useState } from 'preact/hooks'
import { Link } from 'preact-router/match';

export function SideBar() {

  return (
    <>
        <div class="NavigationLevel NavigationLevel--level-0">
              <ul>
                  <li>
                    <div class="NavigationLevel NavigationLevel--level-1">
                        <div class="NavigationLevel__parent">
                          <span class="NavigationToggle"><span class="NavigationToggle__icon"></span></span> 
                          <span class="NavigationItem NavigationItem--active">
                              <a href="#" class="NavigationItem__router-link router-link-exact-active router-link-active" aria-current="page">Playbook</a>  
                          </span>
                        </div>
                        <ul class="NavigationLevel__children">
                          <li>
                              <span class="NavigationItem">
                                <Link activeClassName="active" href="/page/docs/Popcorn.md">
                                    Page 1 
                                </Link>
                              </span>
                          </li>
                          <li>
                              <span class="NavigationItem">
                                <Link activeClassName="active" href="/page/docs/Readme.md">
                                    Page 2
                                </Link>
                              </span>
                          </li>
                          <li>
                              <span class="NavigationItem">
                                <Link activeClassName="active" href="/page/git/vip51/roteiros/publico/-/blob/feature-testes/subpasta/ROTEIRO_SOBRE_FILE.md">
                                    Git 1
                                </Link>
                              </span>


                              
                          </li>
                          <li>
                              <span class="NavigationItem">
                                  <a href="/file:/media/ricardo/Dados/TEMP/TESTES/HTML/gitpages-site-playbook/git-playbook/dist/index.html/#/playbook/roadmap" class="NavigationItem__router-link">Our Roadmap</a>  
                              </span>
                          </li>
                          <li>
                              <div class="NavigationLevel NavigationLevel--closed NavigationLevel--level-2">
                                <div class="NavigationLevel__parent">
                                    <span class="NavigationToggle NavigationToggle--closed"><span class="NavigationToggle__icon NavigationToggle__icon--closed"></span></span> 
                                    <span class="NavigationItem">
                                        <a href="/file:/media/ricardo/Dados/TEMP/TESTES/HTML/gitpages-site-playbook/git-playbook/dist/index.html/#/playbook/process" class="NavigationItem__router-link">Process Documentation</a>  
                                    </span>
                                </div>
                                <ul class="NavigationLevel__children">
                                    <li>
                                      <span class="NavigationItem">
                                          <a href="/file:/media/ricardo/Dados/TEMP/TESTES/HTML/gitpages-site-playbook/git-playbook/dist/index.html/#/playbook/process/introduction" class="NavigationItem__router-link">Process Introduction</a>  
                                      </span>
                                    </li>
                                    <li>
                                      <span class="NavigationItem">
                                          <a href="/file:/media/ricardo/Dados/TEMP/TESTES/HTML/gitpages-site-playbook/git-playbook/dist/index.html/#/playbook/process/newPagesHowto" class="NavigationItem__router-link">New Pages HowTo</a>  
                                      </span>
                                    </li>
                                </ul>
                              </div>
                          </li>
                        </ul>
                    </div>
                  </li>
              </ul>
            </div>
    </>
  )
}
