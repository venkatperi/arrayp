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

/**
 * `arrayp` provides functions for manipulating collections of JavaScript `Promise` objects.
 *  @module arrayp
 */
'use strict';

const parallel = require( './parallel' );
const series = require( './series' );
const {_delay} = require( './util' );

/**
 * The `chain` method evaluates each promise in the iterable in series and returns a
 * `Promise` that resolves with the value from the last item in the iterable, or rejects
 * with the reason from the first item in the iterable that rejects. The value from one
 * item in the iterable is passed as an argument to the next item. An optional `initial`
 * value to the `chain` method will be passed to the first promise of the iterable.
 *
 * @param iterable {Array|Iterable} - an iterable object, such as an `Array`.
 * @param initial {*} - an optional value passed to the first item.
 * @returns {Promise}
 * @alias module:arrayp
 */
function chain( iterable, initial ) {
  return series( arr, {initial : initial, chain : true, breakOnError : true} );
}

module.exports = {
  delay : _delay,
  chain : ( arr, initial ) => series( arr, {initial : initial, chain : true, breakOnError : true} ),
  series : ( arr ) => series( arr, {gather : true, breakOnError : true} ),
  parallel : ( arr, limit ) => parallel( arr, {limit : limit, breakOnError : true} ),
  run : ( arr, limit ) => parallel( arr, {limit : limit, breakOnError : false} ),
};

