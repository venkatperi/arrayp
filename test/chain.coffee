assert = require( 'assert' )
arrayp = require( '..' )
{$Px, $Pr} = require( '../lib/util' )
{rejecting, literals, functions, promises} = require( './fixtures/iterables' )

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
    arrayp.chain( literals ).then ( res )->
      assert.equal res, 'test'

  it 'result of item is argument to next', ->
    arrayp.chain( [101, ((x) -> x * 2)] ).then ( res )->
      assert.equal res, 202

  it 'stops on error', ( ) ->
    arrayp.chain( rejecting )
      .then -> throw new Error "shouldn't get here"
      .catch ( x ) -> assert.equal x, 3

  it 'initial value', ->
    arrayp.chain( functions[ 1.. ], 10 ).then ( res )->
      assert.equal res, 22

  it 'empty iterable', ( ) ->
    arrayp.chain( [] ).then ( res ) ->
      assert.equal res, undefined

