'use strict'


//Some help functions below
var  LOG = console.log;

//GLOBAL VARIBLES
var COLORS = ["red", "yellow", "blue", "green", "white"],
    CARD_NUM = 10,
    _COST_ = 20

function assert(condition, message) {
    if (!condition) {
        var e = new Error();
        LOG(e.stack);
        throw message || "Assertion failed";
    }
}



function randInt(a, b) {
    assert(b > a, "random wrong")
    return Math.floor(Math.random() * (b - a + 1) + a)
}

Array.prototype.shuffle = function (arr) {
    function internal_shuffler() {
        return Math.random() - 0.5; //random between -0.5 and 0.5
    }
    this.sort(internal_shuffler);
}

Array.prototype.isEmpty = function () {
    return this.length == 0
}

Array.prototype.dequeue = function () {
    return this.splice(0, 1)[0]
}

Array.prototype.has = function (element) {
    return this.indexOf(element) >= 0;
}

Array.prototype.last = function () {
    assert(this.length > 0, "last failed")
    return this[this.length - 1]
}

Object.prototype.getMaxKey = function()
{
    var maxKey, maxValue;
    for (var key in this) {
        if (!maxKey && !maxValue) {
            maxKey = key
            maxValue = this[key]
        } else if (this[key] > maxValue) {
            maxKey = key
            maxValue = this[key]
        }
    }
    return maxKey;
}


Object.prototype.VClone = function (){
    // http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
   return JSON.parse( JSON.stringify(this) );
}


function clone(obj) {
    if(obj === null || typeof(obj) !== 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for(var key in obj) {
        if(Object.prototype.hasOwnProperty.call(obj, key)) {
            temp[key] = clone(obj[key]);
        }
    }
    return temp;
}



function Card(color, value) {
    this.color = color;
    this.value = value;

    Card.prototype.toString = function () {
        return this.color + " " + this.value;
    }

    this.cmpr = function (card2) {
        if (this.color != card2.color) {
            //http://stackoverflow.com/questions/51165/how-do-you-do-string-comparison-in-javascript
            return this.color.localeCompare(card2.color);
        }
        var cv1 = this.value == "double" ? 1 : this.value
        var cv2 = card2.value == "double" ? 1 : card2.value
        return cv1 - cv2
    }


    this.big = function(card2)
    {
        return this.cmpr(card2) > 0
    }

    this.small = function(card2)
    {
        return this.cmpr(card2) < 0
    }

    this.equal = function(card2)
    {
        return this.cmpr(card2) == 0
    }

}






function ss(cards) {
    var str = "";
    for (var ii = 0; ii < cards.length; ii++) {
        var card = cards[ii];
        if (ii != cards.length - 1) {
            str += card.value + ", "
        } else {
            str += card.value
        }
    }
    return str;
}

function ss2(cards) {
    var str = "";
    for (var ii = 0; ii < cards.length; ii++) {
        var card = cards[ii];
        if (ii != cards.length - 1) {
            str += "[" + card.toString() + "], "
        } else {
            str += "[" + card.toString() + "]"
        }
    }
    return str;
}

//AI below
function idiot_ai(self_id) {
    this.id = self_id

    // cmd = [player_id,"put", card];
    // cmd = [player_id,"give_up", card]s
    // cmd = [player_id,"pick", "from_which_color"]
    this.get_next_cmd = function (player_cards, public_cards, desk, op_id) {
        //他妈的白痴，随便挑一张牌，扔了就是
        var index = randInt(0, player_cards.length - 1);
        var cmd = [this.id, "give_up", player_cards[index]]
        return cmd
    }
}


//better AI
// AI must implement this get_next_cmd = function (player_cards, public_cards, unused_card_num, op_id)
//and return cmd to tell what it want to do
// cmd = [player_id,"put", card];
// cmd = [player_id,"give_up", card]s
// cmd = [player_id,"pick", "from_which_color"]
//DO NOT MODIFY PLAYER_CARDS, PUBLIC_CARDS!!!!! ONLY ACCESS IT

function hjy_ai(self_id) {
    this.id = self_id
    this.cmd_to_put = []
    var therehold = -2


    function associate_Color_2_Card(player_cards) {
    var color_2_cards_Table = {}
    for (var ii = 0; ii < player_cards.length; ii++) {
        var card = player_cards[ii]
        if (!color_2_cards_Table[card.color]) {
            color_2_cards_Table[card.color] = [];
        }
        color_2_cards_Table[card.color].push(card);
        RULE.check_if_cards_sorted(color_2_cards_Table[card.color])
    }
    return color_2_cards_Table;
    }

    function create_color_point_table(color_2_cards_Table) {
        var color_point_table = {}
        for (var color in color_2_cards_Table) {
            var point = RULE.calculate_cards_point(color_2_cards_Table[color])
            color_point_table[color] = point;
        }
        return color_point_table;
    }



    this.find_focus_color = function (player_cards) {
        var focus_colors = []
        var color_2_cards_Table = associate_Color_2_Card(player_cards)
        var color_point_table = {}
            // LOG(color_2_cards_Table)
        for (var color in color_2_cards_Table) {
            var point = RULE.calculate_cards_point(color_2_cards_Table[color])
                // LOG(color,point)
            color_point_table[color] = point;
        }

        for (var ii = 0; ii < 2; ii++) {
            var color = color_point_table.getMaxKey()
            focus_colors.push(color)
                // LOG("found",color)
            delete color_point_table[color]
        }

        LOG(this.id, " will focus on ", this.focus_colors)
        return focus_colors
            // LOG(this.focus_colors)
    }

    this.print = function () {
        LOG(this.id, " focus on ", this.focus_colors)
        LOG(this.id, " going to put ", this.cmd_to_put)
    }


    function cmd_sorter(cmd1, cmd2)
    {
        return  cmd1[2].cmpr(cmd2[2])
    }

    this.get_next_cmd = function (PLAYER_CARDS, PUBLIC_CARDS, unused_card_num, op_id) {
        
        var leftTime = unused_card_num/ 2;

        //for the first round pick the colors want to focus on
        if (!this.focus_colors) { this.focus_colors = this.find_focus_color(PLAYER_CARDS)    }

        //如果之前的步骤想好了，按之前的步骤来
        //TO DO if it is legal or better solution
        if (!this.cmd_to_put.isEmpty()) {
            LOG('这回不用想了', this.cmd_to_put)
            this.cmd_to_put.sort(cmd_sorter)     
            var cmd = this.cmd_to_put.dequeue()
            var card = cmd[2]
            var color = card.color

            if ( RULE.is_putCmd_legal(cmd, PUBLIC_CARDS, PLAYER_CARDS) == true )
            {
                LOG(this.id, " does not need to think this time")

                // if（ RULE.calculate_cards_point(PUBLIC_CARDS[color][this.id]) == 0 && leftTime < this.cmd_to_put.length )
                if(leftTime < this.cmd_to_put.length ){

                    LOG("来不及了")
                    //来不及了
                }else
                {

                    return cmd
                }
            }
        }

        //卡用完了，考虑换颜色
        if (this.cmd_to_put.isEmpty()) {
            log("卡用完了，考虑换颜色")
            this.focus_colors = this.find_focus_color(PLAYER_CARDS)
        }

        LOG("想好的是", this.cmd_to_put)


        var self_color_2_cards_Table = associate_Color_2_Card(PLAYER_CARDS)
        var color_2_point = create_color_point_table(self_color_2_cards_Table)


        for (var ii = 0; ii < this.focus_colors.length; ii++) 
        {
            var color = this.focus_colors[ii]
            //牌足够好，发
            if (color_2_point[color] > therehold) 
            {
                var cards = self_color_2_cards_Table[color]
                RULE.check_if_same_color(cards)
                RULE.check_if_cards_sorted(cards)

                for (var ii = 0; ii < cards.length; ii++) {
                    var card = cards[ii]
                    var cmd = [this.id, "put", card]

                    //要比现在有的牌的小
                    if (PUBLIC_CARDS[color][this.id].isEmpty() || PUBLIC_CARDS[color][this.id].last().cmpr(card) <= 0) {
                        this.cmd_to_put.push(cmd)
                    }
                }


                if(!this.cmd_to_put.isEmpty()){
                    this.cmd_to_put.sort(cmd_sorter)  

                    var cmd = this.cmd_to_put.dequeue();
                    LOG("找到可以用的牌 发第一张",cmd)

                    if (RULE.is_putCmd_legal(cmd, PUBLIC_CARDS, PLAYER_CARDS)) {
                        return cmd;
                    }else
                    {
                        log("他妈的 怎么回事")
                        log(cmd)
                    }
                }
            }
        }

      
        //根据之前的focus color 计算
        for (var ii = 0; ii < this.focus_colors.length; ii++) 
        {
            var color = this.focus_colors[ii]
            var same_color_cards_holding = self_color_2_cards_Table[color]
            if (!same_color_cards_holding || same_color_cards_holding.isEmpty()) { continue  }
            // LOG(color)
            var giveUpZone = PUBLIC_CARDS[color]["give_up"]
            if(giveUpZone.isEmpty()){continue;}
            //如果有同颜色的卡可以pick
            
            if (leftTime < same_color_cards_holding.length -4 && leftTime < 10 ) { continue}     //要来得及
            
            //要比现在有的牌的小
            var col = PUBLIC_CARDS[color][this.id]
            LOG(col)
            if (col.isEmpty() || col.last().cmpr(giveUpZone.last()) <= 0) {
                var cmd = [this.id, "pick", color]
                if (RULE.is_PickCmd_legal(cmd, PUBLIC_CARDS, PLAYER_CARDS)) {
                    return cmd
                }else
                {
                    log("捡不了")
                }
            }
         }       

    


        //TO DO
        //look if eneymie need
        for (var ii = 0; ii < PLAYER_CARDS.length; ii++) {
            var card = PLAYER_CARDS[ii]
            if (this.focus_colors.has(card.color)) {
                continue;
            }
            var cmd = [this.id, "give_up", card]

            if (RULE.is_giveUpCmd_legal(cmd, PUBLIC_CARDS, PLAYER_CARDS)) {
                return cmd
            }
        }


        var e = new Error()
        LOG(e.stack);
        log("DO NOT KNOW HOW TO DO !!???")
        this.print()
        LOG(color_2_point)
        while (true){}
    }

}
    

var RULE = {
    check_if_cards_sorted:function (cards) {
    if (cards.isEmpty()) {
        return;
    }
        var prev = cards[0]
        for (var ii = 0; ii < cards.length; ii++) {
            var card = cards[ii]
            if (card.cmpr(prev) < 0) {
                LOG(cards)
                    // http://stackoverflow.com/questions/591857/how-can-i-get-a-javascript-stack-trace-when-i-throw-an-exception
                var e = new Error();
                LOG(e.stack);
                throw "unsorted!!!"
            }
            prev = card
        }
    },

    check_if_same_color:function (cards) {
        if (cards.isEmpty()) {
            return;
        }
        var prev = cards[0]
        for (var ii = 0; ii < cards.length; ii++) {
            var card = cards[ii]
            if (card.color != prev.color) {
                LOG(e.stack);
                throw "different color"
            }
            prev = card
        }
    },

    calculate_player_point : function (desk, player_id) 
    {
        var result = {}
        var total = 0
        for (var ii = 0; ii < COLORS.length; ii++)
         {
            var color = COLORS[ii]
            if (!desk.public_cards[color]) 
            {
                throw "no such color";
            }

            var same_color_cards_col = desk.public_cards[color][player_id]
            var point = RULE.calculate_cards_point(same_color_cards_col)
            result[color] = point
            total += point
        }
        result["total"] = total
        return result;
    },

    calculate_cards_point : function (same_color_cards) 
    {
        if (!same_color_cards || same_color_cards.isEmpty()) 
        {
            return 0;
        }
        RULE.check_if_cards_sorted(same_color_cards)
        RULE.check_if_same_color(same_color_cards)

        var mul = 1, card_point = 0
        for (var ii = 0; ii < same_color_cards.length; ii++) 
        {
            var cur_card = same_color_cards[ii]
            var value = cur_card.value
            if (value == "double") {
                mul *= 2
            } else {
                card_point += value
            }
        }
        var point = (card_point - _COST_) * mul;
        return point;
    },

    is_putCmd_legal : function (cmd, public_cards, player_cards) 
    {
        var id = cmd[0],
            action = cmd[1];
        if (action == "put") {
            //remove card from player 
            var card = cmd[2]
            var index = player_cards.indexOf(card);
            if (index < 0) {
                return false
            }
            var putted_cards = public_cards[card.color][id]

            if (!putted_cards.isEmpty() && putted_cards.last().cmpr(card) > 0) {
                return false;
            }
            return true;
        } else {
            return false;
        }
    },


    is_giveUpCmd_legal :function (cmd, public_cards, player_cards) {
        var id = cmd[0],  action = cmd[1];
        if (action == "give_up") 
        {
            var card = cmd[2]
            var index = player_cards.indexOf(card);
            if (index < 0) {  return false  }
            return true;

        } else {
            return false;
        }
    },

    is_PickCmd_legal : function (cmd, public_cards, player_cards) {
        var id = cmd[0],    action = cmd[1];
        if (action == "pick") 
        {
            var color = cmd[2]
            if (public_cards[color]["give_up"].length == 0) {
                return false
            }
            return true;
        } else {
            return false;
        }
    }
};



function Desk(player_id1, player_id2) {
    var _unused_cards = []
    for (var ii = 0; ii < COLORS.length; ii++) {
        var color = COLORS[ii]
        for (var jj = 1; jj <= CARD_NUM; jj++) {
            if (jj == 1) {
                var card = new Card(color, "double")
            } else {
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
    for (var ii = 0; ii < COLORS.length; ii++) {
        var color = COLORS[ii]
        this.public_cards[color] = {}
        this.public_cards[color]["give_up"] = []
        this.public_cards[color][player_id1] = []
        this.public_cards[color][player_id2] = []
    }


    function card_sorter(c1, c2) {
    return c1.cmpr(c2)
    }

    function sort_cards(player_cards) {
        player_cards.sort(card_sorter)
    }



    this.unusedNum = function () {
        return _unused_cards.length;
    }


    this.print = function () {
        LOG(player_id1, " is holding ", ss2(this.player_cards[player_id1]))
        LOG(player_id2, " is holding ", ss2(this.player_cards[player_id2]))

        for (var ii = 0; ii < COLORS.length; ii++) {
            var color = COLORS[ii]
            LOG("-----", color, "---------")
            var col = this.public_cards[color]
            for (var key in col) {
                LOG(key, " (", ss2(col[key]), ")")

            }
        }

        LOG("There are " + this.unusedNum() + ' cards left')

    }

    // cmd = [player_id,"put", card];
    // cmd = [player_id,"give_up", card]
    // cmd = [player_id,"pick", "from_which_color"]
    this.apply_cmd = function (cmd) {
        if (!cmd) {
            throw "NULL CMD"
        }
        var id = cmd[0], action = cmd[1];
        if (action == "put") {
            //remove card from player 
            var card = cmd[2]

            if(!RULE.is_putCmd_legal(cmd, this.public_cards, this.player_cards[id]))
            {
                var e = new Error();   LOG(e.stack);
                throw "add the wrong card"
            }

            var index = this.player_cards[id].indexOf(card);
            this.player_cards[id].splice(index, 1);


            //add to public space player site
            this.public_cards[card.color][id].push(card)
            //give playew new card   
            this.player_cards[id].push(_unused_cards.pop())

        } else if (action == "give_up") {
            //remove card from player
            // log(cmd)
            var card = cmd[2]
            if(!RULE.is_giveUpCmd_legal(cmd, this.public_cards, this.player_cards[id]))
            {
                var e = new Error();   LOG(e.stack);
                throw  "wrong give up"
            }


            var index = this.player_cards[id].indexOf(card);
            this.player_cards[id].splice(index, 1);
            //add to public space player site
            this.public_cards[card.color]["give_up"].push(card)
                //give playew new card   
            this.player_cards[id].push(_unused_cards.pop())

        } else if (action == "pick") {
            //pick the card
            var color = cmd[2]
            if(!RULE.is_PickCmd_legal(cmd, this.public_cards, this.player_cards[id]))
            {
                var e = new Error();   LOG(e.stack);
                throw  "wrong pick"
            }

            assert(this.public_cards[color]["give_up"].length > 0)
            var new_card = this.public_cards[color]["give_up"].pop()
                //add to the player
            this.player_cards[id].push(new_card)

        } else {
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
    while (desk.unusedNum() != 0) 
    {
        LOG("------begin " + round + "------")
        desk.print()
        LOG()

        //the first ai think 
        var cmd = ai1.get_next_cmd(desk.player_cards[id1], desk.public_cards, desk.unusedNum(), id2)
        LOG(cmd[0] + " " + cmd[1] + " [" + cmd[2].toString() + "]")
        desk.apply_cmd(cmd)
        if (desk.unusedNum() == 0) {
            LOG("------end " + round + "------\n")
            break;
        }


        //the second ai think 
        cmd = ai2.get_next_cmd(desk.player_cards[id2], desk.public_cards, desk.unusedNum(), id1)
        LOG(cmd[0] + " " + cmd[1] + " [" + cmd[2].toString() + "]")
        desk.apply_cmd(cmd)

        LOG("------end " + round + "------\n")
        round++
    }

    assert(desk.unusedNum() == 0, "not run out of cards")

    LOG("--GAME SCORE--")
    var ai1_result = RULE.calculate_player_point(desk, id1)
    var ai2_result = RULE.calculate_player_point(desk, id2)
    LOG(id1, ai1_result)
    LOG(id2, ai2_result)
    LOG("-----------")

    if (ai1_result["total"] > ai2_result["total"]) {
        // LOG(id1, " WIN")
        return id1
    } else if (ai1_result["total"] < ai2_result["total"]) {
        // LOG(id2, " WIN")
        return id2
    } else {
        // LOG("Draw")
        return null
    }
}


var ai1 = new idiot_ai("hjy")
var ai2 = new idiot_ai("alice")

var winner = game(ai1, ai2)
if(winner)
{
    LOG(winner, "WIN !")
}else
{
    LOG("Draw")
}


