<template>
    <div class="search">
        <div class="search-box-wrapper">
            <search-box ref="searchBox" @query="onQueryChange"></search-box>
        </div>
        <div ref="shortcut" class="shortcut-wrapper" v-show="!query">
            <div class="shortcut">
                <div class="hot-key">
                    <h1 class="title">热门搜索</h1>
                    <ul>
                        <li @click="addQuery(item.k)" class="item" v-for="(item,index) in hotKey" :key="index">
                            <span>{{item.k}}</span>
                        </li>
                    </ul>
                </div>
                <div class="search-history" v-show="searchHistory.length > 0">
                    <h1 class="title">
                        <span class="text">搜索历史</span>
                        <span class="clear" @click="clearHistory">
                            <i class="icon-clear"></i>
                        </span>
                    </h1>
                    <search-list :searches="searchHistory" @selectItem="addQuery" @deleteItem="deleteSearchHistory"></search-list>
                </div>
            </div>
        </div>
        
        <div class="suggest-result" v-show="query" ref="suggest">
            <suggest @select="saveSearch" :query="query"></suggest>
        </div>
        <confirm text="是否清空" ref="confirm" @confirm="clearSearchHistory"></confirm>
        <router-view></router-view>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from "vuex"
    import Scroll from "../../base/scroll/scroll.vue"
    import Confirm from "../../base/confirm/confirm.vue"
    import SearchList from "../search-list/search-list.vue"
    import SearchBox from "../../base/search-box/search-box.vue";
    import Suggest from "../suggest/suggest.vue"
    import {getHotKey} from "../../api/search.js"
    import {playListMixin} from "../../common/js/mixins.js"
    export default {
        mixins:[playListMixin],
        components:{
            SearchBox,
            Suggest,
            SearchList,
            Confirm
        },
        data() {
            return {
                hotKey:[],
                query:""
            }
        },
        created() {
            this._getHotKey();
        },
        methods:{
            addQuery(query) {
                this.$refs.searchBox.setQuery(query);
            },
            onQueryChange(query) {
                this.query = query;
            },
            saveSearch(item) {
                this.saveSearchHistory(item);
            },
            clearHistory() {
                this.$refs.confirm.show();
                //this.clearSearchHistory();
            },
            handlePlayList(playlist) {
                let bottom = playlist.length > 0 ? "" : "60px";
                this.$refs.shortcut.style.bottom = bottom;
                this.$refs.suggest.style.bottom = bottom;
            },
            _getHotKey() {
                getHotKey().then((res) => {
                    this.hotKey = res.data.hotkey.slice(0, 10);
                })
            },
            ...mapActions([
                'saveSearchHistory',
                'deleteSearchHistory',
                'clearSearchHistory'
            ])
        },
        computed:{
            ...mapGetters([
                'searchHistory'
            ])
        },
        
    }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>