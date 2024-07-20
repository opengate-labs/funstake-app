import { useRoutes } from 'react-router-dom'
import Home from './Home'
import PoolList from './PoolList'
import PoolSinge from './PoolSinge'
import CheckCoinPool from '@/middleware/CheckCoinPool'
import { routerGroup } from '@/utils/etc/routerGroup'

const COIN_PAGES = [
  ...routerGroup({
    middleware: [CheckCoinPool],
    routes: [
      {
        path: '/p/:coin/:id',
        element: <PoolSinge />,
      },
      {
        path: '/p/:coin',
        element: <PoolList />,
      },
    ],
  }),
]

export function Pages() {
  return useRoutes([
    ...COIN_PAGES,
    {
      path: '/',
      element: <Home />,
    },
  ])
}

export default Pages
