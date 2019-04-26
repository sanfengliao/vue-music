<template>
    <div class="slider" ref="slider">
        <div class="slider-group" ref="sliderGroup">
            <slot>
            </slot>
        </div>
        <div class="dots">
            <span class="dot" v-for="(item, index) in dots" :key="index" :class="{active:currentPage === index}"></span>
        </div>
    </div>
</template>

<script>
     import {addClassName} from "common/js/dom.js";
     import BScroll from "better-scroll";
    export default {
        data() {
            return {
                dots:[],
                currentPage:0
            }
        },
        props:{
            loop:{
                type:Boolean,
                default:true
            },
            autoPlay: {
                type: Boolean,
                default:true,
            },
            interval: {
                type:Number,
                default: 4000
            }
        },
        mounted() {
            setTimeout(() => {
                this._initSliderWidth();
                this._initDots();
                this._initBetterScroll();
                if (this.autoPlay){
                    this._autoPlay();
                }
             
                
            }, 20);
            window.addEventListener("resize", () => {
                if (!this.slider) {
                    return;
                }
                this._initSliderWidth(true);
                this.slider.refresh();
            });
        },
        methods: {
            _initSliderWidth(reSize) {
                this.children = this.$refs.sliderGroup.children;
                let silderWidth = this.$refs.slider.clientWidth;
                let width = 0;
                for (let i = 0; i < this.children.length; ++i) {
                    let child = this.children[i];
                    addClassName(child, "slider-item");
                    child.style.width = silderWidth + "px";
                    width += silderWidth;
                }
                if (this.loop && !reSize) {
                    width += 2 * silderWidth;
                }
                this.$refs.sliderGroup.style.width = width + "px";
            },
            _initBetterScroll() {
                this.slider = new BScroll(this.$refs.slider, {
                    scrollX: true,
                    scrollY: false,
                    momentum: false,
                    snap: {
                        loop: this.loop,
                        speed: 400,
                        threshold: 0.3
                    }
                }); 
                 this.slider.on("scrollEnd", () => {
                     let pageIndex = this.slider.getCurrentPage().pageX;
                     this.currentPage = pageIndex;
                 })
            },
            _initDots() {
                this.dots = new Array(this.children.length);
            },
            _autoPlay() {
                this.timer = setInterval(() => {
                    this.slider.next(400);
                }, this.interval);
            }
        },
        destroyed() {
            clearInterval(this.timer);
        }
    }
</script>

<style lang="stylus" scoped>
    @import "~common/stylus/variable"
    .slider
        min-height: 1px
        .slider-group
            position: relative
            overflow: hidden
            white-space: nowrap
            .slider-item
                float: left
                box-sizing: border-box
                overflow: hidden
                text-align: center
                a
                    display: block
                    width: 100%
                    overflow: hidden
                    text-decoration: none
                img
                    display: block
                    width: 100%
        .dots
            position: absolute
            right: 0
            left: 0
            bottom: 12px
            text-align: center
            font-size: 0
            .dot
                display: inline-block
                margin: 0 4px
                width: 8px
                height: 8px
                border-radius: 50%
                background: $color-text-l
                &.active
                    width: 20px
                    border-radius: 5px
                    background: $color-text-ll
</style>
