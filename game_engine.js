'use strict'

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



function hjy_ai(self_id)
{
  this.id = self_id

  function get_next_command(desk, op_id)
  {
    var color_frqs = {}
    for(var ii = 0; ii< desk.player_cards[self_id].length; ii++)
    {
      var color = desk.colors[ii]
      if (!color_frqs[color]){color_frqs[color]=0}
      color_frqs[color] += 1
    }


}



function Desk(player_id1, player_id2)
{
  var desk = {}
  this.unused_cards = []
  this.colors = ["red", "yellow", "blue", "green", "white"]
  for (var ii = 0; ii< this.colors.length; ii++){
    var color = this.colors[ii]
    for (var jj = 1; jj <= 10; jj++) {
        if(jj==1){
          var card = new Card(color,"double")
        }else{
           var card = new Card(color,jj)
        }
       this.unused_cards.push(card)
    }
  }

  // log(this.unused_cards)
  this.unused_cards.shuffle();

  this.player_cards = {}
  this.player_cards[player_id1] = this.unused_cards.splice(0, 8)
  this.player_cards[player_id2] = this.unused_cards.splice(0,8)

  this.public_spcae = {}
  for (var ii = 0; ii< this.colors.length; ii++){
    var color = this.colors[ii]
    this.public_spcae[color] = { player_id1:[],  player_id2:[], "give_up":[]} 
  }



   this.calculate_player_point =function( player_id){
    result = {}
    total = 0
    for (var ii = 0; ii< this.colors.length; ii++){
      var color = this.colors[ii]

      point = this.calculate_player_point(player_id, color);
      result[color] = point
      total += point 
    }
    result["total"] = total
    return result;
  }


  this.calculate_single_col = function(player_id, color)
  {
    if (!this[color]){throw "no such color";}
   same_color_cards_col = this.public_spcae[color][player_id];
    if(!same_color_cards_col||same_color_cards_col.length == 0){return 0;}

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

// command = [player_id,"put", card];
// command = [player_id,"give_up", card]
// command = [player_id,"pick", "from_which_color"]
  this.apply_command = function(cmd)
  { 
    if (!cmd){throw "NULL CMD"}
    var id = cmd[0], action =  cmd[1];
    if(action == "put"){
      //remove card from player 
      var card = cmd[1]
      var index = this.player_cards[id].indexOf(card);
      array.splice(index, 1);   
      //add to public space player site
      this.public_spcae[card.color][id].add(card)   
      //give playew new card   
      this.player_cards[id].add(this.unused_cards.pop())

    }else if (action == "give_up"){
      //remove card from player
      var card = cmd[1] 
      var index = this.player_cards[id].indexOf(card);
      array.splice(index, 1);  
      //add to public space player site
      this.public_spcae[card.color]["give_up"].add(card) 
      //give playew new card   
      this.player_cards[id].add(this.unused_cards.pop())  

    }else if (action == "pick"){
      //pick the card
      var color = cmd[2]
      assert(this.public_spcae[color]["give_up"] > 0)
      var new_card = this.public_spcae[color]["give_up"].pop()
      //add to the player
      this.player_cards[id].add(new_card)

    }else
    {
      throw "Wrong command"
    }
  }
}



function game(id1, id2)
{
  
  var desk = new Desk(id1,  id2)
  log(desk)

  while(desk.unused_cards.length >0)
  {
    var command=hjy_ai(desk,id1,id2)
    desk.apply_command(command)

    if (desk.unused_cards.length == 0){break;}

    command=hjy_ai(desk, id2, id1)
    desk.apply_command(command)

  }

  // var result =calculate_win_lose()
}

var id1= "hjy",  id2 = "alice"
game(id1, id2)

