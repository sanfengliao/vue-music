<template>
    <transition name="slide">
        <div class="singer-detail">
            <music-list :songs="songs" :bg-image="bgImage" :title="title"></music-list>
        </div>
    </transition>
</template>

<script>
    import {mapGetters} from "vuex";

    import MusicList from "../music-list/music-list.vue"
    import {getSingerDetail} from "src/api/singer.js";
    import {ERR_OK} from "src/api/config.js";
    import {createSong} from "src/common/js/song.js"
    export default {
        data() {
            return {
                songs:[]
            }
        },
        components: {
            MusicList
        },
        created() {
            this._getSingerDetails();
        },
        computed:{
            title() {
                return this.singer.name;
            },
            bgImage() {
                return this.singer.avatar
            },
            ...mapGetters({
                singer:'singer',
                songKey: 'songKey',
                prefix: 'prefix',
                subfix: 'subfix'
            })
        },
        methods: {
            _getSingerDetails() {
                if (!this.singer.id) {
                    this.$router.push({
                        path:"/singer",
                    });
                    return;
                }
                getSingerDetail(this.singer.id).then((res) => {
                    if (res.code == ERR_OK) {
                        this.songs = this._normalizeData(res.data.list);
                    }
                })
            },
            _normalizeData(list) {
                let ret = [];
                list.forEach((item) => {
                    let musicData = item.musicData;
                    if (musicData.songid && musicData.albummid) {
                        ret.push(createSong(musicData, this.songKey, this.prefix, this.subfix))
                    }
                });
                return ret;
            }
        }
    }
</script>

<style lang="stylus" scoped>
    .slide-enter-active, .slide-leave-active
        transition: all 0.5s

    .slide-enter, .slide-leave-to
        transform: translate3d(100%, 0, 0)

</style>
