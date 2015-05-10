'use strict'


//Some help functions below
function log(arg){
  console.log(arg);
}

function randInt(a,b)
{
  assert(b>a, "random wrong")
  return Math.floor(Math.random()*(b -a+1)+a) 
}

function ss(cards){ 
  var str = "";
  for(var ii =0; ii < cards.length; ii++){
    var card = cards[ii];
    if (ii != cards.length -1){
    str += card.value+", "
    }else{
      str += card.value
    }
  }
  return str;
}

function ss2(cards){ 
  var str = "";
  for(var ii =0; ii < cards.length; ii++){
    var card = cards[ii];
    if (ii != cards.length -1){
    str += "["+card.toString() +"], "
    }else{
      str += "["+card.toString()+"]"
    }
  }
  return str;
}

Array.prototype.shuffle = function(arr){
  function internal_shuffler()   {
    return Math.random()-0.5; //random between -0.5 and 0.5
  }
  this.sort(internal_shuffler);
}

Array.prototype.isEmpty = function()
{
  return this.length == 0
}

Array.prototype.last = function()
{
  assert(this.length > 0, "last failed")
  return this[this.length-1]
}

function get_key_with_max_value(dict)
{
var maxKey, maxValue;
 for(var key in dict)
 {
        if (!maxKey && !maxValue)
        {
          maxKey = key
          maxValue = dict[key]
        }
        else if(dict[key] > maxValue)
        {
          maxKey = key
          maxValue = dict[key]
        }
}
return maxKey;
}

function card_table_grouped_by_color(player_cards)
{
var color_table = {}
for(var ii = 0; ii < player_cards.length; ii++){
  var card = player_cards[ii]
  if(!color_table[card.color]){ color_table[card.color] =[];}
  color_table[card.color].push(card);
}
return color_table;
}

function assert(condition, message) {
  if (!condition) {
    throw message || "Assertion failed";
  }
}

//GLOBAL VARIBLES
var __COLORS__ = ["red", "yellow", "blue", "green", "white"]
var __VALUE_NUM__ = 10

function Card(color, value){
  this.color = color;
  this.value = value;

  Card.prototype.toString = function(){
    return this.color+" "+this.value;
  }

  this.cmpr = function(card2)
  {
   assert(this.color == card2.color)
   var cv1 = this.value == "double"?1:this.value
   var cv2 = card2.value == "double"?1:card2.value
   return cv1 - cv2
 }
}

//AI below
function idiot_ai(self_id)
{
  this.id = self_id

  // command = [player_id,"put", card];
  // command = [player_id,"give_up", card]s
  // command = [player_id,"pick", "from_which_color"]
  this.get_next_command =  function (player_cards, public_cards, desk,op_id)
  {
      //他妈的白痴，随便挑一张牌，扔了就是
      var index = randInt(0, player_cards.length-1);
      var cmd = [this.id, "give_up", player_cards[index]]
      return cmd
    }
}


function hjy_ai(self_id)
{
  this.id = self_id
  this.card_to_put = []

  this.get_color_freq = function(player_cards){
    var color_frqs = {}
    for(var ii = 0; ii < player_cards.length; ii++){
      var card = player_cards[ii]
      if(!color_frqs[card.color]){color_frqs[card.color] =0;}
      color_frqs[card.color] +=1;
    }
    return color_frqs
  } 


function get_cards_by_color(player_cards, color)
{
  var color_frqs = {}
  for(var ii = 0; ii < player_cards.length; ii++){
    var card = player_cards[ii]
    if(!color_frqs[card.color]){color_frqs[card.color] =0;}
    color_frqs[card.color] +=1;
  }
  return color_frqs
}




  this.find_focus_color = function(player_cards)
  {
      var focus_colors = []
      var groupedByColor = card_table_grouped_by_color(player_cards)
      var color_point_table = {}
      // console.log(groupedByColor)
      for(var color in groupedByColor){
        var point = rule_calculate_single_col(groupedByColor[color])
        // console.log(color,point)
        color_point_table[color]  = point;
      }

      for (var ii = 1; ii >= 0; ii--) {
          var color =get_key_with_max_value(color_point_table)
          delete color_point_table[color]
          focus_colors.push(color)
      }

      return focus_colors
        // console.log(this.focus_colors)
  }

  this.get_next_command =  function (player_cards, public_cards, desk,op_id)
  {
      //for the first round pick the colors want to focus on
      if(!this.focus_colors){
          this.focus_colors = this.find_focus_color(player_cards)
      }

      while(true)
      {

      }
      // sleep(100)

      console.log(player_cards,"  ",player_cards)
      console.log(this.focus_colors)


    //如果之前的步骤想好了，按之前的步骤来
    if (!this.card_to_put.isEmpty()){return this.card_to_put.pop()}

    var current_points = desk.calculate_player_point()
    // log(current_points)

    //没有的话，抛弃最差的拍 或者借牌
    // log(most_often_color+"  "+max_frq)
  }

}

function sort_player_cards(player_cards){
  function card_sorter(c1,c2){
   if (c1.color != c2.color){
              //http://stackoverflow.com/questions/51165/how-do-you-do-string-comparison-in-javascript
              return c1.color.localeCompare(c2.color);
            }else  {
              var cv1 = c1.value == "double"?1:c1.value
              var cv2 = c2.value == "double"?1:c2.value
              return cv1 - cv2;
            }
          }
          player_cards.sort(card_sorter)
}

      function rule_calculate_single_col(same_color_cards_col)
      {
       if(!same_color_cards_col||same_color_cards_col.isEmpty()){return 0;}
       var mul = 1,card_point = 0
       var prev_card = same_color_cards_col[0]
       for(var ii = 0; ii < same_color_cards_col.length;ii++){

        var cur_card = same_color_cards_col[ii]
        assert(cur_card.cmpr(prev_card)>=0, "wrong card array for caluclation")
        var value = cur_card.value
        if (value == "double"){
          mul *= 2
        }else{
          card_point += value
        }

        prev_card = cur_card

      }
      var point =  (card_point-20)*mul;
      return point;
    }


    function Desk(player_id1, player_id2)
    {
      var desk = {}
      this.unused_cards = []
      for (var ii = 0; ii< __COLORS__.length; ii++){
        var color = __COLORS__[ii]
        for (var jj = 1; jj <= __VALUE_NUM__; jj++) {
          if(jj==1){ var card = new Card(color,"double")
        }else{ var card = new Card(color,jj) }
      this.unused_cards.push(card)
    }
  }

  this.unused_cards.shuffle();

  this.player_cards = {}
  this.player_cards[player_id1] = this.unused_cards.splice(0, 8)
  this.player_cards[player_id2] = this.unused_cards.splice(0,8)
  sort_player_cards(this.player_cards[player_id1])
  sort_player_cards(this.player_cards[player_id2])

      // log(this.player_cards)

      this.public_cards= {}
      for (var ii = 0; ii< __COLORS__.length; ii++){
        var color = __COLORS__[ii]
        this.public_cards[color] = { player_id1:[],  player_id2:[], "give_up":[]} 
      }

      this.calculate_player_point =function(player_id){
        var result = {}
        var total = 0
        for (var ii = 0; ii< __COLORS__.length; ii++){
          var color = __COLORS__[ii]
          var point = this.calculate_single_col(player_id, color);
          result[color] = point
          total += point 
        }
        result["total"] = total
        return result;
      }


      this.calculate_single_col = function(player_id, color)
      {
        if (!this.public_cards[color]){throw "no such color";}
        var same_color_cards_col = this.public_cards[color][player_id];
        return rule_calculate_single_col(same_color_cards_col)
      }




      this.print = function()
      {
          console.log(player_id1, " is holding ", ss2(this.player_cards[player_id1]) )
          console.log(player_id2, " is holding ",ss2(this.player_cards[player_id2]))

          for (var ii = 0; ii< __COLORS__.length; ii++){
              var color = __COLORS__[ii]
              console.log("-----", color, "---------")
              var col =  this.public_cards[color]
              for(var key in col){
                console.log(key, " [", ss(col[key]) ,"]")
               
              }
          }

      }

      // command = [player_id,"put", card];
      // command = [player_id,"give_up", card]
      // command = [player_id,"pick", "from_which_color"]
      this.apply_command = function(cmd)
      { 
        if (!cmd){throw "NULL CMD"}
          var id = cmd[0], action =  cmd[1];
        if(action == "put"){
            //remove card from player 
            var card = cmd[2]
            var index = this.player_cards[id].indexOf(card);
            this.player_cards[id].splice(index, 1);   
            //add to public space player site

            this.public_cards[card.color][id].push(card)  
            //give playew new card   
            this.player_cards[id].push(this.unused_cards.pop())

          }else if (action == "give_up"){
            //remove card from player
            // log(cmd)
            var card = cmd[2] 
            var index = this.player_cards[id].indexOf(card);
            this.player_cards[id].splice(index, 1);  
            //add to public space player site
            // console.log(this.public_cards[card.color])
            this.public_cards[card.color]["give_up"].push(card) 
            //give playew new card   
            this.player_cards[id].push(this.unused_cards.pop())  

          }else if (action == "pick"){
            //pick the card
            var color = cmd[2]
            assert(this.public_cards[color]["give_up"].length > 0)
            var new_card = this.public_cards[color]["give_up"].pop()
            //add to the player
            this.player_cards[id].push(new_card)

          }else
          {
            throw "Wrong command"
          }
          sort_player_cards(this.player_cards[id])
        }
}



function game(ai1, ai2)
{
  var id1 = ai1.id, id2 = ai2.id;
  var desk = new Desk(id1,  id2)
  // log(desk)
  
  var round = 1
  while(!desk.unused_cards.isEmpty())
  {
    console.log("------begin "+ round+"------")
    desk.print()
    console.log()

    var command=ai1.get_next_command(desk.player_cards[id1], desk.public_cards,desk, id2)
    console.log(command[0]+" "+command[1]+" ["+command[2].toString()+"]")
    desk.apply_command(command)
    if (desk.unused_cards.isEmpty()){
      console.log("------end "+ round+"------\n")
      break;
    }
    command=ai2.get_next_command(desk.player_cards[id2],desk.public_cards,desk, id1)
    console.log(command[0]+" "+command[1]+" ["+command[2].toString()+"]")    
    desk.apply_command(command)

    console.log("------end "+ round+"------\n")
    round++
  }

  assert(desk.unused_cards.isEmpty(), "not run out of cards")
  var ai1_result = desk.calculate_player_point(id1)
  var ai2_result = desk.calculate_player_point(id2)
  log("--GAME SCORE--")
  console.log(id1 ,ai1_result)
  console.log(id2 ,ai2_result)
  log("-----------")

  if(ai1_result["total"] > ai2_result["total"]){
    console.log(id1," WIN")
  }else  if(ai1_result["total"] < ai2_result["total"]){
    console.log(id2," WIN")
  }else{
    console.log("Draw")
  }
}

// var ai1 = new hjy_ai("hjy")
// var ai2 = new hjy_ai("alice")

var ai1 = new idiot_ai("hjy")
var ai2 = new idiot_ai("alice")

game(ai1, ai2)
// function foo()
// {
//   return 1, 2
// }



