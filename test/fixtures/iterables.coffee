{$Px, $Pr} = require( '../../lib/util' )

module.exports =
  literals : [ 1, 2, 3, 4, 'test' ]
  functions : [ (->  1), (( x ) -> $Pr( x + 1 )), ( ( x ) -> x * 2) ]
  promises : [ $Pr( 1 ), $Pr( 2 ), $Pr( 3 ) ]
  rejecting : [ 1, 2, (-> $Px( 3 )), 7 ]
