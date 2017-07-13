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

const {_F} = require( './util' );

function _parallel( arr, opts = {} ) {
  return new Promise( ( resolve, reject ) => {

    opts.limit = opts.limit === undefined ? arr.length : Number( opts.limit );
    if ( opts.limit === Number.NaN || opts.limit <= 0 ) {
      return reject( new Error( "limit must be a positive number or undefined" ) );
    }

    let iter = arr[Symbol.iterator]();
    let results = [];
    let completed = 0;
    let index = 0;

    const _next = ( value ) => (( idx ) =>
        _F( value )
            .then( ( value ) => ( {result : value} ) )
            .catch( ( err ) => ( {result : err, rejected : true} ) )
            .then( ( res ) => {
                  results[idx] = res.result;
                  completed++;
                  _test( res );
                }
            ))( index++ );

    function _test( res = {} ) {
      if ( res.rejected && opts.breakOnError ) {
        return reject( res.result );
      }

      if ( completed >= arr.length ) {
        return resolve( results );
      }

      let {value, done} = iter.next();
      if ( !done ) {
        _next( value )
      }
    }

    for ( let i = 0; i < opts.limit; i++ ) {
      _test()
    }
  } );
}

module.exports = _parallel;
