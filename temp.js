
/**
*  
*/
function CardArray(cards)
{
    this.cards = cards

    this.length = function()
    {
        return this.cards.length
    }

    this.isEmpty = function()
    {
        return this.cards.isEmpty()
    }

    this.if_sorted = function() 
    {
        if (this.cards.isEmpty()) {
            return true;
        }
        var prev = this.cards[0]
        for (var ii = 0; ii < this.cards.length; ii++) {
            var card = this.cards[ii]
            if (card.cmpr(prev) < 0) {
                return false;
            }
        prev = card
        return true;
    }


    this.if_same_color = function() {
        if (this.cards.isEmpty()) {
            return true;
        }
        var prev = this.cards[0]
        for (var ii = 0; ii < this.cards.length; ii++) {
            var card = this.cards[ii]
            if (card.color != prev.color) {
                return false;
            }
            prev = card
        }
        return true;
    }


    function card_sorter(c1, c2) {
    return c1.cmpr(c2)
    }


    this.sort = function() {
        this.cards.sort(card_sorter)
    }

}


