assert = require( 'assert' )
arrayp = require( '../lib/arrayp' )
_ = require( 'lodash' )

$X = ( x ) -> Promise.reject( x )
$R = ( x ) -> Promise.resolve( x )

nonFunctions = [ 1, 2, 3, 4, 5 ]

functions = [ (->  1), (( x ) -> x + 1), ( ( x ) -> x * 2) ]

fnReturningP = [ (->  Promise.resolve( 1 )), (( x ) -> x + 1), ( ( x ) -> x * 2), (( x ) -> arrayp.delay( 100, x )) ]

$T = ( d, f ) ->
  setTimeout f, d


describe 'arrayp', ->

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


  describe 'series', ->
    it 'returns array of all results', ->
      arrayp.series( nonFunctions ).then ( res )->
        assert.deepEqual res, nonFunctions

  describe 'waterfall', ->

    it 'returns last promise (non promises)', ->
      arrayp.waterfall( nonFunctions ).then ( res )->
        assert.equal res, 5

    it 'returns last promise (functions)', ->
      arrayp.waterfall( functions ).then ( res )->
        assert.equal res, 4

    it 'returns last promise (functions returning promises)', ->
      arrayp.waterfall( fnReturningP ).then ( res )->
        assert.equal res, 4

    it 'stops on error', ( ) ->
      arrayp.waterfall( [ 1, 2, Promise.reject( 3 ) ] )
        .then -> throw new Error "shouldn't get here"
        .catch ( x ) -> assert.equal x, 3

    it 'runs promise in between each', ->
      arrayp.waterfall( functions, ( x ) -> x * 3 ).then ( res )->
        assert.equal res, 24

  describe 'tryEach', ->

    it 'It runs each task in series but stops whenever any of the functions were successful', ->
      arrayp.tryEach( [ $X( 1 ), $X( 2 ), 3 ] ).then ( res ) ->
        assert.equal res, 3

    it "returns the last promise's error if none are successful", ->
      arrayp.tryEach( [ $X( 1 ), $X( 2 ), $X 3 ] ).catch ( res ) ->
        assert.equal res, 3

  describe 'parallel, limit', ->
    runOrder = []
    doneOrder = []
    t = ( time, x ) -> ->
      runOrder.push x
      arrayp.delay time, ->
        doneOrder.push x
        x
    tasks = [ t( 200, 1 ), t( 100, 2 ), t( 500, 3 ), t( 250, 4 ), t( 400, 5 ), t( 50, 6 ) ]

    beforeEach ->
      runOrder = []
      doneOrder = []

    it "complains if limit is bad", ->
      arrayp.parallel( tasks, -1 ).catch ( err ) ->
        assert.isPrototypeOf err, Error
        null

    it "Runs at most 'n' promises in parallel", ->
      arrayp.parallel( tasks, 3 ).then ( res ) ->
        assert.deepEqual runOrder, [ 1, 2, 3, 4, 5, 6 ]
        assert.deepEqual doneOrder, [ 2, 1, 4, 6, 3, 5 ]
        assert.deepEqual res, [ 1, 2, 3, 4, 5, 6 ]

    it "Runs all in parallel if no limit specified", ->
      arrayp.parallel( tasks ).then ( res ) ->
        assert.deepEqual runOrder, [ 1, 2, 3, 4, 5, 6 ]
        assert.deepEqual doneOrder, [ 6, 2, 1, 4, 5, 3 ]
        assert.deepEqual res, [ 1, 2, 3, 4, 5, 6 ]

