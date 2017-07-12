assert = require( 'assert' )
arrayp = require( '..' )
{literals, rejecting, promises} = require( './fixtures/iterables' )

describe 'series', ->
  it 'returns array of all results', ->
    arrayp.series( literals.concat( promises ) ).then ( res )->
      assert.deepEqual res, literals.concat( [ 1, 2, 3 ] )

  it 'stops on error', ( ) ->
    arrayp.series( rejecting )
      .then -> throw new Error "shouldn't get here"
      .catch ( x ) -> assert.equal x, 3

  it 'empty iterable', ( ) ->
    arrayp.series( [] ).then ( res ) ->
      assert.equal res.length, 0


