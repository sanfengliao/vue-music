<template>
    <div class="progress-bar" ref="progressBar" @click="progressClick">
        <div class="bar-inner">
            <div class="progress" ref="progress"></div>
            <div class="progress-btn-wrapper" ref="btn" 
                @touchstart.prevent="touchStart" 
                @touchmove.prevent="touchMove"
                @touchend.prevent="touchEnd"
            >
                <div class="progress-btn"></div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            percent: {
                type:Number,
                default:0
            }
        },
        created() {
            this.touch = {}
        },
        methods:{
            touchStart(e) {
                this.touch.initialed = true;
                this.touch.startX = e.touches[0].pageX;
                this.touch.left = this.$refs.progress.clientWidth;
            },
            touchMove(e) {
                if (this.touch.initialed) {
                    const deltaX = e.touches[0].pageX - this.touch.startX;
                    const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - 16, Math.max(0, this.touch.left + deltaX));
                    this.__offset(offsetWidth)
                }
            },
            touchEnd(e) {
                this.touch.initialed = false;
                this.__triggerPercent();
            },
            progressClick(e) {
                const rect = this.$refs.progressBar.getBoundingClientRect();
                const offsetWidth = e.pageX - rect.left;
                //this.__offset(e.offsetX);当点击btn的时候，e.offsetX不对
                this.__offset(offsetWidth);
                this.__triggerPercent(offsetWidth);
            },
            __offset(offsetWidth) {
                this.$refs.progress.style.width = offsetWidth + "px";
                this.$refs.btn.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
            },
            __triggerPercent() {
                  const barWidth = this.$refs.progressBar.clientWidth - 16;
                  const percent = this.$refs.progress.clientWidth / barWidth;
                  this.$emit("percentChange", percent)
            }
        },
        watch:{
            percent(newPercent) {
                if (newPercent >= 0 && !this.touch.initialed) {
                    const barWidth = this.$refs.progressBar.clientWidth - 16;
                    const offsetWidth = barWidth * newPercent;
                    this.__offset(offsetWidth);
                }
            }
        }
    }
</script>

<style lang="stylus" scoped>
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
