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
    return this.value+" "+this.color;
  }

  this.cmpr = function(card2)
  {
     assert(this.color == card2.color)
      var cv1 = this.value == "double"?1:this.value
      var cv2 = c2.value == "double"?1:c2.value
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

    this.get_most_frq_color = function(color_frqs)
    {
     var most_often_color, max_frq;
     for(var color in color_frqs)
     {
      if (!most_often_color && !max_frq)
      {
        most_often_color = color
        max_frq = color_frqs[color]
      }
      else if(color_frqs[color] > max_frq)
      {
        most_often_color = color
        max_frq = color_frqs[color]
      }
    }
    return most_often_color;
  }

  this.get_next_command =  function (player_cards, public_cards, desk,op_id)
  {
    //如果之前的步骤想好了，按之前的步骤来
    if (!this.card_to_put.isEmpty()){return this.card_to_put.pop()}

    //找出最大优势的那组牌，可以正分  
    // var color_frqs = this.get_color_freq(player_cards)


     for (var ii = 0; ii< __COLORS__.length; ii++){
        var color = __COLORS__[ii]
        if (!desk.public_cards[this.id].isEmpty())
        {
          var last_card =  desk.public_cards[this.id].last()
        }

        var putable_cards = []
        var give_upable_cards = []

        for(var jj=0; jj<player_cards.length;jj++)
        {
           var card = player_cards[jj]
           if(card.color != color) {continue;}
           if ( desk.public_cards[this.id].isEmpty() ||(!last_card && card.cmpr(last_card)>0))
           {
               //feasible
               putable_cards.push(card)
           }else
           {
              give_upable_cards.push(card)
           }

        }

     }   

    //计算还剩的步骤 不要来不及发牌

    // log("color frequncy")
    // log(color_frqs)
    var current_points = desk.calculate_player_point()
    // log(current_points)

    //没有的话，抛弃最差的拍 或者借牌
    // log(most_often_color+"  "+max_frq)
  }

}



function Desk(player_id1, player_id2)
{

   this.__sort_player_cards = function(){
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
    this.player_cards[player_id1].sort(card_sorter)
    this.player_cards[player_id2].sort(card_sorter)     
  }


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
this.__sort_player_cards();
  // log(this.player_cards)

  this .public_cards= {}
  for (var ii = 0; ii< __COLORS__.length; ii++){
    var color = __COLORS__[ii]
    this.public_spcae[color] = { player_id1:[],  player_id2:[], "give_up":[]} 
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
    if (!this.public_spcae[color]){throw "no such color";}
    var same_color_cards_col = this.public_spcae[color][player_id];
    if(!same_color_cards_col||same_color_cards_col.isEmpty()){return 0;}

    return this.rule.calculate_single_col(same_color_cards_col)
  }


  this.rule_calculate_single_col = function(same_color_cards_col)
  {
    var mul = 1,card_point = 0
    for(var ii = 0; ii < same_color_cards_col.length;ii++){
      var value = same_color_cards_col[ii].value
      if (value == "double"){
        mul *= 2
      }else{
        card_point += value
      }
    }
    var point =  (card_point-20)*mul;
    return point;
  }

  this.print = function()
  {
    this.player_cards(pla)

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

      this.public_spcae[card.color][id].push(card)  
      //give playew new card   
      this.player_cards[id].push(this.unused_cards.pop())

    }else if (action == "give_up"){
      //remove card from player
      // log(cmd)
      var card = cmd[2] 
      var index = this.player_cards[id].indexOf(card);
      this.player_cards[id].splice(index, 1);  
      //add to public space player site
      // console.log(this.public_spcae[card.color])
      this.public_spcae[card.color]["give_up"].push(card) 
      //give playew new card   
      this.player_cards[id].push(this.unused_cards.pop())  

    }else if (action == "pick"){
      //pick the card
      var color = cmd[2]
      assert(this.public_spcae[color]["give_up"].length > 0)
      var new_card = this.public_spcae[color]["give_up"].pop()
      //add to the player
      this.player_cards[id].push(new_card)

    }else
    {
      throw "Wrong command"
    }
    this.__sort_player_cards();
  }
}



function game(ai1, ai2)
{
  var id1 = ai1.id, id2 = ai2.id;
  var desk = new Desk(id1,  id2)
  // log(desk)
  
  var round = 0
  while(!desk.unused_cards.isEmpty())
  {
    console.log("------begin "+ round+"------")
    var command=ai1.get_next_command(desk.player_cards[id1], desk.public_spcae,desk, id2)
    desk.apply_command(command)
    if (desk.unused_cards.isEmpty()){break;}
    command=ai2.get_next_command(desk.player_cards[id2],desk.public_spcae,desk, id1)
    desk.apply_command(command)

    round++
    console.log("------end "+ round+"------")

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

var ai1 = new hjy_ai("hjy")
var ai2 = new idiot_ai("alice")

game(ai1, ai2)
// function foo()
// {
//   return 1, 2
// }



