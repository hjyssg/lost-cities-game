##迷失城市

上次和朋友去桌游店玩的游戏。[规则](http://zhidao.baidu.com/question/109478474.html?qbl=relate_question_0)挺简单的。玩的时候觉得这个明显可以写一个ai来玩。  
用JavaScript写了一个。

想到的算法有这样几种。程序里实现了傻瓜算法和保守算法。

#####傻瓜算法
不发牌 随机扔
必然零分 


#####保守算法
集中两种颜色 
确认发牌不会导致0分才开始放牌
收集再发牌。通过手机丢没用的牌和捡别的人不要牌

#####冒险算法
和上一种类似。
差别在于超过一定数值就发牌。


####共同
*阻碍。不要丢别人需要的牌
*放弃颜色。别人把那个颜色都用了。
*剩下的牌数。不要来不及发牌。

####挑取集中颜色的办法：
相加数值大


####避免发傻
发牌要从小到大
遵守规则



这个文件拥有的类：

* Card
* Game
* Desk
* AI


每个AI需要一个id并且需要实施 

	get_next_cmd = function(PLAYER_CARDS, PUBLIC_CARDS, unused_card_num, op_id, self_point, op_point)
	
并且返还一个cmd告诉Desk。Ta想怎么做。cmd以下任意一种格式

	cmd = [player_id,"put", card];
	cmd = [player_id,"give_up", card]s
	cmd = [player_id,"pick", "from_which_color"]
	
JS居然没有const。谁改PLAYER_CARDS, PUBLIC_CARDS谁作弊。
DO NOT MODIFY PLAYER_CARDS, PUBLIC_CARDS!!!!! ONLY ACCESS IT!!



