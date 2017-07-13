assert = require( 'assert' )
arrayp = require( '..' )
AsyncTest = require( './fixtures/async' )
{rejecting} = require( './fixtures/iterables' )

describe 'run', ->
  tasks = null

  beforeEach ->
    tasks = new AsyncTest [ [ 200, 1 ], [ 100, 2 ], [ 500, 3 ], [ 250, 4 ], [ 400, 5 ], [ 50, 6 ] ]

  it "complains if limit is bad", ->
    arrayp.run( tasks, -1 ).catch ( err ) ->
      assert.isPrototypeOf err, Error
      null

  it "Runs at most 'n' promises in parallel", ->
    arrayp.run( tasks.items, 3 ).then ( res ) ->
      assert.deepEqual tasks.runOrder, [ 1, 2, 3, 4, 5, 6 ]
      assert.deepEqual tasks.doneOrder, [ 2, 1, 4, 6, 3, 5 ]
      assert.deepEqual res, [ 1, 2, 3, 4, 5, 6 ]

  it "Runs all in parallel if no limit specified", ->
    arrayp.run( tasks.items ).then ( res ) ->
      assert.deepEqual tasks.runOrder, [ 1, 2, 3, 4, 5, 6 ]
      assert.deepEqual tasks.doneOrder, [ 6, 2, 1, 4, 5, 3 ]
      assert.deepEqual res, [ 1, 2, 3, 4, 5, 6 ]

  it 'reports rejections with results', ( ) ->
    arrayp.run( rejecting ).then (res) ->
      assert.equal res.length, rejecting.length
      assert  res[2] instanceof Error

