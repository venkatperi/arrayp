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

function $P( cb ) {
  return new Promise( cb );
}

function $Pr( x ) {
  return Promise.resolve( x );
}

function $Px( x ) {
  return Promise.reject( x );
}

function _F( x, ...args ) {
  return x instanceof Promise ? x
      : typeof x === 'function'
             ? $P( ( r ) => r( x.apply( null, args ) ) )
             : $Pr( x );
}

function _delay( delay, p ) {
  return $P( ( r, j ) => setTimeout( () => r( _F( p ) ), delay ) )
}

module.exports = {
  $P : $P,
  $Pr : $Pr,
  $Px : $Px,
  _F : _F,
  _delay : _delay
};
