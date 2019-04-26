<template>
    <transition name="slide">
        <music-list :title="title" :bg-image="bgImage" :songs="songs" :rank="rank"></music-list>
    </transition>
</template>

<script>
    import MusicList from "../music-list/music-list.vue"
    import {mapGetters} from "vuex"
    import {getMusicList} from "../../api/rank.js"
    import {ERR_OK} from "../../api/config.js"
    import {createSong} from "../../common/js/song.js"
    export default {
        created() {
            this._getMusicList();
        },
        data() {
            return {
                songs:[],
                rank:true
            }
        },
        components:{
            MusicList,
        },
        computed:{
            title() {
                return this.topList.topTitle;
            },
            bgImage() {
                return this.topList.picUrl;
            },
            ...mapGetters([
                'topList',
                'songKey',
                'prefix',
                'subfix'
            ])
        },
        methods:{
            _getMusicList() {
                if (!this.topList.id) {
                    this.$router.push("/rank")
                    return;
                }
                getMusicList(this.topList.id).then((res) => {
                    this.songs = this._normalize(res.songlist)
                })
            },
            _normalize(list) {
                let ret = []
                list.forEach(item => {
                    const musicData = item.data;
                    if(musicData.songid && musicData.albumid) {
                        ret.push(createSong(musicData, this.songKey, this.prefix, this.subfix));
                    }
                });
                return ret;
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s ease

    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>
