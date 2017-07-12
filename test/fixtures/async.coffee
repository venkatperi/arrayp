{delay} = require '../..'

module.exports = class AsyncTest
  constructor : ( arr ) ->
    @runOrder = []
    @doneOrder = []

    @items = arr.map( ( x ) => @t( x[ 0 ], x[ 1 ] ) )

  t : ( time, x ) => =>
    @runOrder.push x
    delay time, =>
      @doneOrder.push x
      x


#  tasks = [ t( 200, 1 ), t( 100, 2 ), t( 500, 3 ), t( 250, 4 ), t( 400, 5 ), t( 50, 6 ) ]
