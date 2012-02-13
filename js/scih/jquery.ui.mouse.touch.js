/*
 * Content-Type:text/javascript
 * 
 * A bridge between touch events and jquery draggable, 
 * sortable etc. mouse interactions.
 *
 * @author Oleg Slobodskoi @oleg008 https://github.com/kof/labs 
 * @author John Hardy @jhlagado https://github.com/jhlagado/Mouse.Touch
 * 
 * Modifications by John Hardy (@jhlagado) 
 * 
 * Copyright 2010, Oleg Slobodskoi 
 * Copyright 2011, John Hardy, Lagado, lagado.com
 * 
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * 
 * http://jquery.org/license
 * 
 */

(function( $ ) {
    
    $.support.touch = typeof Touch === 'object';

    if (!$.support.touch) {
        return;
    }

    var proto =  $.ui.mouse.prototype,
    _mouseInit = proto._mouseInit;
    
    $.extend( proto, {
        _mouseInit: function() {
            this.element
            .bind( "touchstart." + this.widgetName, $.proxy( this, "_touchStart" ) );
            _mouseInit.apply( this, arguments );
        },
        
        _touchStart: function( event ) {
            if ( typeof event.originalEvent !== 'undefined' && event.originalEvent.touches.length != 1 ) {
                return false;
            }
    
            this.element
            .bind( "touchmove." + this.widgetName, $.proxy( this, "_touchMove" ) )
            .bind( "touchend." + this.widgetName, $.proxy( this, "_touchEnd" ) );

            this._modifyEvent( event );

            $( document ).trigger($.Event("mouseup")); //reset mouseHandled flag in ui.mouse
            this._mouseDown( event );
        },
        
        _touchMove: function( event ) {
            this._modifyEvent( event );
            this._mouseMove( event );   
        },
        
        _touchEnd: function( event ) {
            this.element
            .unbind( "touchmove." + this.widgetName )
            .unbind( "touchend." + this.widgetName );
            this._mouseUp( event ); 
        },
        
        _modifyEvent: function( event ) {
            event.which = 1;
            if( typeof event.originalEvent !== 'undefined' ){
                var target = event.originalEvent.targetTouches[0];
                event.pageX = target.clientX;
                event.pageY = target.clientY;
            }
        }
        
    });

})( jQuery );
