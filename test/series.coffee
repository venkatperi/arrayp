assert = require( 'assert' )
arrayp = require( '..' )

nonFunctions = [ 1, 2, 3, 4, 5 ]

describe 'series', ->
  it 'returns array of all results', ->
    arrayp.series( nonFunctions ).then ( res )->
      assert.deepEqual res, nonFunctions

