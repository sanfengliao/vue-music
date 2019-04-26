<template>
    <div class="singer" ref="singer">
        <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
        <router-view></router-view>
    </div>
</template>

<script>
    import {mapMutations}  from "vuex";
    import ListView from "src/base/listview/listview.vue";
    import {getSingerList} from "src/api/singer.js"
    import {ERR_OK} from "src/api/config.js"
    import Singer from "common/js/singer.js"
    import {playListMixin} from "../../common/js/mixins.js"
    const HOT_NAME_LEN = 10
    const HOT_NAME = "热门"
    export default {
        mixins:[playListMixin],
        data() {
            return {
                singers:[]
            }
        },
        components:{
            ListView
        },
        created(){
            this._getSingerList();
        },
        methods:{
            handlePlayList(playlist) {
                const bottom = playlist.length > 0 ? "60px":"0"
                this.$refs.singer.style.bottom = bottom;
                this.$nextTick(() => {
                  this.$refs.list.refresh();
                })
            },
            _getSingerList() {
                getSingerList().then((res) => {
                    if (res.code == ERR_OK ) {
                        this.singers = this._normalizeData(res.data.list);
                    }
                })
            },
            _normalizeData(list) {
                let map = {
                    hot:{
                        title:HOT_NAME,
                        items:[]
                    }
                }
                list.forEach((item, index) => {
                    if (index < HOT_NAME_LEN) {
                        map.hot.items.push(new Singer(item.Fsinger_mid, item.Fsinger_name))
                    }
                    let key = item.Findex;
                    if (!map[key]) {
                        map[key] = {
                            title:key,
                            items:[]
                        }
                    }
                    map[key].items.push(new Singer(item.Fsinger_mid, item.Fsinger_name));
                });
                let hot = [];
                let ret = [];
                for (let key in map) {
                    var val = map[key];
                    if (val.title == HOT_NAME){
                        hot.push(val);
                    }
                    else if (val.title.match(/[a-zA-Z]/)) {
                        ret.push(val);
                    }
                }
                ret.sort((a, b) => {
                    return a.title.charCodeAt(0) - b.title.charCodeAt(0);
                });
                return hot.concat(ret);
            },
            selectSinger(singer) {
                //console.log(item);
                this.$router.push({
                    path:`/singer/${singer.id}`
                }),
                this.setSinger(singer);
            },
            ...mapMutations({
                setSinger: "SET_SINGER"
            })
        }
    }
</script>

<style lang="stylus" scoped>
     .singer
        position: fixed
        top: 88px
        bottom: 0
        width: 100%
</style>
