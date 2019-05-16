// ==UserScript==
// @name 优课--二倍速自动播放
// @namespace Violentmonkey Scripts
// @version      2019.05.17
// @author       yong.lei
// @match http://www.uooconline.com/home/learn/index#*
// @description  实现自动二倍速挂机看视频,允许切换到后台.不支持自动做题.使用方式:进入课程视频页就会,
// @grant none
// ==/UserScript==


//异常情况唤起QQ聊天窗口,可填写好友的QQ号码,默认为电信客服
var qq = 800010000;
(function(window,$){
window.countRun = 0;
window.countInit = 0;
window.wait = 2000;
console.log('start run.');
window.setInterval(function() {
	//如果播放器已初始化完毕
	if (videojs.getPlayers().player != undefined) {
		if(!videojs.getPlayers().player.executeFlag){
			videojs.getPlayers().player.executeFlag = 1;
			window.countInit += 1;
			console.log(Date()+'->countInit:'+window.countInit);
			//清理鼠标移出事件
			$("html").off("mouseleave blur visibilitychange");
			var funObj = {};
	    	funObj.speed = function(){
	    		window.setTimeout(function() {
	    			console.log(Date()+'->2倍速度');
	                $('.vjs-menu').find('ul[role="menu"]').first().find('li').first().trigger('click')
	            },window.wait);
	    	};
	        funObj.ng = function(){
	        	window.setTimeout(function() {
	    			console.log(Date()+'->播放下一个');
		            var ng_scope = $('div[class="basic ng-scope"]');
		            if (ng_scope.length > 0) {
		            	var first = ng_scope.first();
		            	if (first.find('span[ng-if="source.type == 10"]').length>0) {
			                first.trigger('click');
			                funObj.speed();//调用二倍
		            	}else if (first.find('span[ng-if="source.type == 80"]').length>0) {
                            funObj.error();
			                alert("请完成测验");
		            	}else{
                            funObj.error();
		            		alert("error,请重试.");
		            	}
		            }else{
		            	funObj.uncomplete();//打开下一个章节
		            }
	                
	            },window.wait);
	        };
            funObj.error = function(){
                if(qq){
                  var url = 'tencent://message/?uin='+qq;
                  window.open(url);
                 }
            };
	        funObj.uncomplete = function(){
	        	window.setTimeout(function() {
	    			console.log(Date()+'->下一个子节点');
		        	var ng_binging = $('div[class="basic uncomplete"]').find('div[class="oneline ng-binding"]');
		            if (ng_binging.length > 0) {
		                ng_binging.first().trigger('click');
		                funObj.ng();//调用播放
		            }else{
						funObj.chapterUncomplete();//下一个大主章节
		            }
		        },window.wait);
	        };
	        funObj.chapterUncomplete = function(){
	    		console.log(Date()+'->下一个章节');
	        	var chapter_uncomplete = $('div[class="basic chapter uncomplete"]');
	        	if (chapter_uncomplete.length > 0) {
	        		chapter_uncomplete.first().trigger('click');
	        		funObj.uncomplete();//打开子节点
	        	}else{
	        		alert('end');
	        	}
	        };
	        //添加暂停事件
			videojs.getPlayers().player.on("pause",
			    function() {
					window.countRun += 1;
				    console.log(Date()+'->countRun:'+window.countRun);
			        funObj.ng();
			    });
			funObj.speed();
			videojs.getPlayers().player.play();
		}
	}
},window.wait);
})(window,window.jQuery);

