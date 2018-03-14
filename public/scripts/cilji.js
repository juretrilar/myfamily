jQuery(function($) {
    'use strict';
    let colors = ["#00FF00", "#6699ff", "#ff6600", "#FF25FF", "#FF6C6A", "#53ff1a", "#00C8FF", "#ff66ff","#ff9900"];
    let stCiljev = $('#table-cilji tr').length + $('#table-cilji-end tr').length - 2;
    console.log(stCiljev);
    //console.log(stUporabnikov);
    for(let i = 0; i <stCiljev; i++) {
        let stUporabnikov = $('.progress'+i).length;
        if(stUporabnikov==0) {
            $(".progress"+i).attr('style',"display: none!important");
        } else if (stUporabnikov == 1) {
            $(".progress"+i+" :nth-child(1)").addClass("spanOnly");
        } else {
            $(".progress"+i+" :nth-child(1)").attr('style',"width: 20%; background-color: #FF8C1A").addClass("spanFirst");
            for (let i=2; i<stUporabnikov; i++) {
                let span = $(".progress :nth-child("+i+")");
                span.attr('style',"width: "+span.text()+"; background-color: "+colors[i-2]);
            }
            $(".progress"+i+" :nth-child("+stUporabnikov+")").attr('style',"width: 20%; background-color: yellow").addClass("spanLast");
        }
    }
});
