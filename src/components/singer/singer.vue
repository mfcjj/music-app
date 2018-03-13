<template>
  <div class="singer" ref="singer">
    <list-view :data="singers" @select="selectSinger" ref="singerList"></list-view>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import Singer from 'common/js/singer'
  import ListView from 'base/listview/listview'
  import {mapMutations} from 'vuex'
  import {playListMixin} from 'common/js/mixin'

  const HOT_NAME = '热门'
  const HOT_SINGER_LEN = 10

  export default {
    data() {
      return {
        singers: []
      }
    },
    mixins: [playListMixin],
    created() {
      this._getSingerList()
    },
    components: {
      ListView
    },
    methods: {
      _getSingerList() {
        getSingerList().then((res) => {
          var obj = JSON.parse(res.slice(23, -1))
          if (obj.code === ERR_OK) {
            this.singers = this._normalizeSinger(obj.data.list)
          }
        })
      },
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        })
        this.setSinger(singer)
      },
      handlePlayList(playList) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.singer.style.bottom = bottom
        this.$refs.singerList.refresh()
      },
      // 将获取到的数据变成以字母排序的数组
      _normalizeSinger(list) {
        let map = {
          hot: {
            title: HOT_NAME,
            items: []
          }
        }
        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            map.hot.items.push(new Singer(item.Fsinger_id, item.Fsinger_name, item.Fsinger_mid))
          }
          let key = item.Findex
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          map[key].items.push(new Singer(item.Fsinger_id, item.Fsinger_name, item.Fsinger_mid))
        })
        // 将map处理为有序列表,便于遍历
        let hot = []
        let ret = []
        for (var key in map) {
          if (map[key].title.match(/[a-zA-Z]/)) {
            ret.push(map[key])
          } else if (map[key].title === HOT_NAME) {
            hot.push(map[key])
          }
        }
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },
      ...mapMutations({
        setSinger: 'SET_SINGER'
      })
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
