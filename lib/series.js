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

const {$Px, $Pr, _F} = require( './util' );

function _doLoop( arr, opts = {} ) {
  let iter = arr[Symbol.iterator]();

  function _next( o, prev ) {
    return _F( o, opts.chain && prev )
        .then(
            ( v ) => ( {result : opts.gather ? prev.concat( v ) : v, break : opts.breakOnFirst}),
            ( e ) => opts.breakOnLast ? $Pr( prev )
                : ( (opts.breakOnError ? $Px : $Pr)(
                    {error : e, break : opts.breakOnError} )) )
        .then( _test );
  }

  function _test( res = {} ) {
    let {value, done} = iter.next();

    return done || res.break
        ? (res.error ? $Px( res.error ) : $Pr( res.result ))
        : $Pr( res.result ).then( _next.bind( null, value ) );
  }

  return _test( opts.gather && {result : []} )
}

module.exports = _doLoop;

