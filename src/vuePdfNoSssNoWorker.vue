<style src="./annotationLayer.css"></style>
<script>

import componentFactory from './componentFactory';

var component;

if( process.env.VUE_ENV !== 'server' ) {
    var pdfjsWrapper = require( './pdfjsWrapper' ).default;
    var PDFJS        = require( 'pdfjs-dist' );
    component        = componentFactory( pdfjsWrapper( PDFJS ) );
}
else {
    component = componentFactory( {} );
}

export default component;
</script>