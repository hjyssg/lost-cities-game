// Dictionary.prototype.get_most_frq_color = function(color_frqs)
//     {
//      var most_often_color, max_frq;
//      for(var color in color_frqs)
//      {
//       if (!most_often_color && !max_frq)
//       {
//         most_often_color = color
//         max_frq = color_frqs[color]
//       }
//       else if(color_frqs[color] > max_frq)
//       {
//         most_often_color = color
//         max_frq = color_frqs[color]
//       }
//     }
//     return most_often_color;
//   }


function foo()
{
  return 1, 2
}

var a, b = foo()
console.log(a,b)