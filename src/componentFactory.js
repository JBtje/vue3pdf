import resizeSensor from 'vue3-resize-sensor';
import {h}          from 'vue';

export default function( pdfjsWrapper ) {
    var createLoadingTask = pdfjsWrapper.createLoadingTask;
    var PDFJSWrapper      = pdfjsWrapper.PDFJSWrapper;

    return {
        createLoadingTask: createLoadingTask,

        render() {
            return h( 'span', {
                style: 'position: relative; display: block',
            }, [
                h( 'canvas', {
                    style: 'display: inline-block; width: 100%; height: 100%; vertical-align: top',
                    ref:   'canvas',
                } ),
                h( 'span', {
                    style: 'display: inline-block; width: 100%; height: 100%',
                    class: 'annotationLayer',
                    ref:   'annotationLayer',
                } ),
                h( resizeSensor, {
                    props: {
                        initial: true,
                    },
                    on:    {
                        resize: this.resize,
                    },
                } ),
            ] );
        },

        props: {
            src:    {
                type:    [String, Object, Uint8Array],
                default: '',
            },
            page:   {
                type:    Number,
                default: 1,
            },
            rotate: {
                type: Number,
            },
        },

        emits: [
            'password',
            'progress',
            'numPages',
            'loaded',
            'error',
            'pageLoaded',
            'pageSize',
            'linkClicked',
        ],

        watch: {
            src:    function() {
                this.pdf.loadDocument( this.src );
            },
            page:   function() {
                this.pdf.loadPage( this.page, this.rotate );
            },
            rotate: function() {
                this.pdf.renderPage( this.rotate );
            },
        },

        methods: {
            resize: function( size ) {

                // check if the element is attached to the dom tree || resizeSensor being destroyed
                if( this.$el.parentNode === null || (size.width === 0 && size.height === 0) ) {
                    return;
                }

                // on IE10- canvas height must be set
                this.$refs.canvas.style.height = this.$refs.canvas.offsetWidth * (this.$refs.canvas.height / this.$refs.canvas.width) + 'px';
                // update the page when the resolution is too poor
                var resolutionScale            = this.pdf.getResolutionScale();

                if( resolutionScale < 0.85 || resolutionScale > 1.15 ) {
                    this.pdf.renderPage( this.rotate );
                }
            },
            print:  function( dpi, pageList ) {
                this.pdf.printPage( dpi, pageList );
            },
        },

        // doc: mounted hook is not called during server-side rendering.
        mounted() {
            this.pdf = new PDFJSWrapper( this.$refs.canvas, this.$refs.annotationLayer, this.$emit, this.page, this.rotate );
            this.pdf.loadDocument( this.src );
        },

        // doc: destroyed hook is not called during server-side rendering.
        unmounted() {
            this.pdf.destroy();
        },
    };
}
