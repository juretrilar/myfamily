let colors = ["#00FF00", "#6699ff", "#ff6600", "#FF25FF", "#FF6C6A", "#53ff1a", "#00C8FF", "#ff66ff","#ff9900"];
jQuery(function($) {
    'use strict';
    tockeUdelezencev($('#table-cilji').find('tr').length-1, "progress", "razmerje");
    tockeUdelezencev($('#table-cilji-end').find('tr').length-1, "progressE", "razmerjeE");
});

function tockeUdelezencev(stCiljev, prg, razmerje) {
    for(let i = 0; i <stCiljev; i++) {
        let curr = $('.'+prg+i).children();
        let stUporabnikov = curr.length;
        let sumXP = 0;
        curr.each(function() {
            sumXP += parseInt($(this)[0].innerHTML);
        });
        //curr.text(sumXP+"/"+$("."+prg+i).prev().find("input[name=person]").val());
        $("#"+razmerje+i).text(sumXP+"/"+$("."+prg+i).parent().prev().prev().find("input[name=maxXp]").val());
        console.log($("."+prg+i).parent().prev().prev().find("input[name=maxXp]"));
        if(stUporabnikov==0) {
            $("."+prg+i).attr('style',"display: none!important");
        } else if (stUporabnikov == 1) {
            $("."+prg+i+" :nth-child(1)").addClass("spanOnly");
        } else {
            $("."+prg+i+" :nth-child(1)").attr('style',"width: "+(curr[0].innerHTML/sumXP)*100+"%; background-color: #FF8C1A").addClass("spanFirst");
            for (let j=2; j<stUporabnikov; j++) {
                let span = $("."+prg+i+" :nth-child("+j+")");
                span.attr('style',"width: "+(curr[j-1].innerHTML/sumXP)*100+"%; background-color: "+colors[j-2]+";");
            }
            $("."+prg+i+" :nth-child("+stUporabnikov+")").attr('style',"width: "+(curr[stUporabnikov-1].innerHTML/sumXP)*100+"%; background-color: yellow;").addClass("spanLast");
        }
    }
}
