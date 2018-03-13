import Vue from 'vue'
import Router from 'vue-router'
// import Recommend from 'components/recommend/recommend'
// import Singer from 'components/singer/singer'
// import Rank from 'components/rank/rank'
// import Search from 'components/search/search'
// import SingerDetail from 'components/singer-detail/singer-detail'
// import Disc from 'components/disc/disc'
// import TopList from 'components/top-list/top-list'
// import UserCenter from 'components/user-center/user-center'
Vue.use(Router)

const Recommend = (resolve) => {
  import('components/recommend/recommend').then((recommend) => {
    resolve(recommend)
  })
}
const Singer = (resolve) => {
  import('components/singer/singer').then((Singer) => {
    resolve(Singer)
  })
}
const Rank = (resolve) => {
  import('components/rank/rank').then((Rank) => {
    resolve(Rank)
  })
}
const Search = (resolve) => {
  import('components/search/search').then((Search) => {
    resolve(Search)
  })
}
const SingerDetail = (resolve) => {
  import('components/singer-detail/singer-detail').then((SingerDetail) => {
    resolve(SingerDetail)
  })
}
const Disc = (resolve) => {
  import('components/disc/disc').then((Disc) => {
    resolve(Disc)
  })
}
const TopList = (resolve) => {
  import('components/top-list/top-list').then((TopList) => {
    resolve(TopList)
  })
}
const UserCenter = (resolve) => {
  import('components/user-center/user-center').then((UserCenter) => {
    resolve(UserCenter)
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children: [
        {
          path: ':id',
          component: Disc
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children: [
        {
          path: ':id',
          component: TopList
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      children: [
        {
          path: ':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter
    }
  ]
})
