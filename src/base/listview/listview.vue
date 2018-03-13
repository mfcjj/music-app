<template>
  <scroll class="listview" :data="data" ref="listview" :listenScroll="listenScroll" @scroll="scroll"
          :probeType="probeType">
    <ul>
      <li v-for="group in data" class="list-group" ref="listgroup">
        <h2 class="list-group-title">{{group.title}}</h2>
        <ul>
          <li v-for="item in group.items" class="list-group-item" @click="selectItem(item)">
            <img v-lazy="item.avatar" alt="" class="avatar">
            <span class="name">{{item.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchstart="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li v-for="(item, index) in shortcutList" class="item" :data-index="index"
            :class="{current: currentIndex === index}">
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed">
      <h1 class="fixed-title" v-show="fixedTitle">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getData} from 'common/js/dom'

  const ANCHOR_HEIGHT = 18
  const TITLE_HEIGHT = 30
  export default {
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
    created() {
      this.touch = {}
      this.listenScroll = true
      this.listHeight = []
      this.probeType = 3
    },
    props: {
      data: {
        type: Array,
        default: []
      }
    },
    computed: {
      shortcutList() {
        return this.data.map((item) => {
          return item.title.substr(0, 1)
        })
      },
      // 固定的小标题
      fixedTitle() {
        // 滚动到顶部时会显示两个标题，所以返回空，返回空时固定标题不显示
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    components: {
      Scroll,
      Loading
    },
    methods: {
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.y1 = firstTouch.pageY
        this.touch.anchorIndex = anchorIndex
        this._scrollTo(anchorIndex)
      },
      // 拖动时右边入口列表时左边数据列表也滚动
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.y2 = firstTouch.pageY
        let delta = Math.floor((this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT)
        let anchorIndex = +this.touch.anchorIndex + delta
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y
      },
      refresh() {
        this.$refs.listview.refresh()
      },
      _scrollTo(index) {
        if (!index && index !== 0) {
          return
        }
        // 确保右侧拖动到顶和底时滚动正常，如果一直拖动的话，传入的index会一直减小或一直增大，导致index可能比0小或比最大值大
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        // 联动的current效果（右侧相应字母高亮）是根据scrollY的值计算出来的，所以点击右侧的时候也要改变scrollY,才能触发联动的current变化效果
        this.scrollY = -this.listHeight[index]
        this.$refs.listview.scrollToElement(this.$refs.listgroup[index], 0)
      },
      _calculateHeight() {
        this.listHeight = []
        const list = this.$refs.listgroup
        let height = 0
        this.listHeight.push(height)
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
        }
      },
      // 点击列表时派发事件将歌手信息传出去
      selectItem(item) {
        this.$emit('select', item)
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      // 根据scrollY的值的变化来实现联动的current效果（右侧相应字母高亮）
      scrollY(newY) {
        const listHeight = this.listHeight
        // 当滚动到顶部， newY>0
        if (newY > 0) {
          this.currentIndex = 0
          return
        }
        // 在中间滚动
        for (let i = 0; i < listHeight.length - 1; i++) {
          let height1 = listHeight[i]
          let height2 = listHeight[i + 1]
          // 往上滚动 newY 是负数
          if (-newY >= height1 && -newY < height2) {
            this.currentIndex = i
            // diff表示滚动的位置和元素上限之间的差值，即 height2-（-newY），newY小于0，故用+  ，需要实时计算确定固定标题是否需要往上顶
            this.diff = height2 + newY
            return
          }
        }
        // 滚动到最底部，newY大于最后一个元素的纵坐标上限
        this.currentIndex = listHeight.length - 2
        // listHeight数组的元素比DOM多一个，倒数第二个索引才表示最后一个元素
      },
      diff(newval) {
        // 固定标题往上顶的距离，当下一个标题的上限与固定标题的下限重合时，固定标题开始往上顶，故fixedTop为负数
        let fixedTop = (newval > 0 && newval < TITLE_HEIGHT) ? newval - TITLE_HEIGHT : 0
        // 不滚动或fixedTop为0时不操作
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        // 往上顶
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
