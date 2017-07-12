assert = require( 'assert' )
arrayp = require( '..' )
{$Px, $Pr} = require( '../lib/util' )

literals = [ 1, 2, 3, 4, 'test' ]

functions = [ (->  1), (( x ) -> $Pr( x + 1 )), ( ( x ) -> x * 2) ]

promises = [ $Pr( 1 ), $Pr( 2 ), $Pr( 3 ) ]

describe 'chain', ->
  describe 'operates on', ->

    it 'literals', ->
      arrayp.chain( literals ).then ( res )->
        assert.equal res, 'test'

    it 'functions', ->
      arrayp.chain( functions ).then ( res )->
        assert.equal res, 4

    it 'promises', ->
      arrayp.chain( promises ).then ( res )->
        assert.equal res, 3

    it 'mixed', ->
      arrayp.chain( literals.concat( functions ).concat( promises ) ).then ( res )->
        assert.equal res, 3

  it 'returns result of the last item', ->
    arrayp.chain( [ 1, 2, 3, 4 ] ).then ( res )->
      assert.equal res, 4

  it 'result of item is argument to next', ->
    arrayp.chain( functions ).then ( res )->
      assert.equal res, 4

  it 'stops on error', ( ) ->
    arrayp.chain( [ 1, 2, $Px( 3 ) ] )
      .then -> throw new Error "shouldn't get here"
      .catch ( x ) -> assert.equal x, 3

