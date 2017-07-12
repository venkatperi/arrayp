assert = require( 'assert' )
arrayp = require( '..' )

$X = ( x ) -> Promise.reject( x )

functions = [ (->  1), (( x ) -> x + 1), ( ( x ) -> x * 2) ]


describe 'first', ->
  it 'It runs each task in series but stops whenever any of the functions were successful', ->
    arrayp.first( [ $X( 1 ), $X( 2 ), 3 ] ).then ( res ) ->
      assert.equal res, 3

  it 'example', ->
    arrayp.first( [
      Promise.reject( 'not this' ),
      -> throw new Error( 'not this either' ),
      1
      "shouldn't get here"
    ] ).then ( res ) ->
      assert.equal res, 1

  it "returns the last promise's error if none are successful", ->
    arrayp.first( [ $X( 1 ), $X( 2 ), $X 3 ] ).catch ( res ) ->
      assert.equal res, 3

