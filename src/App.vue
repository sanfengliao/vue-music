<template>
  <div id="app">
      <m-header></m-header>
      <tab></tab>
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
      <player></player>
  </div>
</template>

<script>
import {getMusicInfo} from './api/getMusicInfo.js'
import MHeader from './components/m-header/m-header.vue';
import Tab from "./components/tab/tab.vue";
import player from "./components/player/player.vue"
export default {
  components:{
    MHeader,
    Tab,
    player
  },
  created() {
    getMusicInfo().then((data) => {
      let musicData = {key: data.k, prefix: data.fix[0], subfix: data.fix[1]}
      this.$store.dispatch('setMusicInfo', musicData)
    })
  }
}
</script>

<style>
</style>
