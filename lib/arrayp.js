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

function $Pr( x ) {
  return Promise.resolve( x );
}

function $Px( x ) {
  return Promise.reject( x );
}

function _F( x, arg ) {
  return $Pr( typeof x === 'function' ? x( arg ) : x );
}

function _delay( delay, p ) {
  return new Promise( ( r, j ) => setTimeout( () => r( _F( p ) ), delay ) )
}

function _doLoop( arr, opts = {} ) {
  let iter = arr[Symbol.iterator]();

  function _next( o, prev ) {
    return _F( o, opts.waterfall && prev )
        .then(
            ( v ) => ( {result : opts.gather ? prev.concat( v ) : v, break : opts.breakOnFirst}),
            ( e ) => (opts.breakOnError ? $Px : $Pr)( {error : e, break : opts.breakOnError} ) )
        .then( _test );
  }

  function _test( res = {} ) {
    let {value, done} = iter.next();

    return done || res.break
        ? (res.error ? $Px( res.error ) : $Pr( res.result ))
        : (opts.join ? _F( opts.join, res.result ) : $Pr( res.result ))
               .then( _next.bind( null, value ) );
  }

  return _test( opts.gather && {result : []} )
}

function _parallel( arr, limit ) {
  return new Promise( ( resolve, reject ) => {

    limit = limit === undefined ? arr.length : Number( limit );
    if ( limit === Number.NaN || limit <= 0 ) {
      return reject( new Error( "limit must be a positive number or undefined" ) );
    }

    let iter = arr[Symbol.iterator]();
    let promises = [];
    let resolved = false;

    for ( let i = 0; i < limit; i++ ) {
      _next()
    }

    function _next( prev ) {
      let {value, done} = iter.next();

      if ( !done ) {
        promises.push( _F( value ).then( _next ) );
      } else if ( done && !resolved ) {
        resolve( Promise.all( promises ) );
        resolved = true;
      }

      return prev;
    }
  } );
}

module.exports = {
  delay : _delay,
  tryEach : ( arr ) => _doLoop( arr, {breakOnFirst : true, breakOnError : false} ),
  waterfall : ( arr, join ) => _doLoop( arr, {waterfall : true, join : join} ),
  series : ( arr, join ) => _doLoop( arr, {gather : true, join} ),
  parallel : _parallel,
  $Pr : $Pr,
  $Px : $Px
};

// waterfall : ( arr ) => arr.reduce( ( r, n ) => r.then( pfn( n ) ), $R() ),
// series : ( arr ) => arr.reduce( ( r, n ) => r.then( ( arr ) => pfn( n ).then( arr.concat.bind( arr ) ) ), $R( [] ) ),
