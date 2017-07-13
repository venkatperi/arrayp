assert = require( 'assert' )
arrayp = require( '..' )
{literals, rejecting, promises} = require( './fixtures/iterables' )
AsyncTest = require( './fixtures/async' )

describe 'series', ->

  it 'runs tasks in series', ->
    tasks = new AsyncTest [ [ 200, 1 ], [ 100, 2 ], [ 500, 3 ], [ 250, 4 ], [ 400, 5 ], [ 50, 6 ] ]
    arrayp.series( tasks.items ).then ( res )->
      assert.deepEqual tasks.runOrder, [ 1, 2, 3, 4, 5, 6 ]
      assert.deepEqual tasks.doneOrder, [ 1, 2, 3, 4, 5, 6 ]
      assert.deepEqual res, [ 1, 2, 3, 4, 5, 6 ]

  it 'returns array of all results', ->
    arrayp.series( literals.concat( promises ) ).then ( res )->
      assert.deepEqual res, literals.concat( [ 1, 2, 3 ] )

  it 'stops on error', ( ) ->
    arrayp.series( rejecting )
      .then -> throw new Error "shouldn't get here"
      .catch ( x ) -> assert x instanceof Error

  it 'empty iterable', ( ) ->
    arrayp.series( [] ).then ( res ) ->
      assert.equal res.length, 0


