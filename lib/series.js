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

/**
 *
 * @param arr - the iterable
 * @param opts {Object}
 *    * chain {Boolean} If true, pass value from previous item to next.
 *    * gather {Boolean} If true, return array of results.
 *    * breakOnFirst {Boolean} Stop loop after first successful promise and return the value.
 *    * breakOnError {Boolean} Stop on first error return reason.
 *    * breakOnLast {Boolean} Run until first error and return previous successful value.
 */
function series( arr, opts = {} ) {
  let iter = arr[Symbol.iterator]();

  const _test = ( res = {} ) => (( {value, done} ) =>
      done || res.break
          ? (res.error ? $Px( res.error ) : $Pr( res.result ))
          : $Pr( res.result ).then( _next.bind( null, value ) ))( iter.next() );

  const _next = ( o, prev ) => _F( o, opts.chain && prev ).then(
      ( value ) => ( {
        break : opts.breakOnFirst,
        result : opts.gather ? prev.concat( value ) : value
      }),
      ( error ) => opts.breakOnLast
          ? ( {result : prev, break : true} )
          : ( {error : error, break : opts.breakOnError} ) )
      .then( _test );

  return _test( opts.gather ? {result : []} : {result : opts.initial} )
}

module.exports = series;

