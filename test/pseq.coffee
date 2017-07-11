assert = require( 'assert' )
arrayp = require( '../lib/arrayp' )
_ = require( 'lodash' )

$X = ( x ) -> Promise.reject( x )
$R = ( x ) -> Promise.resolve( x )

nonFunctions = [ 1, 2, 3, 4, 5 ]

functions = [ (->  1), (( x ) -> x + 1), ( ( x ) -> x * 2) ]

fnReturningP = [ (->  Promise.resolve( 1 )), (( x ) -> x + 1), ( ( x ) -> x * 2), (( x ) -> arrayp.delay( x, 100 )) ]

describe 'arrayp', ->

  describe 'series', ->

    it 'returns array of all results', ->
      arrayp.series( nonFunctions ).then ( res )->
        assert.deepEqual res , nonFunctions

  describe 'waterfall', ->

    it 'returns last promise (non promises)', ->
      arrayp.waterfall( nonFunctions ).then ( res )->
        assert res is 5

    it 'returns last promise (functions)', ->
      arrayp.waterfall( functions ).then ( res )->
        assert res is 4

    it 'returns last promise (functions returning promises)', ->
      arrayp.waterfall( fnReturningP ).then ( res )->
        assert res is 4

    it 'stops on error', ( ) ->
      arrayp.waterfall( [ 1, 2, Promise.reject( 3 ) ] )
        .then -> throw new Error "shouldn't get here"
        .catch ( x ) -> assert x is 3

  describe 'tryEach', ->

    it 'It runs each task in series but stops whenever any of the functions were successful', ->
      arrayp.tryEach( [ $X( 1 ), $X( 2 ), 3 ] ).then ( res ) ->
        assert res is 3

    it "returns the last promise's error if none are successful", ->
      arrayp.tryEach( [ $X( 1 ), $X( 2 ), $X 3 ] ).catch ( res ) ->
        assert res is 3

