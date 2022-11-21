import { useState } from 'preact/hooks'
import { Link } from 'preact-router/match';

import {Navigation} from 'react-minimal-side-navigation';
import 'react-minimal-side-navigation/lib/ReactMinimalSideNavigation.css';


export function SideBar() {

  return (
    <>
        <Navigation
            // you can use your own router's api to get pathname
            activeItemId="/management/members"
            onSelect={({itemId}) => {
              // maybe push to the route
            }}
            items={[
              {
                title: 'Dashboard',
                itemId: '/dashboard',
              },
              {
                title: 'Management',
                itemId: '/management',
                subNav: [
                  {
                    title: 'Projects',
                    itemId: '/management/projects',
                    subNav: [
                      {
                        title: 'Projects 1',
                        itemId: '/management/projects',
                      },
                      {
                        title: 'Members 2',
                        itemId: '/management/members',
                      },
                    ],
                  },
                  {
                    title: 'Members',
                    itemId: '/management/members',
                  },
                ],
              },
              {
                title: 'Another Item',
                itemId: '/another',
                subNav: [
                  {
                    title: 'Teams',
                    itemId: '/management/teams',
                  },
                ],
              },
            ]}
          />
      </>
  )
}
