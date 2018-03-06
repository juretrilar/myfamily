window.onload = function() {
    'use strict';
    let stUporabnikov = $("#stUporabnikov").val();
    console.log(stUporabnikov);
    if(stUporabnikov==0) {
        $(".progress").attr('style',"display: none!important");
    } else if (stUporabnikov == 1) {
        $(".progress :nth-child(1)").addClass("spanOnly");
    } else {
        $(".progress :nth-child(1)").attr('style',"width: 20%").attr('style',"background-color: red").addClass("spanFirst");
        for (let i=2; i<stUporabnikov; i++) {
            $(".progress :nth-child("+i+")").attr('style',"width: 20%").attr('style',"background-color: green");
        }
        $(".progress :nth-child("+stUporabnikov+")").attr('style',"width: 20%").attr('style',"background-color: yellow").addClass("spanLast");
    }
};
