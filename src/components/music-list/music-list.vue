<template>
    <div class="music-list">
        <!-- 返回按钮 -->
        <div class="back" @click="goBack">
            <i class="icon-back"></i>
        </div>
        <!-- 标题 -->
        <h1 class="title" v-html="title"></h1>
        <!-- 背景图片 -->
        <div class="bg-image" :style="bgStyle" ref="bgImage">
            <div class="play-wrapper">
                <div ref="playBtn" v-show="songs.length>0" class="play" @click="random">
                    <i class="icon-play"></i>
                    <span class="text">随机播放全部</span>
                </div>
            </div>
            <div class="filter"></div>
        </div>
        <div class="bg-layer" ref="layer"></div>
        <scorll @scroll="scrollListen" :data="songs" class="list" ref="list" :probeType="probeType" :listenScroll="listenScroll">
            <div class="song-list-wrapper">
                <song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
            </div>
        </scorll>
    </div>
</template>

<script>
    import Scorll from "src/base/scroll/scroll.vue";
    import SongList from "src/base/song-list/song-list.vue";
    import {playListMixin} from "../../common/js/mixins.js"
    import {mapActions} from "vuex"
    const RESERVED_HEIGHT = 40;
    export default {
        mixins:[playListMixin],
        props: {
            title: {
                type: String,
                default: ""
            },
            bgImage: {
                type: String,
                default: ""
            },
            songs: {
                type:Array,
                default: []
            },
            rank: {
                type:Boolean,
                default: false
            }
        },
        components: {
            Scorll,
            SongList,
        },
        data() {
            return {
                scrollY:0
            }
        },
        created() {
           this.probeType = 3;
           this.listenScroll = true;
        },
        mounted() {
            this.imageHeight = this.$refs.bgImage.clientHeight;
            this.minTransalteY = - this.imageHeight + RESERVED_HEIGHT;
            this.$refs.list.$el.style.top = `${this.imageHeight}px`;
        },
        computed: {
            bgStyle() {
                 return `background-image:url(${this.bgImage})`
            }
        },
        methods:{
            scrollListen(pos) {
                this.scrollY = pos.y;
            },
            goBack() {
                this.$router.go(-1);
            },
            selectItem(item, index) {
                this.selectPlay({
                    list:this.songs,
                    index
                })
            },
            random() {

            },
            handlePlayList(playlist) {
                const bottom = playlist.length > 0 ? "60px":"0"
                this.$refs.list.$el.style.bottom = bottom;
                this.$refs.list.refresh();
            },
            ...mapActions([
                'selectPlay'
            ])
        },
        watch: {
            scrollY(newY) {
                let scale = 1;
                let zIndex = 0;
                const percent = Math.abs(newY / this.imageHeight);
                if (newY > 0) {
                    scale = 1 + percent
                    zIndex = 10
                }
                let translateY = Math.max(newY, this.minTransalteY);
                this.$refs.layer.style["transform"] = `translate3d(0,${translateY}px,0)`;
                if (newY < this.minTransalteY) {
                    zIndex = 10;
                    this.$refs.bgImage.style.paddingTop = 0;
                    this.$refs.bgImage.style.height = `${RESERVED_HEIGHT}px`;
                    this.$refs.playBtn.style.display = "none";
                }
                else {
                    this.$refs.bgImage.style.paddingTop = "70%";
                    this.$refs.bgImage.style.height = 0;
                    this.$refs.playBtn.style.display = "";
                }

                this.$refs.bgImage.style.zIndex = zIndex;
                this.$refs.bgImage.style.transform = `scale(${scale})`;
            }
        }
    }
</script>

<style lang="stylus" scoped>
    @import "~common/stylus/variable"
    @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
