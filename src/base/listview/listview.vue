<template>
  <!-- 歌手列表 监听滚动事件 -->
   <scroll v-if="data.length > 0" :data="data" class="listview" ref="scroll" :listenScroll="true" :probeType="3"  @scroll="scroll">
       <ul>
           <li v-for="group in data" :key="group.title" class="list-group" ref="listGroup">
               <h2 class="list-group-title">{{group.title}}</h2>
               <ul>
                   <li @click="selectItem(item)" class="list-group-item" v-for="(item, index) in group.items" :key="index">
                       <img v-lazy="item.avatar" class="avatar" alt="">
                       <span class="name">{{item.name}}</span>
                   </li>
               </ul>
           </li>
      </ul>
      <!-- 右边导航栏  -->
      <div class="list-shortcut" @touchstart="onShortCutTouchStart" @touchmove.stop.prevent="onShortCutTouchMove">
          <ul>
              <li class="item" v-for="(item ,index) in shortcut" :key="index" :data-index="index" :class="{'current': currentIndex === index}">
                  {{item}}
              </li>
          </ul>
      </div>
      <!-- 固定标题栏 -->
      <div class="list-fixed" v-show="getFixedTitle" ref="fixed">
          <div class="fixed-title">{{getFixedTitle}}</div>
      </div>
      <!-- loading效果 -->
      <div v-show="!data.length" class="loading-container">
        <loading></loading>
      </div>
   </scroll>
</template>

<script>
    import Scroll from "src/base/scroll/scroll.vue";
    import Loading from "src/base/loading/loading.vue";
    import {attr} from "common/js/dom.js";
     const TITLE_HEIGHT = 30;
    export default {
        props: {
            data:{
                type:Array,
                default: []
            }
        },
        data() {
            return {
                scrollY: 0,
                currentIndex: 0,
                heightList: [], // 滚动区域每一部分的高度
                diff: -1 // scrollY与下一项内容之间的距离, 即heightList[currentIndex+1] - scrollY
            }
        },
        components: {
            Scroll,
            Loading
        },
        created(){
            this.touch = {};
        },
        computed:{
            // 获取右边导航栏的内容
            shortcut() {
                return this.data.map((item) => {
                    return item.title.substr(0, 1);
                });
            },
            // 获取固定title的值
            getFixedTitle() {
                if (this.scrollY > 0) {
                    return "";
                }
                return this.data[this.currentIndex] ? this.data[this.currentIndex].title:"";
            }
        },
        methods: {
            onShortCutTouchStart(e) {
              // 开始触摸时手指在哪个字母上上
               let index = attr(e.target, "index");
               this.touch.y1 = e.touches[0].pageY;
               this.touch.index = index;
               this._scrollTo(index);
            },
            onShortCutTouchMove(e) {

                // 计算移动的距离, 得到手指在哪个字母上上
                this.touch.y2 = e.touches[0].pageY;
                let delta = (this.touch.y2 - this.touch.y1) / 18 | 0;

                let index = parseInt(this.touch.index) + delta;
                // 滚动内容区域
                this._scrollTo(index);
            },
            scroll(pos) {
              // 监听内容的scroll事件，更新scrollY
               this.scrollY = pos.y;
            },
            refresh() {
                setTimeout(() => {
                  this.$refs.scroll.refresh();
                }, 200);
            },
            selectItem(item) {
                this.$emit("select", item);
            },
            // 滚动到下标
            _scrollTo(index) {
                if (!index || index < 0) {
                    index = 0;
                }
                if (index > this.heightList.length - 2) {
                    index = this.heightList.length - 2;
                }
                // 重新计算右边滚动的距离
                this.scrollY = -this.heightList[index];
                console.log(index, this.scrollY)
                this.$refs.scroll.scrollToElement(this.$refs.listGroup[index], 0);
            },
            // 计算高度
            _calculateHeight() {
                let list = this.$refs.listGroup;
                let height = 0;
                this.heightList.push(height);
                for (let i = 0; i < list.length; ++i) {
                    height += list[i].clientHeight;
                    this.heightList.push(height);
                }
            }
        },
        watch: {
            data(n, o) {
              this.$nextTick(() => {
                this._calculateHeight();
                this.refresh()
              })
            },
            scrollY(newY) {
                if (newY >= 0) {
                    this.currentIndex = 0;
                    return;
                }
                // 通过scrollY得到currentIndex
                for (let i = 0; i < this.heightList.length - 1; ++i) {
                    let h1 = this.heightList[i];
                    let h2 = this.heightList[i+1];
                    if(h1 <= -newY && h2 > -newY) {
                        this.currentIndex = i;
                        this.diff = h2 + newY;
                        return;
                    }
                }
                // 到达最底部
                this.currentIndex = this.heightList.length - 2;
            },
            diff(newDiff) {
              // 计算向上偏移多少距离
              let fixedTop = newDiff > 0 && newDiff < TITLE_HEIGHT ? newDiff - TITLE_HEIGHT : 0;
              this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
            }
        }
    }
</script>

<style lang="stylus" scoped>
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
