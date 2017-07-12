assert = require( 'assert' )
arrayp = require( '..' )

describe 'delay', ->

  it 'takes a literal/object', ->
    arrayp.delay 200, 1
      .then ( x ) -> assert.equal x, 1

  it 'takes a function', ->
    arrayp.delay 200, -> 1
      .then ( x ) -> assert.equal x, 1

  it 'takes a promise', ->
    arrayp.delay 200, Promise.resolve( 1 )
      .then ( x ) -> assert.equal x, 1


