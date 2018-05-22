"use strict";function prikaziPodatke(t){var e=e="/koledar/"+t;t&&$.ajax({type:"GET",url:e,success:function(t){console.log(t),t.includes("<!doctype html>")?window.location.reload():$("#NalogaPopUp").html(t).css("display","inline-flex")},error:function(t,e,a){alert(t.status),alert(t.responseText),alert(a)}}),event.preventDefault()}!function(H){H.fn.extend({monthly:function(t){var F=H.extend({dataType:"json",disablePast:!1,eventList:!0,events:"",jsonUrl:"",linkCalendarToEventUrl:!1,maxWidth:!1,mode:"event",setWidth:!1,showTrigger:"",startHidden:!1,stylePast:!1,target:"",useIsoDateFormat:!1,weekStart:0,xmlUrl:""},t),v=H(this).attr("id"),W="#"+v,e=new Date,p=e.getMonth()+1,u=e.getFullYear(),f=e.getDate(),d=(F.locale||function(){if(navigator.languages&&navigator.languages.length)return navigator.languages[0];return navigator.language||navigator.browserLanguage}()).toLowerCase(),g=(F.monthNameFormat,F.weekdayNameFormat,F.monthNames||["Jan","Feb","Mar","Apr","Maj","Jun","Jul","Avg","Sep","Okt","Nov","Dec"]),k=F.dayNames||["Ned","Pon","Tor","Sre","Čet","Pet","Sob"],w='<div class="m-d monthly-day-blank"><div class="monthly-day-number"></div></div>',b="Mon"===F.weekStart||1===F.weekStart||"1"===F.weekStart,a=d.substring(0,2).toLowerCase();function A(t,e){return 2===t?3&e||!(e%25)&&15&e?28:29:30+(t+(t>>3)&1)}function n(t,e){H(W).data("setMonth",t).data("setYear",e);var a=0,n=A(t,e),o=t-1,l=new Date(e,o,1,0,0,0,0).getDay(),r=t===p&&e===u;H(W+" .monthly-day, "+W+" .monthly-day-blank").remove(),H(W+" .monthly-event-list, "+W+" .monthly-day-wrap").empty();for(var s=1;s<=n;s++){var i=F.stylePast&&(e<u||e===u&&(t<p||t===p&&s<f)),d='<div class="monthly-day-number">'+s+'</div><div class="monthly-indicator-wrap" ></div>';if("event"===F.mode){var c=new Date(e,o,s,0,0,0,0);H(W+" .monthly-day-wrap").append("<div"+L("class","m-d monthly-day monthly-day-event"+(i?" monthly-past-day":"")+" dt"+c.toISOString().slice(0,10))+L("data-number",s)+">"+d+"</div>"),H(W+" .monthly-event-list").append("<div"+L("class","monthly-list-item")+L("id",v+"day"+s)+L("data-number",s)+'><div class="monthly-event-list-date">'+k[c.getDay()]+"<br>"+s+"</div></div>")}else H(W+" .monthly-day-wrap").append("<a"+L("href","#")+L("class","m-d monthly-day monthly-day-pick"+(i?" monthly-past-day":""))+L("data-number",s)+">"+d+"</a>")}r&&H(W+' *[data-number="'+f+'"]').addClass("monthly-today"),H(W+" .monthly-header-title").html('<a href="#" class="monthly-header-title-date" onclick="return false">'+g[t-1]+" "+e+"</a>"+(r&&H(W+" .monthly-event-list").hide()?"":'<a href="#" class="monthly-reset"></a>')),b?0===l?T(6):1!==l&&T(l-1):7!==l&&T(l);var m=H(W+" .monthly-day").length+H(W+" .monthly-day-blank").length,h=7*Math.ceil(m/7)-m;if(m%7!=0)for(a=0;a<h;a++)H(W+" .monthly-day-wrap").append(w);"event"===F.mode&&function(e,a){if(F.events)D(F.events,e,a);else{var t="xml"===F.dataType?F.xmlUrl:F.jsonUrl;if(t){var n=String(t).replace("{month}",e).replace("{year}",a);H.get(n,{now:H.now()},function(t){D(t,e,a)},F.dataType).fail(function(){console.error("Monthly.js failed to import "+t+". Please check for the correct path and "+F.dataType+" syntax.")})}}}(t,e);var y=H(W+" .m-d");for(a=0;a<y.length;a+=7)y.slice(a,a+7).wrapAll('<div class="monthly-week"></div>')}function o(t,e,a){var n=Y(t,"startdate"),o=Y(t,"enddate"),l=n.split("-"),r=parseInt(l[0],10),s=parseInt(l[1],10),i=parseInt(l[2],10),d=i,c=i,m=i,h=s===e&&r===a,y=h;if(o){var v=o.split("-"),p=parseInt(v[0],10),u=parseInt(v[1],10),f=parseInt(v[2],10),g=u===e&&p===a;(h||g||(r<a||s<e&&r===a)&&(a<p||e<u&&p===a))&&(y=!0,d=h?i:1,c=g?f:A(e,a),m=h?d:1)}if(y){var k=Y(t,"starttime"),w="",b=Y(t,"url"),D=Y(t,"name"),T=Y(t,"class"),x=Y(t,"color"),P=Y(t,"id"),S=T?" "+T:"",I="<div",M="</span></div>";if(k){var C=Y(t,"endtime");w='<div><div class="monthly-list-time-start">'+z(k)+"</div>"+(C?'<div class="monthly-list-time-end">'+z(C)+"</div>":"")+"</div>"}F.linkCalendarToEventUrl&&b&&(I="<a"+L("href",b),M="</span></a>");for(var N,U=I+L("data-eventid",P)+L("title",D)+(x?L("style","background:"+x+";color:"+x):""),j="<a"+L("href",b)+L("class","listed-event"+S)+L("data-eventid",P)+(x?L("style","background:"+x):"")+L("title",D)+">"+D+" "+w+"</a>",E=d;E<=c;E++)N=E===m,H(W+' *[data-number="'+E+'"] .monthly-indicator-wrap').append(U+L("class","monthly-event-indicator"+S+(N?"":" monthly-event-continued"))+"><span>"+(N?D:"")+M),H(W+' .monthly-list-item[data-number="'+E+'"]').addClass("item-has-event").append(j)}}function D(t,a,n){"xml"===F.dataType?H(t).find("event").each(function(t,e){o(e,a,n)}):"json"===F.dataType&&H.each(t.monthly,function(t,e){o(e,a,n)})}function L(t,e){for(var a=String(e),n="",o=0;o<a.length;o++)switch(a[o]){case"'":n+="&#39;";break;case'"':n+="&quot;";break;case"<":n+="&lt;";break;case">":n+="&gt;";break;default:n+=a[o]}return" "+t+'="'+n+'"'}function T(t){var e=H(W+" .monthly-day-wrap"),a=0;for(a=0;a<t;a++)e.prepend(w)}function Y(t,e){return"xml"===F.dataType?H(t).find(e).text():t[e]}function z(t){var e=t.split(":"),a=parseInt(e[0],10),n="AM";return 12<a?(a-=12,n="PM"):12==a?n="PM":0===a&&(a=12),a+":"+String(e[1])+" "+n}function c(){H(W+" .monthly-event-list").is(":visible")&&(H(W+" .monthly-cal").remove(),H(W+" .monthly-header-title").prepend('<a href="#" class="monthly-cal"></a>'))}!1!==F.maxWidth&&H(W).css("maxWidth",F.maxWidth),!1!==F.setWidth&&H(W).css("width",F.setWidth),F.startHidden&&(H(W).addClass("monthly-pop").css({display:"none",position:"absolute"}),H(document).on("focus",String(F.showTrigger),function(t){H(W).show(),t.preventDefault()}),H(document).on("click",String(F.showTrigger)+", .monthly-pop",function(t){t.stopPropagation(),t.preventDefault()}),H(document).on("click",function(){H(W).hide()})),function(t){var e=t?1:0,a="",n=0;for(n=0;n<6;n++)a+="<div>"+k[n+e]+"</div>";a+="<div>"+k[t?0:6]+"</div>",H(W).append('<div class="monthly-day-title-wrap">'+a+'</div><div class="monthly-day-wrap"></div>')}(b),H(W).addClass("monthly-locale-"+a+" monthly-locale-"+d),H(W).prepend('<div class="monthly-header"><div class="monthly-header-title"><a href="#" class="monthly-header-title-date" onclick="return false"></a></div><a href="#" class="monthly-prev"></a><a href="#" class="monthly-next"></a></div>').append('<div class="monthly-event-list"></div>'),n(p,u),H(document.body).on("click",W+" .monthly-next",function(t){var e,a;e=H(W).data("setMonth"),a=H(W).data("setYear"),n(12===e?1:e+1,12===e?a+1:a),c(),t.preventDefault()}),H(document.body).on("click",W+" .monthly-prev",function(t){var e,a;e=H(W).data("setMonth"),a=H(W).data("setYear"),n(1===e?12:e-1,1===e?a-1:a),c(),t.preventDefault()}),H(document.body).on("click",W+" .monthly-reset",function(t){H(this).remove(),n(p,u),c(),t.preventDefault(),t.stopPropagation()}),H(document.body).on("click",W+" .monthly-cal",function(t){H(this).remove(),H(W+" .monthly-event-list").css("transform","scale(0)"),setTimeout(function(){H(W+" .monthly-event-list").hide()},250),t.preventDefault(),H("#NalogaPopUp").css("display","none")}),H(document.body).on("click touchstart",W+" .monthly-day",function(t){var e,a,n,o=H(this).data("number");if("event"===F.mode&&F.eventList){var l=H(W+" .monthly-event-list"),r=document.getElementById(v+"day"+o).offsetTop;l.show(),l.css("transform"),l.css("transform","scale(1)"),H(W+" .monthly-event-list .monthly-list-item").hide(),H(W+' .monthly-list-item[data-number="'+o+'"]').show(),l.scrollTop(r),c(),F.linkCalendarToEventUrl||t.preventDefault(),"SPAN"==t.target.nodeName?prikaziPodatke(t.target.parentElement.getAttribute("data-eventid")):prikaziPodatke(t.target.attributes[0].value)}else if("picker"===F.mode){var s=H(W).data("setMonth"),i=H(W).data("setYear");H(this).hasClass("monthly-past-day")&&F.disablePast?t.preventDefault():(H(String(F.target)).val((e=i,a=s,n=o,F.useIsoDateFormat?new Date(e,a-1,n,0,0,0).toISOString().substring(0,10):"undefined"==typeof Intl?a+"/"+n+"/"+e:new Intl.DateTimeFormat(d).format(new Date(e,a-1,n,0,0,0)))),0!=H("#targetZacetek").val().length&&H("#dialogZacetek").addClass("is-dirty"),0!=H("#targetKonec").val().length&&H("#dialogKonec").addClass("is-dirty"),F.startHidden&&H(W).hide()),t.preventDefault()}}),H(document.body).on("click",W+" .listed-event",function(t){var e=H(this).attr("href");e&&H.ajax({type:"GET",url:e,success:function(t){console.log(t),t.includes("<!doctype html>")?window.location.reload():H("#NalogaPopUp").html(t).css("display","inline-flex")},error:function(t,e,a){alert(t.status),alert(t.responseText),alert(a)}}),t.preventDefault()})}})}(jQuery);