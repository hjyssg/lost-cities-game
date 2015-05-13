'use strict'


//Some help functions below
var LOG = console.log;

//GLOBAL VARIBLES
var COLORS = ["red", "yellow", "blue", "green", "white"],
    CARD_NUM = 10,
    _COST_ = 20

function assert(condition, message)
{
    if (!condition)
    {
        var e = new Error();
        LOG(e.stack);
        throw message || "Assertion failed";
    }
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

Object.prototype.isEmpty = function()
{
    return this.length == 0
}

Array.prototype.dequeue = function()
{
    return this.splice(0, 1)[0]
}

Array.prototype.has = function(element)
{
    return this.indexOf(element) >= 0;
}

Array.prototype.last = function()
{
    assert(this.length > 0, "last failed. the array is empty")
    return this[this.length - 1]
}


Object.prototype.VClone = function()
{
    // http://stackoverflow.com/questions/728360/most-elegant-way-to-clone-a-javascript-object
    return JSON.parse(JSON.stringify(this));
}


function clone(obj)
{
    if (obj === null || typeof(obj) !== 'object')
        return obj;

    var temp = obj.constructor(); // changed

    for (var key in obj)
    {
        if (Object.prototype.hasOwnProperty.call(obj, key))
        {
            temp[key] = clone(obj[key]);
        }
    }
    return temp;
}



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
        if (this.color != card2.color)
        {
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

//return the string of card array
function cards2str(cards)
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

function c2s(cmd)
{
    return "[" + cmd[0] + " " + cmd[1] + "  " + cmd[2].toString() + "]"
}

function cmds2str(cmds)
{
    var result = ""
    for (var ii = 0; ii < cmds.length; ii++)
    {
        var cmd = cmds[ii]
        result += c2s(cmd)
        if (ii != cmds.length - 1)
        {
            result += ", "
        }
    }
    return result
}


//AI below
function idiot_ai(self_id)
{
    this.id = self_id

    this.get_next_cmd = function(player_cards, public_cards, desk, op_id)
    {
        //他妈的白痴，随便挑一张牌，扔了就是
        var index = randInt(0, player_cards.length - 1);
        var cmd = [this.id, "give_up", player_cards[index]]
        return cmd
    }
}


//better AI
// AI must implement this get_next_cmd = function(PLAYER_CARDS, PUBLIC_CARDS, unused_card_num, op_id, self_point, op_point)
//and return cmd to tell what it want to do
// cmd = [player_id,"put", card];
// cmd = [player_id,"give_up", card]s
// cmd = [player_id,"pick", "from_which_color"]
//DO NOT MODIFY PLAYER_CARDS, PUBLIC_CARDS!!!!! ONLY ACCESS IT!!
function hjy_ai(self_id)
{
    this.id = self_id
    this.cmd_to_put = []
    var therehold = 0

    //return a table that key is color
    //value is the array of the same color card
    function associate_Color_2_Card(player_cards)
    {
        var color_2_cards_Table = {}
        for (var ii = 0; ii < player_cards.length; ii++)
        {
            var card = player_cards[ii]
            if (!color_2_cards_Table[card.color])
            {
                color_2_cards_Table[card.color] = [];
            }
            color_2_cards_Table[card.color].push(card);
            RULE.assert_cards_sorted(color_2_cards_Table[card.color])
        }
        // LOG("这边很他妈的奇怪", color_2_cards_Table)
        return color_2_cards_Table;
    }

    function create_color_point_table(color_2_cards_Table)
    {
        var color_point_table = {}
        for (var color in color_2_cards_Table)
        {
            //http://stackoverflow.com/questions/8312459/iterate-through-object-properties
            // if(!color_2_cards_Table.hasOwnProperty(color)){continue}  
            var point = RULE.calculate_cards_point(color_2_cards_Table[color])
            color_point_table[color] = point;
        }
        return color_point_table;
    }


    function getMaxKey(dict)
    {
        var maxKey, maxValue;
        for (var key in dict)
        {
            //http://stackoverflow.com/questions/8312459/iterate-through-object-properties
            if (!dict.hasOwnProperty(key))
            {
                continue
            }
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


    this.find_focus_color = function(player_cards)
    {
        var focus_colors = []
        var color_2_cards_Table = associate_Color_2_Card(player_cards)
        var color_point_table = {}
            // LOG(color_2_cards_Table)
        for (var color in color_2_cards_Table)
        {
            //http://stackoverflow.com/questions/8312459/iterate-through-object-properties
            if (!color_2_cards_Table.hasOwnProperty(color))
            {
                continue
            }
            var point = RULE.calculate_cards_point(color_2_cards_Table[color])
                // LOG(color,point)
            color_point_table[color] = point;
        }

        for (var ii = 0; ii < 2; ii++)
        {
            var color = getMaxKey(color_point_table)
            focus_colors.push(color)
                // LOG("found",color)
            delete color_point_table[color]
        }

        LOG(this.id, " find focus color: ", focus_colors)
        return focus_colors
            // LOG(this.focus_colors)
    }

    this.print = function()
    {
        LOG(this.id, " AI DEBUG -------------------")
        LOG("| focus on ", this.focus_colors)
        LOG("| going to put ", this.cmd_to_put)
        LOG("---------------------")
    }


    function cmd_sorter(cmd1, cmd2)
    {
        return cmd1[2].cmpr(cmd2[2])
    }


    this.throwRandCard = function(PLAYER_CARDS)
    {
        //他妈的白痴，随便挑一张牌，扔了就是
        var index = randInt(0, PLAYER_CARDS.length - 1);
        var cmd = [this.id, "give_up", PLAYER_CARDS[index]]
        return cmd
    }

    this.get_next_cmd = function(PLAYER_CARDS, PUBLIC_CARDS, unused_card_num, op_id, self_point, op_point)
    {
        var leftTime = Math.floor(unused_card_num / 2);
        LOG("目测 这场还有", leftTime, "回合")

        var lazy = 5
        if (self_point["total"] > op_point["total"] + lazy && leftTime < 5)
        {
            LOG("领先", (self_point["total"] - op_point["total"]), "了。就不用认真了。随便了啦")
            return this.throwRandCard(PLAYER_CARDS)
        }

        //for the first round pick the colors want to focus on
        if (!this.focus_colors)
        {
            LOG("没有集中颜色 想一下")
            this.focus_colors = this.find_focus_color(PLAYER_CARDS)
        }

        //如果之前的步骤想好了，按之前的步骤来
        //TO DO if it is legal or better solution
        if (!this.cmd_to_put.isEmpty())
        {
            LOG('用之前的策略 这回应该不用想了', cmds2str(this.cmd_to_put))
            this.cmd_to_put.sort(cmd_sorter)
            var cmd = this.cmd_to_put.dequeue()
            var card = cmd[2]
            var color = card.color

            if (RULE.is_putCmd_legal(cmd, PUBLIC_CARDS, PLAYER_CARDS) == true)
            {
                if (leftTime < this.cmd_to_put.length)
                {
                    LOG("来不及发牌了了 妈的")
                    this.cmd_to_put = []
                    LOG("之前的策略报废")
                }
                else
                {
                    LOG("嗯 的确不要想")
                    return cmd
                }
            }
            else
            {
                LOG("按规则发不了这牌啊")
                 this.cmd_to_put = []
                 LOG("之前的策略报废")
            }
        }

        //卡用完了，考虑换颜色
        if (this.cmd_to_put.isEmpty())
        {
            LOG("之前想的策略用完了，考虑换颜色")
            this.focus_colors = this.find_focus_color(PLAYER_CARDS)
        }

        var self_color_2_cards_Table = associate_Color_2_Card(PLAYER_CARDS)
            // LOG("这回颜色对应牌是",self_color_2_cards_Table)
        var color_2_point = create_color_point_table(self_color_2_cards_Table)
        LOG("这回合想到颜色对应分数是", color_2_point)


        LOG("先看看有没有颜色可以发")
        for (var ii = 0; ii < this.focus_colors.length; ii++)
        {
            var color = this.focus_colors[ii]
            if (color_2_point[color] > therehold)
            {
                LOG("看起来", color, "挺好的")

                var cards = self_color_2_cards_Table[color]
                RULE.assert_same_color(cards)
                RULE.assert_cards_sorted(cards)

                for (var ii = 0; ii < cards.length; ii++)
                {
                    var card = cards[ii]
                    var cmd = [this.id, "put", card]

                    //要比现在有的牌的小
                    if (PUBLIC_CARDS[color][this.id].isEmpty() || PUBLIC_CARDS[color][this.id].last().cmpr(card) <= 0)
                    {
                        this.cmd_to_put.push(cmd)
                    }
                }


                if (!this.cmd_to_put.isEmpty())
                {
                    LOG("想到的新策略是", cmds2str(this.cmd_to_put))

                    this.cmd_to_put.sort(cmd_sorter)

                    var cmd = this.cmd_to_put.dequeue();
                    LOG("找到可以用的牌 发第一张", c2s(cmd))

                    if (RULE.is_putCmd_legal(cmd, PUBLIC_CARDS, PLAYER_CARDS))
                    {
                        LOG("我发啦")
                        return cmd;
                    }
                    else
                    {
                        LOG("他妈的 怎么回事 这牌按规则不能发")
                        LOG(cmd)
                    }
                }
            }
        }


        if (leftTime > 7)
        {
            //根据之前的focus color 计算
            LOG("没有牌可以发\n 回合还早 要不在看看有没有牌可以捡")
            for (var ii = 0; ii < this.focus_colors.length; ii++)
            {
                var color = this.focus_colors[ii]
                var same_color_cards_holding = self_color_2_cards_Table[color]
                if (!same_color_cards_holding || same_color_cards_holding.isEmpty())
                {
                    continue
                }
                if (leftTime < same_color_cards_holding.length - 4)
                {
                    // LOG("捡了也来不及发 算了")
                    continue
                }
                // LOG(color)
                var giveUpZone = PUBLIC_CARDS[color]["give_up"]
                if (giveUpZone.isEmpty())
                {
                    continue;
                }
                //如果有同颜色的卡可以pick

                //要比现在有的牌的小
                var col = PUBLIC_CARDS[color][this.id]
                    // LOG("要死了 这边搞屁啊",col, "  ", col.isEmpty())
                var card2Pick = giveUpZone.last()
                LOG("看看 (", cards2str(giveUpZone), ")的", card2Pick.toString(), "有没有可以捡")

                if (col.isEmpty() || col.last().cmpr(card2Pick) <= 0)
                {
                    var cmd = [this.id, "pick", color]
                    if (RULE.is_PickCmd_legal(cmd, PUBLIC_CARDS, PLAYER_CARDS))
                    {
                        LOG("捡", card2Pick)
                        return cmd
                    }
                    else
                    {
                        LOG("捡不了")
                    }
                }
            }

        }

        //TO DO
        //look if eneymie need
        LOG("没法捡\n扔不要的吧")

        for (var ii = 0; ii < PLAYER_CARDS.length; ii++)
        {
            var card = PLAYER_CARDS[ii]
            if (this.focus_colors.has(card.color))
            {
                continue;
            }
            var cmd = [this.id, "give_up", card]

            if (RULE.is_giveUpCmd_legal(cmd, PUBLIC_CARDS, PLAYER_CARDS))
            {
                LOG("扔", c2s(cmd))
                return cmd
            }
        }

        LOG("他妈的想不出来了!!??? 不可能啊")
        this.print()
        LOG("颜色 -》点数", color_2_point)
        LOG("写这个的傻逼帮我看看咋回事")
        assert(1 == 0)
    }

}


var RULE = {
    assert_cards_sorted: function(cards)
    {
        if (cards.isEmpty())
        {
            return;
        }
        var prev = cards[0]
        for (var ii = 0; ii < cards.length; ii++)
        {
            var card = cards[ii]
            if (card.cmpr(prev) < 0)
            {
                LOG(cards)
                    // http://stackoverflow.com/questions/591857/how-can-i-get-a-javascript-stack-trace-when-i-throw-an-exception
                var e = new Error();
                LOG(e.stack);
                throw "unsorted!!!"
            }
            prev = card
        }
    },

    assert_same_color: function(cards)
    {
        if (cards.isEmpty())
        {
            return;
        }
        var prev = cards[0]
        for (var ii = 0; ii < cards.length; ii++)
        {
            var card = cards[ii]
            if (card.color != prev.color)
            {
                LOG(e.stack);
                throw "different color"
            }
            prev = card
        }
    },

    calculate_player_point: function(desk, player_id)
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

    calculate_cards_point: function(same_color_cards)
    {
        if (!same_color_cards || same_color_cards.isEmpty())
        {
            return 0;
        }
        RULE.assert_cards_sorted(same_color_cards)
        RULE.assert_same_color(same_color_cards)

        var mul = 1,
            card_point = 0
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
    },

    is_putCmd_legal: function(cmd, public_cards, player_cards)
    {
        var id = cmd[0],
            action = cmd[1];
        if (action == "put")
        {
            //remove card from player 
            var card = cmd[2]
            var index = player_cards.indexOf(card);
            if (index < 0)
            {
                return false
            }
            var putted_cards = public_cards[card.color][id]

            if (!putted_cards.isEmpty() && putted_cards.last().cmpr(card) > 0)
            {
                return false;
            }
            return true;
        }
        else
        {
            return false;
        }
    },


    is_giveUpCmd_legal: function(cmd, public_cards, player_cards)
    {
        var id = cmd[0],
            action = cmd[1];
        if (action == "give_up")
        {
            var card = cmd[2]
            var index = player_cards.indexOf(card);
            if (index < 0)
            {
                return false
            }
            return true;

        }
        else
        {
            return false;
        }
    },

    is_PickCmd_legal: function(cmd, public_cards, player_cards)
    {
        var id = cmd[0],
            action = cmd[1];
        if (action == "pick")
        {
            var color = cmd[2]
            if (public_cards[color]["give_up"].length == 0)
            {
                return false
            }
            return true;
        }
        else
        {
            return false;
        }
    }
};


function Desk(player_id1, player_id2)
{
    var _unused_cards = []
    for (var ii = 0; ii < COLORS.length; ii++)
    {
        var color = COLORS[ii]
        for (var jj = 1; jj <= CARD_NUM; jj++)
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

    // LOG(this.player_cards)
    this.public_cards = {}
    for (var ii = 0; ii < COLORS.length; ii++)
    {
        var color = COLORS[ii]
        this.public_cards[color] = {}
        this.public_cards[color]["give_up"] = []
        this.public_cards[color][player_id1] = []
        this.public_cards[color][player_id2] = []
    }

    function card_sorter(c1, c2)
    {
        return c1.cmpr(c2)
    }

    function sort_cards(player_cards)
    {
        player_cards.sort(card_sorter)
    }

    this.unusedNum = function()
    {
        return _unused_cards.length;
    }

    this.print = function()
    {
        LOG("----------------DESK---------------------")
        LOG(player_id1, " is holding ", cards2str(this.player_cards[player_id1]))
        LOG(player_id2, " is holding ", cards2str(this.player_cards[player_id2]))

        for (var ii = 0; ii < COLORS.length; ii++)
        {
            var color = COLORS[ii]
            LOG("-----", color, "---------")
            var col = this.public_cards[color]
            for (var key in col)
            {
                if (!col.hasOwnProperty(key))
                {
                    continue
                }
                LOG(key, " (", cards2str(col[key]), ")")
            }
        }
        LOG("There are " + this.unusedNum() + ' cards left')
        LOG("-------------------------------------------")

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

            if (!RULE.is_putCmd_legal(cmd, this.public_cards, this.player_cards[id]))
            {
                var e = new Error();
                LOG(e.stack);
                throw "add the wrong card"
            }

            var index = this.player_cards[id].indexOf(card);
            this.player_cards[id].splice(index, 1);

            //add to public space player site
            this.public_cards[card.color][id].push(card)
                //give playew new card   
            this.player_cards[id].push(_unused_cards.pop())

        }
        else if (action == "give_up")
        {
            //remove card from player
            // LOG(cmd)
            var card = cmd[2]
            if (!RULE.is_giveUpCmd_legal(cmd, this.public_cards, this.player_cards[id]))
            {
                var e = new Error();
                LOG(e.stack);
                throw "wrong give up"
            }


            var index = this.player_cards[id].indexOf(card);
            this.player_cards[id].splice(index, 1);
            //add to public space player site
            this.public_cards[card.color]["give_up"].push(card)
                //give playew new card   
            this.player_cards[id].push(_unused_cards.pop())

        }
        else if (action == "pick")
        {
            //pick the card
            var color = cmd[2]
            if (!RULE.is_PickCmd_legal(cmd, this.public_cards, this.player_cards[id]))
            {
                var e = new Error();
                LOG(e.stack);
                throw "wrong pick"
            }

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


function Game(ai1, ai2)
{
    var id1 = ai1.id,
        id2 = ai2.id;
    var desk = new Desk(id1, id2)
        // LOG(desk)

    var round = 1
    while (desk.unusedNum() != 0)
    {
        LOG("------begin " + round + "------")
        desk.print()
        LOG()

        var ai1_point = RULE.calculate_player_point(desk, id1)
        var ai2_point = RULE.calculate_player_point(desk, id2)

        try {
            //the first ai think 
            var cmd = ai1.get_next_cmd(desk.player_cards[id1], desk.public_cards, desk.unusedNum(), id2, ai1_point, ai2_point)
            LOG(cmd[0] + " " + cmd[1] + " [" + cmd[2].toString() + "]")
            desk.apply_cmd(cmd)
        }catch(err)
        {
            LOG(id1," throw a exception a throw. He/She lose")
            return id2
        }

        if (desk.unusedNum() == 0)
        {
            LOG("------end " + round + "------\n")
            break;
        }

         try {
            //the second ai think 
            ai1_point = RULE.calculate_player_point(desk, id1)
            ai2_point = RULE.calculate_player_point(desk, id2)
            cmd = ai2.get_next_cmd(desk.player_cards[id2], desk.public_cards, desk.unusedNum(), id1, ai2_point, ai1_point)
            LOG(cmd[0] + " " + cmd[1] + " [" + cmd[2].toString() + "]")
            desk.apply_cmd(cmd)
         }catch(err)
        {
            LOG(id2," throw a exception a throw. He/She lose")
            return id1
        }

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

    if (ai1_result["total"] > ai2_result["total"])
    {
        // LOG(id1, " WIN")
        return id1
    }
    else if (ai1_result["total"] < ai2_result["total"])
    {
        // LOG(id2, " WIN")
        return id2
    }
    else
    {
        // LOG("Draw")
        return null
    }
}


var ai1 = new hjy_ai("hjy")
var ai2 = new idiot_ai("alice")

var winner = Game(ai1, ai2)
if (winner)
{
    LOG(winner, "WIN !")
}
else
{
    LOG("Draw")
}