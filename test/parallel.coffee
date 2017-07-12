assert = require( 'assert' )
arrayp = require( '..' )

describe 'parallel', ->
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

