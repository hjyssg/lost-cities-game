var target = require('./game_engine.js')

 console.log(target)

function test_calculate_point()
{
  var cards =  [[ 'yellow', 'double' ],
  [ 'yellow', 2 ],
  [ 'yellow', 3 ],
  [ 'yellow', 4 ],
  [ 'yellow', 5 ],
  [ 'yellow', 6 ],
  [ 'yellow', 7 ],
  [ 'yellow', 8 ],
  [ 'yellow', 9 ],
  [ 'yellow', 10 ]]
  var point = target.calculate_point()
  console.log(point)
}

// test_calculate_point()