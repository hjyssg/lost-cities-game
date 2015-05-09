'use strict'


// command = ["put", card];
// command = ["give_up", card]
// command = ["pick", "color"]   

function log(arg){
  console.log(arg);
}

Array.prototype.shuffle = function(arr){
  function internal_shuffler()   {
    return Math.random()-0.5; //random between -0.5 and 0.5
  }
  this.sort(internal_shuffler);
}

function assert(condition, message) {
    if (!condition) {
        throw message || "Assertion failed";
    }
}

function Card(color, value)
{
  this.color = color;
  this.value = value;
}




// alice_ai(desk,alice_cards,"alice_id","bob_id")
// function greedy_
function greedy_ai(desk, self_cards, self_id, op_id)
{
  //benefif
  //for color in desk
  //  for card in self_cards
  //     if feasible and benefitical 
  //          max benefitial
  //        
  // or choose one from other people
  //no any card to put, chose the most useless card to give up

  // for(var ii = 0; ii < self.cards)


  // command = ["put", card];
  // command = ["give_up", card]
  // command = ["pick", "color"]  
  return command;  

}

function Desk()
{
  var desk = {}
  this.unused_cards = []
  this.colors = ["red", "yellow", "blue", "green", "white"]
  for (var ii = 0; ii< this.colors.length; ii++){
    var color = this.colors[ii]
    for (var jj = 1; jj <= 10; jj++) {
        if(jj==1)
        {
          var card = new Card(color,"double")
        }else
        {
           var card = new Card(color,jj)
        }
       this.unused_cards.push(card)
    }
  }

  log(this.unused_cards)
  this.unused_cards.shuffle();

  this.alice_cards = cards.splice(0, 8)
  this.bob_cards = cards.splice(0,8)


  for (var ii = 0; ii< this.colors.length; ii++){
    var color = this.colors[ii]
    this[color] = { "alice_id":[],
                    "bob_id":[],
                    "give_up":[]} 
  }

}

function calculate_point(same_color_cards_col)
{ 
   if(same_color_cards_col.length == 0){return 0;}
    var mul = 1
    var card_point = 0
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




function game(alice_ai, bob_ai)
{

 
  //a desk has five color sitep
  //player can put 
  // log(desk)

  while(cards.length >0)
  {
    var command=alice_ai(desk,"alice_id","bob_id")
    // apply(command, desk)
    if (cards.length == 0){break;}
    bob_ai(desk, "bob_id", "alice_id")
        // apply(command, desk)
  }

  // var result =calculate_win_lose()

}

function test_calculate_point()
{
  var cards = [ new Card('yellow', 'double'),
                new Card('yellow', 2),
                new Card('yellow', 3)]
  var point = calculate_point(cards)
  assert(point == -30)

   var cards =  [ new Card('yellow', 2),
                  new Card('yellow', 3),
                  new Card('yellow', 5),
                  new Card('yellow', 10)]
  var point = calculate_point(cards)
  assert(point == 0)

  var cards =  [  new Card('red', 'double'), 
                  new Card('red', 2),
                  new Card('red', 3),
                  new Card('red', 5),
                  new Card('red', 6),
                  new Card('red', 10)]
  var point = calculate_point(cards)
  assert(point == 12)
}



var card = new Card("red", 1)
log(card)

// game()