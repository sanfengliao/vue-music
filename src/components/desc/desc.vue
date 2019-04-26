<template>
    <transition name="slide">
        <music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
    </transition>
</template>

<script>
    import MusicList from "../music-list/music-list.vue";
    import { mapGetters } from 'vuex';
    import { getDesc } from '../../api/getRecomend';
    import {Song, filterSinger} from "../../common/js/song.js"
    export default {
        components:{
            MusicList,
        },
        data() {
            return {
                songs:[],
                title:"",
                bgImage:""
            }
        },
        created() {
            
           this._getDesc();
        },
        methods: {
            _getDesc() {
                if(!this.desc.id) {
                    this.$router.push({
                        path:"/recommend"
                    })
                    return;
                }
                getDesc(this.desc.id).then((res) => {
                    this.bgImage = res.cdlist[0].logo;
                    this.title = res.cdlist[0].dissname;
                    this.songs = this._normalLizeSong(res.cdlist[0].songlist)
                })
            },
            _normalLizeSong(list) {
                let ret = []
                list.forEach(item => {
                    let song = new Song({id:item.id, mid:item.file.media_mid, singer:filterSinger(item.singer), name: item.name, album: item.album.name, duration: '', image: '', url:`http://dl.stream.qqmusic.qq.com/C400${item.file.media_mid}.m4a?guid=1054800388&vkey=2FCE405ADA6E3C5AEB3A5208E4E30F356538BC9C741524158F1DE2F986A17FB57844002ADE98A153E774AF2F40B9CCD9AEDD052A4500D9A9&uin=0&fromtag=38`})
                    ret.push(song)
                });
                return ret;
            }
        },
        computed:{
            ...mapGetters(['desc'])
        }
    }
</script>

<style scoped lang="stylus">
    .slide-enter-active, .slide-leave-active
        transition: all 0.3s

    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)
</style>