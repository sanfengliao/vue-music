<template>
    <scroll class="suggest" :data="result" :pullup="pullup" @scrollToEnd="searchMore">
        <ul class="suggest-list">
            <li class="suggest-item" @click="selectItem(item)" v-for="(item, index) in result" :key="index">
                <div class="icon">
                    <i :class="getIconCls(item)"></i>
                </div>
                <div class="name">
                    <p class="text" v-html="getDisplayName(item)"></p>
                </div>
            </li>
        </ul>
    </scroll>
</template>

<script>
    import {mapMutations, mapActions, mapGetters} from "vuex"
    import Scroll from "../../base/scroll/scroll.vue"
    import {search} from "../../api/search.js"
    import {createSong} from "../../common/js/song.js"
    import Singer from "../../common/js/singer.js"
    const TYPE_SINGER = "singer"
    const perpage = 20
    export default {
        props:{
            query: {
                type:String,
                default:''
            },
            showSinger: {
                type:Boolean,
                default:true,
                pullup:true
            }
        },
        data() {
            return {
                page:1,
                result:[],
                pullup:true,
                hasMore:true
            }
        },
        computed: {
          ...mapGetters([
            'songKey',
            'prefix',
            'subfix'
          ])
        },
        methods: {
            search() {
                search(this.query, this.page, this.showSinger, perpage).then((res) => {
                    this.result = this._genResult(res.data);
                    this._checkMore(res.data);
                })
            },
            getIconCls(item) {
                if (item.type == TYPE_SINGER) {
                    return 'icon-mine'
                }else {
                    return 'icon-music'
                }
            },
            getDisplayName(item) {
                if (item.type === TYPE_SINGER) {
                    return item.singername
                }else {
                    return `${item.name}-${item.singer}`
                }
            },
            searchMore() {
                if (!this.hasMore) {
                    return;
                }
                this.page++;
                search(this.query, this.page, this.showSinger, perpage).then((res) => {
                    this.result = result.concat(this._genResult(res.data));
                    this._checkMore(res.data);
                })
            },
            selectItem(item) {
                if(item.type == TYPE_SINGER) {
                    let singer = new Singer(item.singermid, item.singername);
                    this.$router.push({
                        path:`/search/${singer.id}`
                    })
                    this.setSinger(singer);
                    this.$emit("select", item.singername);
                }
                else {
                    this.insertSong(item);
                    this.$emit("select", item.name)
                }
            },
            _genResult(data) {
                let ret = [];
                if (data.zhida && data.zhida.singerid) {
                    ret.push({...data.zhida, ...{type:TYPE_SINGER}});
                }
                if (data.song) {
                    ret = ret.concat(this._normalizeSong(data.song.list));
                }
                return ret;
            },
            _normalizeSong(list) {
                let ret = [];
                list.forEach(musicData => {
                    ret.push(createSong(musicData, this.songKey, this.prefix, this.subfix));
                });
                return ret;
            },
            _checkMore(data) {
                const song = data.song
                if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
                    this.hasMore = false
                }
            },
            ...mapMutations({
                setSinger: "SET_SINGER"
            }),
            ...mapActions(['insertSong'])
        },
        watch: {
            query(){
                this.search();
            }

        },
        components:{
            Scroll
        }
    }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
