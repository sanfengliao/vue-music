<template>
    <div ref="wrapper" @scroll="scroll">
        <slot></slot>
    </div>
</template>

<script>
    import BSCroll from "better-scroll";
    export default {
        props:{
            // 是否派发scroll实现, 取值为0/1/2/3
            probeType: {
                type: Number,
                default: 1
            },
            click: {
                type: Boolean,
                default: true
            },
            data: {
                type:Array,
                default:null
            },
            listenScroll: {
                type:Boolean,
                default:false
            },
            pullup: {
                type:Boolean,
                default:false
            }
        },
        mounted() {
            this._initBSCroll();
        },
        methods:{
            _initBSCroll() {
                this.BSCroll = new BSCroll(this.$refs.wrapper, {
                    probeType:this.probeType,
                    click:this.click
                });
                if (this.listenScroll) {
                    this.BSCroll.on("scroll", (pos) => {
                        this.$emit("scroll", pos);
                    });
                };
                if(this.pullup) {
                    this.BSCroll.on("scrollEnd", () => {
                        //if (this.BScroll.y <= this.BScroll.maxScrollY + 50) {
                            this.$emit("scrollToEnd");
                        //}
                    })
                }
            },
            refresh() {
                this.BSCroll && this.BSCroll.refresh();
            },
            enable() {
                this.BSCroll && this.BSCroll.enable();
            },
            disable() {
                this.BSCroll && this.BSCroll.disable();
            },
            scrollTo() {
                this.BSCroll && this.BSCroll.scrollTo.apply(this.BSCroll, arguments);
            },
            scrollToElement() {
                this.BSCroll && this.BSCroll.scrollToElement.apply(this.BSCroll, arguments);
            },
            scroll() {

            }
        },
        watch: {
            data(){
                this.BSCroll.refresh();
                setTimeout(() => {
                    this.refresh();
                }, 200);
            }
        }
    }
</script>

<style scoped>

</style>
