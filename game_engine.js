'use strict'


//Some help functions below
function log()
{ 
  var a = arguments
  console.log(a[0]);
}

function randInt(a, b)
{
    assert(b > a, "random wrong")
    return Math.floor(Math.random() * (b - a + 1) + a)
}



Array.prototype.shuffle = function(arr)
{
    function internal_shuffler()
    {
        return Math.random() - 0.5; //random between -0.5 and 0.5
    }
    this.sort(internal_shuffler);
}

Array.prototype.isEmpty = function()
{
    return this.length == 0
}

Array.prototype.dequeue = function()
{
  return this.splice(0,1)[0]
}
 
Array.prototype.has = function(element)
{
    return this.indexOf(element) >= 0;
}

Array.prototype.last = function()
{
    assert(this.length > 0, "last failed")
    return this[this.length - 1]
}

function get_key_with_max_value(dict)
{
    var maxKey, maxValue;
    for (var key in dict)
    {
        if (!maxKey && !maxValue)
        {
            maxKey = key
            maxValue = dict[key]
        }
        else if (dict[key] > maxValue)
        {
            maxKey = key
            maxValue = dict[key]
        }
    }
    return maxKey;
}



function assert(condition, message)
{
    if (!condition)
    {
        var e = new Error();
       console.log(e.stack);
        throw message || "Assertion failed";
    }
}

//GLOBAL VARIBLES
var __COLORS__ = ["red", "yellow", "blue", "green", "white"],
 __VALUE_NUM__ = 10,
 _COST_ = 20

function Card(color, value)
{
    this.color = color;
    this.value = value;

    Card.prototype.toString = function()
    {
        return this.color + " " + this.value;
    }

    this.cmpr = function(card2)
    {
        if(this.color != card2.color){
        //http://stackoverflow.com/questions/51165/how-do-you-do-string-comparison-in-javascript
        return this.color.localeCompare(card2.color);
      }
        var cv1 = this.value == "double" ? 1 : this.value
        var cv2 = card2.value == "double" ? 1 : card2.value
        return cv1 - cv2
    }
}

function card_sorter(c1, c2)
{
    return c1.cmpr(c2)
}

function check_if_cards_sorted(cards)
{
  if(cards.isEmpty()){return;}
  var prev = cards[0]
  for(var ii = 0; ii < cards.length;ii++)
  {
    var card = cards[ii]
    if(card.cmpr(prev) <0) {
      console.log(cards)
      // http://stackoverflow.com/questions/591857/how-can-i-get-a-javascript-stack-trace-when-i-throw-an-exception
      var e = new Error();
      console.log(e.stack);
      throw "unsorted!!!"
    }
    prev = card
  }
}

function check_if_same_color(cards)
{
   if(cards.isEmpty()){return;}
  var prev = cards[0]
  for(var ii = 0; ii < cards.length;ii++)
  {
    var card = cards[ii]
    if(card.color != prev.color) {
      console.log(e.stack);
      throw "different color"
    }
      prev = card
  }
}

function sort_cards(player_cards)
{
    player_cards.sort(card_sorter)
}


function create_color_2_card_table(player_cards)
{
    var color_2_cards_Table = {}
    for (var ii = 0; ii < player_cards.length; ii++)
    {
        var card = player_cards[ii]
        if (!color_2_cards_Table[card.color])  {
            color_2_cards_Table[card.color] = [];
        }
        color_2_cards_Table[card.color].push(card);
        check_if_cards_sorted(color_2_cards_Table[card.color])
    }
    return color_2_cards_Table;
}

function create_color_point_table(color_2_cards_Table){
 var color_point_table = {}
 for (var color in color_2_cards_Table)  {
      var point = RULE_calculate_cards_point_by(color_2_cards_Table[color])
      color_point_table[color] = point;
  }
  return color_point_table;
}

function ss(cards)
{
    var str = "";
    for (var ii = 0; ii < cards.length; ii++)
    {
        var card = cards[ii];
        if (ii != cards.length - 1)
        {
            str += card.value + ", "
        }
        else
        {
            str += card.value
        }
    }
    return str;
}

function ss2(cards)
{
    var str = "";
    for (var ii = 0; ii < cards.length; ii++)
    {
        var card = cards[ii];
        if (ii != cards.length - 1)
        {
            str += "[" + card.toString() + "], "
        }
        else
        {
            str += "[" + card.toString() + "]"
        }
    }
    return str;
}

//AI below
function idiot_ai(self_id)
{
    this.id = self_id

    // cmd = [player_id,"put", card];
    // cmd = [player_id,"give_up", card]s
    // cmd = [player_id,"pick", "from_which_color"]
    this.get_next_cmd = function(player_cards, public_cards, desk, op_id)
    {
        //他妈的白痴，随便挑一张牌，扔了就是
        var index = randInt(0, player_cards.length - 1);
        var cmd = [this.id, "give_up", player_cards[index]]
        return cmd
    }
}


function hjy_ai(self_id)
{
    this.id = self_id
    this.cmd_to_put = []
    var therehold = -2



    this.find_focus_color = function(player_cards)
    {
        var focus_colors = []
        var color_2_cards_Table = create_color_2_card_table(player_cards)
        var color_point_table = {}
            // console.log(color_2_cards_Table)
        for (var color in color_2_cards_Table)
        {
            var point = RULE_calculate_cards_point_by(color_2_cards_Table[color])
                // console.log(color,point)
            color_point_table[color] = point;
        }

        for (var ii = 0; ii <2; ii++)
        {
            var color = get_key_with_max_value(color_point_table)
            focus_colors.push(color)
            console.log("found",color)

            delete color_point_table[color]

        }

        return focus_colors
            // console.log(this.focus_colors)
    }

    this.print = function()
    {   
        console.log(this.id, " focus on ", this.focus_colors)
        console.log(this.id," going to put ", this.cmd_to_put)
    }

    this.get_next_cmd = function(player_cards, public_cards, desk, op_id)
    {
        //for the first round pick the colors want to focus on
        if (!this.focus_colors)
        {
            this.focus_colors = this.find_focus_color(player_cards)
        }

        //如果之前的步骤想好了，按之前的步骤来
        //TO DO if it is legal or better solution
        if (!this.cmd_to_put.isEmpty())   { 
            this.print()
            return this.cmd_to_put.dequeue()  }

        var color_2_cards_Table = create_color_2_card_table(player_cards)
        var color_2_point = create_color_point_table(color_2_cards_Table)
        var leftTime = desk.unused_card_num()/2;


        // console.log("the fucos color is", this.focus_colors)
        for(var ii = 0; ii < this.focus_colors.length; ii++)
        {
          var color = this.focus_colors[ii]
          var sameColorCards = color_2_cards_Table[color]
          if(!sameColorCards||sameColorCards.isEmpty()){continue}
          // console.log(color)
          var giveUpZone = public_cards[color]["give_up"]
          //如果有同颜色的卡可以pick
          if(!giveUpZone.isEmpty() &&giveUpZone.last().cmpr(sameColorCards[0])<=0)
          {
            //要来得及
            if(leftTime > sameColorCards.length + 1)
            {
                var cmd = [this.id, "pick", color]
                return cmd
            }
          }

          if(color_2_point[color] > therehold)
          {
              var cards = color_2_cards_Table[color]
              check_if_same_color(cards)
              check_if_cards_sorted(cards)

              for(var ii=0;ii< cards.length; ii++)
              {   var card = cards[ii]
                  var cmd = [this.id, "put", card]
                  this.cmd_to_put.push(cmd)
              }
              return this.cmd_to_put.dequeue();
          }
        }

         //TO DO
        //look if eneymie need
        for(var ii = 0; ii < player_cards.length; ii++){
          var card = player_cards[ii]
           if (this.focus_colors.has(card.color)){continue;}
           var cmd = [this.id, "give_up", card]
           return cmd
        }

        var e = new Error()
        console.log(e.stack);
        this.print()
        console.log(color_2_point)
        throw "DO NOT WHAT TO DO! OMG"

    }

}

function RULE_calculate_player_point(desk,player_id)
{
        var result = {}
        var total = 0
        for (var ii = 0; ii < __COLORS__.length; ii++)
        {
            var color = __COLORS__[ii]

             if (!desk.public_cards[color]) {  throw "no such color";  }

            var same_color_cards_col = desk.public_cards[color][player_id]
            var point = RULE_calculate_cards_point_by(same_color_cards_col)
            result[color] = point
            total += point
        }
        result["total"] = total
        return result;
}



function RULE_calculate_cards_point_by(same_color_cards)
{
    if (!same_color_cards || same_color_cards.isEmpty())
    {
        return 0;
    }
    var mul = 1, card_point = 0
    check_if_cards_sorted(same_color_cards)
    check_if_same_color(same_color_cards)
    for (var ii = 0; ii < same_color_cards.length; ii++)
    {

        var cur_card = same_color_cards[ii]
        var value = cur_card.value
        if (value == "double")
        {
            mul *= 2
        }
        else
        {
            card_point += value
        }
    }
    var point = (card_point - _COST_) * mul;
    return point;
}


function Desk(player_id1, player_id2)
{
    var _unused_cards = []
    for (var ii = 0; ii < __COLORS__.length; ii++)
    {
        var color = __COLORS__[ii]
        for (var jj = 1; jj <= __VALUE_NUM__; jj++)
        {
            if (jj == 1)
            {
                var card = new Card(color, "double")
            }
            else
            {
                var card = new Card(color, jj)
            }
            _unused_cards.push(card)
        }
    }

    _unused_cards.shuffle();

    this.player_cards = {}
    this.player_cards[player_id1] = _unused_cards.splice(0, 8)
    this.player_cards[player_id2] = _unused_cards.splice(0, 8)
    sort_cards(this.player_cards[player_id1])
    sort_cards(this.player_cards[player_id2])

    // log(this.player_cards)

    this.public_cards = {}
    for (var ii = 0; ii < __COLORS__.length; ii++)
    {
        var color = __COLORS__[ii]
        this.public_cards[color] = {}
        this.public_cards[color]["give_up"] = []
        this.public_cards[color][player_id1] = []
        this.public_cards[color][player_id2] = []
    }

    


    this.unused_card_num =function()
    {
      return _unused_cards.length;
    }


    this.print = function()
    {
        console.log(player_id1, " is holding ", ss2(this.player_cards[player_id1]))
        console.log(player_id2, " is holding ", ss2(this.player_cards[player_id2]))

        for (var ii = 0; ii < __COLORS__.length; ii++)
        {
            var color = __COLORS__[ii]
            console.log("-----", color, "---------")
            var col = this.public_cards[color]
            for (var key in col)
            {
                console.log(key, " (", ss2(col[key]), ")")

            }
        }

        console.log("There are "+this.unused_card_num() + ' cards left')

    }

    // cmd = [player_id,"put", card];
    // cmd = [player_id,"give_up", card]
    // cmd = [player_id,"pick", "from_which_color"]
    this.apply_cmd = function(cmd)
    {
        if (!cmd)
        {
            throw "NULL CMD"
        }
        var id = cmd[0],
            action = cmd[1];
        if (action == "put")
        {
            //remove card from player 
            var card = cmd[2]
            var index = this.player_cards[id].indexOf(card);
            this.player_cards[id].splice(index, 1);

            if(!this.public_cards[card.color][id].isEmpty())
            {
                assert(this.public_cards[card.color][id].last().cmpr(card) <= 0, "add the wrong card")
            }

            //add to public space player site
            this.public_cards[card.color][id].push(card)
                //give playew new card   
            this.player_cards[id].push(_unused_cards.pop())

        }
        else if (action == "give_up")
        {
            //remove card from player
            // log(cmd)
            var card = cmd[2]
            var index = this.player_cards[id].indexOf(card);
            this.player_cards[id].splice(index, 1);
            //add to public space player site
            // console.log(this.public_cards[card.color])
            this.public_cards[card.color]["give_up"].push(card)
                //give playew new card   
            this.player_cards[id].push(_unused_cards.pop())

        }
        else if (action == "pick")
        {
            //pick the card
            var color = cmd[2]
            assert(this.public_cards[color]["give_up"].length > 0)
            var new_card = this.public_cards[color]["give_up"].pop()
                //add to the player
            this.player_cards[id].push(new_card)

        }
        else
        {
            throw "Wrong cmd"
        }
        sort_cards(this.player_cards[id])
    }
}



function game(ai1, ai2)
{
    var id1 = ai1.id,
        id2 = ai2.id;
    var desk = new Desk(id1, id2)
        // log(desk)

    var round = 1
    while (desk.unused_card_num() != 0)
    {
        console.log("------begin " + round + "------")
        desk.print()
        console.log()

        var cmd = ai1.get_next_cmd(desk.player_cards[id1], desk.public_cards, desk, id2)
        console.log(cmd[0] + " " + cmd[1] + " [" + cmd[2].toString() + "]")
        desk.apply_cmd(cmd)
        if (desk.unused_card_num() == 0)
        {
            console.log("------end " + round + "------\n")
            break;
        }
        cmd = ai2.get_next_cmd(desk.player_cards[id2], desk.public_cards, desk, id1)
        console.log(cmd[0] + " " + cmd[1] + " [" + cmd[2].toString() + "]")
        desk.apply_cmd(cmd)

        console.log("------end " + round + "------\n")
        round++
    }

    assert(desk.unused_card_num() == 0, "not run out of cards")
   
    log("--GAME SCORE--")
    var ai1_result = RULE_calculate_player_point(desk,id1)
    var ai2_result = RULE_calculate_player_point(desk,id2)
    console.log(id1, ai1_result)
    console.log(id2, ai2_result)
    log("-----------")

    if (ai1_result["total"] > ai2_result["total"])
    {
        console.log(id1, " WIN")
    }
    else if (ai1_result["total"] < ai2_result["total"])
    {
        console.log(id2, " WIN")
    }
    else
    {
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