// Copyright 2017, Venkat Peri.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';
const util = require( 'util' );

function $R( x ) {
  return Promise.resolve( x );
}

function $X( x ) {
  return Promise.reject( x );
}

function _P( cb ) {
  return new Promise( cb );
}

function pfn( x ) {
  return typeof x === 'function' ? x : () => $R( x );
}

function _F( x, arg ) {
  return $R( typeof x === 'function' ? x( arg ) : x );
}

function _delay( p, delay ) {
  return delay ? new Promise( ( r, j ) => setTimeout( () => r( p ), delay ) ) : p;
}

function _doLoop( arr, opts = {} ) {
  let iter = arr[Symbol.iterator]();

  function _next( o, prev ) {
    return _F( o, opts.waterfall ? prev : undefined )
        .then(
            ( val ) =>
                ( {result : opts.gather ? prev.concat( val ) : val, break : opts.breakOnFirst}),
            ( err ) => opts.breakOnError
                ? $X( {error : err, break : true} )
                : $R( {error : err, break : false} ) )
        .then( _test );
  }

  function _test( res ) {
    let {value, done} = iter.next();
    let r = res ? res.result : undefined;

    if ( done || (res && res.break) ) {
      return res.error ? $X( res.error ) : $R( r )
    }

    return (opts.afterEach ? opts.afterEach( r ) : $R( r ))
        .then( ( x ) => _next( value, x ) );
  }

  return _test( opts.gather ? {result : []} : undefined )
}

function tryEach( arr ) {
  return _doLoop( arr, {breakOnFirst : true, breakOnError : false} );
}

module.exports = {
  delay : _delay,
  until : ( arr ) => _doLoop( arr ),
  tryEach : tryEach,
  waterfall : ( arr ) => _doLoop( arr, {waterfall : true} ),
  series : ( arr ) => _doLoop( arr, {gather : true} ),
  find : ( arr ) => arr.find( ( x ) => pfn( x ).then() )
};

// waterfall : ( arr ) => arr.reduce( ( r, n ) => r.then( pfn( n ) ), $R() ),
// series : ( arr ) => arr.reduce( ( r, n ) => r.then( ( arr ) => pfn( n ).then( arr.concat.bind( arr ) ) ), $R( [] ) ),
