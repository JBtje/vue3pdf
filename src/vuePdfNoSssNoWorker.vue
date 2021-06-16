<style src="./annotationLayer.css"></style>
<script>

import componentFactory from './componentFactory.js';

var component;

if( process.env.VUE_ENV !== 'server' ) {
    var pdfjsWrapper = require( './pdfjsWrapper.js' ).default;
    var PDFJS        = require( 'pdfjs-dist-sig/es5/build/pdf.js' );
    component        = componentFactory( pdfjsWrapper( PDFJS ) );
}
else {
    component = componentFactory( {} );
}

export default component;
</script>