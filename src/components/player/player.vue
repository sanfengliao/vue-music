<template>
    <div class="player" v-show="playlist.length>0">
      <transition name="normal"
        @enter="enter"
        @after-enter="afterEnter"
        @leave="leave"
        @after-leave="afterLeave"
      >
        <div class="normal-player" v-show="fullScreen">
            <div class="background">
              <img :src="currentSong.image" alt="" width="100%" height="100%">
            </div>
            <div class="top">
              <div class="back" @click="back">
                <i class="icon-back"></i>
              </div>
              <h1 class="title" v-html="currentSong.name"></h1>
              <h2 class="subtitle" v-html="currentSong.singer"></h2>
            </div>
            <div class="middle"
              @touchstart="touchstart"
              @touchmove.prevent="touchmove"
              @touchend="touchend"
            >

              <div class="middle-l" ref="middleL">
                <div class="cd-wrapper" ref="cdWrapper">
                  <div class="cd" :class="cdCls">
                    <img  alt="" class="image" :src="currentSong.image">
                  </div>
                </div>
                <div class="playing-lyric-wrapper">
                    <div class="playing-lyric">
                      {{playingLyric}}
                    </div>
                </div>
              </div>
              <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
                <div class="lyric-wrapper">
                  <div v-if="currentLyric">
                    <p class="text" :class="{'current':index === currentLyricNum}" ref="lyricLine" v-for="(line, index) in currentLyric.lines" :key="index">
                      {{line.txt}}
                    </p>
                  </div>
                </div>
              </scroll>
            </div>
            <div class="bottom">
              <div class="dot-wrapper">
                <span class="dot" :class="{'active':currentShow==='cd'}"></span>
                <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
              </div>
              <div class="progress-wrapper">
                <span class="time time-l">{{format(currentTime)}}</span>
                <div class="progress-bar-wrapper">
                 <progress-bar :percent="percent" @percentChange="percentChange"></progress-bar>
                </div>
                <span class="time time-r">{{format(currentSong.duration)}}</span>
              </div>
              <div class="operators">
                <div class="icon i-left">
                  <i :class="iconMode" @click="changeMode"></i>
                </div>
                <div class="icon i-left">
                  <i class="icon-prev" @click="prev" :class="disableCls"></i>
                </div>
                <div class="icon i-center">
                  <i @click="togglePlay" :class="playIcon" ></i>
                </div>
                <div class="icon i-right">
                  <i class="icon-next" @click="next" :class="disableCls"></i>
                </div>
                <div class="icon i-right" @click="toggleFavorite(currentSong)">
                  <i class="icon" :class="getFavoriteIcon(currentSong)"></i>
                </div>
              </div>
            </div>
        </div>
      </transition>
      <transition name="mini">
        <div class="mini-player" v-show="!fullScreen" @click="open">
          <div class="icon">
            <img :class="cdCls" :src="currentSong.image" alt="" width="40" height="40">
          </div>
          <div class="text">
            <h2 class="name" v-html="currentSong.name"></h2>
            <p class="desc" v-html="currentSong.singer"></p>
          </div>
          <div class="control">
            <progress-circle :percent="percent">
              <i @click.stop="togglePlay" :class="miniIcon" class="icon-mini"></i>
            </progress-circle>
          </div>
          <div class="control" @click.stop="showPlayList">
            <i class="icon-playlist"></i>
          </div>
        </div>
      </transition>
      <play-list ref="playlist"></play-list>
      <audio ref="audio" :src="currentSong.url" @canplay="ready" @error="error" @timeupdate="updateTime" @ended="ended"></audio>
    </div>
</template>

<script>
    import ProgressBar from "../../base/progress-bar/progress-bar.vue";
    import ProgressCircle from "../../base/progress-circle/progress-circle.vue";
    import PlayList from "../playlist/playlist.vue"
    import Scroll from "../../base/scroll/scroll.vue"
    import {playMode} from "../../common/js/config.js"
    import {shuffle} from "../../common/js/utils.js"
    import {mapGetters, mapMutations, mapActions} from "vuex"
    import animations from "create-keyframe-animation"
    import lyricParse from "lyric-parser"
    import {playerMixin} from "../../common/js/mixins.js"
    export default {
        mixins:[playerMixin],
        data() {
          return {
            songReady:false,
            currentTime:0,
            currentLyric:null,
            currentLyricNum:0,
            currentShow:'cd',
            playingLyric:""
          }
        },
        components:{
          ProgressBar,
          ProgressCircle,
          Scroll,
          PlayList
        },
        created() {
          this.touch = {}
        },
        computed:{
          cdCls() {
            return this.playing? 'play':'play-pause'
          },
          playIcon() {
            return this.playing? 'icon-pause' : 'icon-play'
          },
          miniIcon() {
            return this.playing? 'icon-pause-mini' : 'icon-play-mini'
          },
          disableCls() {
            return this.songReady? '' : 'disable';
          },
          percent() {
            return this.currentTime / this.currentSong.duration;
          },
          iconMode() {

            if (this.mode == playMode.sequence) {
              return "icon-sequence";
            } else if (this.mode == playMode.loop) {
              return "icon-loop";
            } else {
              return "icon-random"
            }
          },
          ...mapGetters([
              'fullScreen',
              'playlist',
              'currentSong',
              'playing',
              'currentIndex',
              'mode',
              'sequenceList'
          ])
        },
        methods: {
          showPlayList() {
            this.$refs.playlist.show();
          },
          back() {
            this.setFullScreen(false);
          },
          open() {
            this.setFullScreen(true);
          },
          //图片进入动画开始
          enter(el, done) {
            const {x, y, scale} = this.getPosAndScale();
            let animation = {
              0: {
                transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
              },
              60: {
                transform: `translate3d(0,0,0) scale(1.1)`
              },
              100: {
                transform: `translate3d(0,0,0) scale(1)`
              }
            };
            animations.registerAnimation({
              name:"move",
              animation: animation,
              presets:{
                duration:400,
                easing:"linear"
              }
            });
            animations.runAnimation(this.$refs.cdWrapper, 'move', done);
          },
          afterEnter() {
            animations.unregisterAnimation('move')
            this.$refs.cdWrapper.style.animation = '';
          },
          //图片进入动画结束
          //图片离开动画开始
          leave(el, done) {
            this.$refs.cdWrapper.style.transition="all 0.4s";
            let {x, y, scale} = this.getPosAndScale();
            this.$refs.cdWrapper.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
            this.$refs.cdWrapper.addEventListener("transitionend", done);
          },
          afterLeave() {
            this.$refs.cdWrapper.style.transition = "";
            this.$refs.cdWrapper.style.transform = "";
          },
          //图片离开动画结束
          getPosAndScale() { //获取大图片和小图片的大小比，偏移量
            const targetWidth = 40;
            const paddingLeft = 40;
            const paddingBottom = 30;
            const paddingTop = 30;
            const width = window.innerWidth * 0.8;
            const scale = targetWidth / width;
            const x = -(window.innerWidth / 2 - paddingLeft)
            const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
            return {
              x,
              y,
              scale
            }
          },
          //音乐播放开始
          togglePlay() { //播放暂停
            this.setPlayingState(!this.playing);
             if (this.currentLyric) {
              this.currentLyric.togglePlay();
            }
          },
          next() { //下一首
            if (!this.songReady) {
              return;
            }
            if (this.playlist.length == 1) {
              this.loop();
              return;
            }
            let index = this.currentIndex + 1;
            if (index == this.playlist.length) {
              index = 0;
            }
            if (!this.playing) {
              this.togglePlay();
            }
            this.setCurrentIndex(index);
            this.songReady = false;
          },
          prev(){ //上一首
            if (!this.songReady) {
              return;
            }
            if (this.playlist.length == 1) {
              this.loop();
              return;
            }
            let index = this.currentIndex - 1;
            if (index == -1) {
              index = this.playlist.length-1;
            }
            if (!this.playing) {
              this.togglePlay();
            }
            this.setCurrentIndex(index);
            this.songReady = false;
          },
          ready() {
            this.songReady = true;
            this.savePlayHistory(this.currentSong)
          },
          error(){
            this.songReady = true;
          },
          ended() {
            if(this.mode === playMode.loop) {
              this.loop();
            }else {
              this.next();
            }
          },
          loop() {
            this.$refs.audio.currentTime = 0;
            this.$refs.audio.play();
             if (this.currentLyric) {
              this.currentLyric.seek(0);
            }
          },
          updateTime(e) {
            this.currentTime = e.target.currentTime;
          },
          percentChange(percent) {
            const currentTime = this.$refs.audio.duration * percent;
            this.$refs.audio.currentTime = currentTime
            this.$refs.audio.play();
            if (this.currentLyric) {
              this.currentLyric.seek(currentTime * 1000);
            }
          },
          format(interval) {
            interval = interval | 0;
            const minute = this._pad(interval / 60 | 0);
            const second = this._pad(interval % 60 | 0);
            return `${minute}:${second}`;
          },
          changeMode() {
            const mode = (this.mode + 1) % 3;
            this.setPlayMode(mode);
            let list = []
            if (mode === playMode.random) {
              list = shuffle(this.sequenceList);
            }
            else {
              list = this.sequenceList;
            }

            this.__resetCurrentIndex(list);
            this.setPlayList(list);
          },
          getLyric() {
            this.currentSong.getLyric().then((lyric) => {
              this.currentLyric = new lyricParse(lyric, this.handlerLyrc);
              if (this.playing) {
                this.currentLyric.play();
              }

            });
          },
          handlerLyrc({lineNum, txt}) {
            this.currentLyricNum = lineNum;
            if (lineNum > 5) {
              const el = this.$refs.lyricLine[lineNum - 5];
              this.$refs.lyricList.scrollToElement(el, 1000);
            }else {
              this.$refs.lyricList.scrollTo(0, 0, 1000);
            }
            this.playingLyric = txt;
          },
          touchstart(e){
            this.touch.initial = true;
            this.touch.startX = e.touches[0].pageX;
            this.touch.startY = e.touches[0].pageY;
          },
          touchmove(e) {
            if(this.touch.initial) {

            }
            const deltaX = e.touches[0].pageX - this.touch.startX;
            const deltaY = e.touches[0].pageY - this.touch.StartY;
            if (Math.abs(deltaY) > Math.abs(deltaX)) {
              return;
            }
            const left = this.currentShow === "cd" ? 0 : -window.innerWidth;
            const offset = Math.min(0, Math.max(-window.innerWidth, left + deltaX));
            this.touch.percent = Math.abs(offset / window.innerWidth);
            this.$refs.lyricList.$el.style.transform = `translate3d(${offset}px, 0, 0)`
            this.$refs.lyricList.$el.style.transition = ""
            this.$refs.middleL.style.opacity = 1 - this.touch.percent;
            this.$refs.middleL.style.transition = "";
          },
          touchend(e) {
            let offsetWidth;
            let opacity
            if(this.currentShow === "cd") {
              if(this.touch.percent > 0.1) {
                offsetWidth = - window.innerWidth
                this.currentShow = "lyric"
                opacity = 0;
              }
              else {
                offsetWidth = 0;
                opacity = 1;
              }
            }else {
              if(this.touch.percent < 0.9) {
                offsetWidth = 0
                this.currentShow = "cd"
                opacity = 1;
              }
              else {
                offsetWidth = - window.innerWidth;
                opacity = 0;
              }
            }
            this.$refs.lyricList.$el.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
            this.$refs.lyricList.$el.style.transition = 'all 0.4s'
            this.$refs.middleL.style.opacity = opacity;
            this.$refs.middleL.style.transition = "all 0.4s";
          },
          __resetCurrentIndex(list) {
            let index = list.findIndex((item) => {
              return item.id === this.currentSong.id;
            })
            this.setCurrentIndex(index);

          },
          _pad(num, n = 2) {
            let len = num.toString().length;
            while(len < n) {
              num = '0' + num;
              ++len;
            }
            return num;
          },
          ...mapMutations({
            setFullScreen:'SET_FULL_SCREEN',
            setPlayingState: 'SET_PLAYING_STATE',
            setCurrentIndex:'SET_CURRENT_INDEX',
            setPlayMode: "SET_PLAY_MODE",
            setPlayList:"SET_PLAYLIST"
          }),
          ...mapActions(['savePlayHistory'])
        },
        watch:{
          currentSong(newSong, oldSong) {
            if (!newSong.id) {
              return;
            }
            if(newSong.id === oldSong.id) {
              return;
            }
            if (this.currentLyric) {
              this.currentLyric.stop();
            }
            setTimeout(()=>{
              this.$refs.audio.play();
              this.getLyric();
            }, 1000)
          },
          playing(newPlaying) {
            this.$nextTick(() => {
              newPlaying ? this.$refs.audio.play(): this.$refs.audio.pause();
            })
          }
        }
    }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
