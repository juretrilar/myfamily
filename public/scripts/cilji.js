jQuery(function($) {
    'use strict';
    let colors = ["#00FF00", "#6699ff", "#ff6600", "#FF25FF", "#FF6C6A", "#53ff1a", "#00C8FF", "#ff66ff","#ff9900"];
    let stCiljev = $('#table-cilji tr').length + $('#table-cilji-end tr').length - 2;
    for(let i = 0; i <stCiljev; i++) {
        let curr = $('.progress'+i).children();
        let stUporabnikov = curr.length;
        let sumXP = 0;
        curr.each(function() {
            sumXP += parseInt($(this)[0].innerHTML);
        });
        if(stUporabnikov==0) {
            $(".progress"+i).attr('style',"display: none!important");
        } else if (stUporabnikov == 1) {
            $(".progress"+i+" :nth-child(1)").addClass("spanOnly");
        } else {
            $(".progress"+i+" :nth-child(1)").attr('style',"width: "+(curr[0].innerHTML/sumXP)*100+"%; background-color: #FF8C1A").addClass("spanFirst");
            for (let j=2; j<stUporabnikov; j++) {
                let span = $(".progress"+i+" :nth-child("+j+")");
                span.attr('style',"width: "+(curr[j-1].innerHTML/sumXP)*100+"%; background-color: "+colors[j-2]+";");
            }
            $(".progress"+i+" :nth-child("+stUporabnikov+")").attr('style',"width: "+(curr[stUporabnikov-1].innerHTML/sumXP)*100+"%; background-color: yellow;").addClass("spanLast");
        }
    }
});
