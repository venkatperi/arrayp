assert = require( 'assert' )
arrayp = require( '..' )
{$Px, $Pr} = require( '../lib/util' )

ok = -> throw new Error( "should execute this" )
notOk = -> throw new Error( "shouldn't execute this" )

describe 'first', ->
  it 'stops at first successful item', ->
    arrayp.first( [ $Px( 1 ), $Px( 2 ), ok, 3, notOk ] ).then ( res ) ->
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
    arrayp.first( [ $Px( 1 ), $Px( 2 ), $Px 3 ] ).catch ( res ) ->
      assert.equal res, 3

