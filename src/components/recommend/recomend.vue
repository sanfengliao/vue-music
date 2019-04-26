<template>
    <div class="recommend">
        <scroll ref="scroll" class="recommend-content" :data="descList">
            <div>
                <div v-if=recommend.length class="slider-wrapper">
                    <slider>
                        <div v-for="(item, index) in recommend" :key="index">
                            <a :href="item.linkUrl">
                                <img @load="imageLoad()" class="needsclick" :src="item.picUrl" alt="" />
                            </a>
                        </div>
                    </slider>
                </div>
                <div class="recommend-list">
                    <h1 class="list-title">热门歌单推荐</h1>
                    <ul>
                        <li @click="selectItem(item)" v-for="(item, index) in descList" :key="index" class="item">
                            <div class="icon">
                                <img v-lazy="item.picUrl" alt="" width="60" height="60">
                            </div>
                            <div class="text">
                                <h2 class="name" v-html="item.songListAuthor"></h2>
                                <p class="desc" v-html="item.songListDesc"></p>
                            </div>
                        </li>
                    </ul>
                </div>
            </div> 
            <div class="loading-container" v-show="!descList.length">
                <loading></loading>
            </div>
            <router-view></router-view>
        </scroll>
    </div>
</template>

<script>
    import Slider from "src/base/slider/slider.vue";
    import Scroll from "src/base/scroll/scroll.vue";
    import Loading from "src/base/loading/loading.vue";
    import {getRecommend, getDescList} from '../../api/getRecomend.js';
    import {ERR_OK} from "../../api/config.js";
import { mapMutations } from 'vuex';
   
    export default {
        data() {
            return {
                recommend:[],
                descList:[]
            }
        },
        created(){
            this._getRecommend();
        },
        methods: {
            _getRecommend() {
                getRecommend().then((res) => {
                    if (res.code == ERR_OK) {
                        this.recommend = res.data.slider;
                        this.descList = res.data.songList
                    }
                })
            },
            imageLoad() {
                if (!this.checkImage) {
                    this.$refs.scroll.refresh();
                    this.checkImage = true;
                }
            },
            selectItem(item) {
                this.$router.push({
                    path:`/recommend/${item.id}`
                });
                this.setDesc(item);
            },
            ...mapMutations({
                setDesc:'SET_DESC'
            })
        },
        components:{
            Slider,
            Scroll,
            Loading
        }
    }
</script>

<style lang="stylus" scoped>
    @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
