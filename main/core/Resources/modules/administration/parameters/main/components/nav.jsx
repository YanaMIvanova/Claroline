import React from 'react'

import {trans} from '#/main/app/intl/translation'
import {Vertical} from '#/main/app/content/tabs/components/vertical'

const Nav = () =>
  <Vertical
    tabs={[
      {
        icon: 'fa fa-fw fa-cog',
        title: trans('parameters'),
        path: '/main'
      }, {
        icon: 'fa fa-fw fa-paper-plane',
        title: trans('portal'),
        path: '/portal'
      },  {
        icon: 'fa fa-fw fa-language',
        title: trans('language'),
        path: '/i18n'
      },
      {
        icon: 'fa fa-fw fa-plug',
        title: trans('plugins'),
        path: '/plugins'
      },
      {
        icon: 'fa fa-fw fa-wrench',
        title: trans('maintenance'),
        path: '/maintenance'
      }
    ]}
  />


export {
  Nav
}
