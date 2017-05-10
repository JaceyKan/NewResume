$(function(){
    function gotoTop(min_height){
        //预定义返回顶部的html代码，它的css样式默认为不显示
        var gotoTop_html = '<div id="gotoTop"><i class="fa fa-angle-double-up fa-3x"></i></div>';
        //将返回顶部的html代码插入页面上id为page的元素的末尾
        $("body").append(gotoTop_html);
        $("#gotoTop").click(//定义返回顶部点击向上滚动的动画
            function(){$('html,body').animate({scrollTop:0},700);
            }).hover(//为返回顶部增加鼠标进入的反馈效果，用添加删除css类实现
            function(){$(this).addClass("hover");},
            function(){$(this).removeClass("hover");
            });
        //获取页面的最小高度，无传入值则默认为300像素
        min_height ? min_height = min_height : min_height = 300;
        //为窗口的scroll事件绑定处理函数
        $(window).scroll(function(){
            //获取窗口的滚动条的垂直位置
            var s = $(window).scrollTop();
            //当窗口的滚动条的垂直位置大于页面的最小高度时，让返回顶部元素渐现，否则渐隐
            if( s > min_height){
                $("#gotoTop").fadeIn(100);
            }else{
                $("#gotoTop").fadeOut(200);
            }
        });
    }

    gotoTop(200);

    //begin近期作品展示
    $(".project").mouseenter(function () {
        $(this).find($(".showBtns")).slideDown();
        $(this).find($("h3 a")).css({
            "color": "#0072D4"
        });

        //获取当前图片高度，设置包裹图片的div的高度
        //使div高度不随图片大小变化
        var enlargeImgHeight=$(this).find($(".enlargeImg img")).height();
        $(this).find($(".enlargeImg")).css({
            "height": enlargeImgHeight
        });

        $(this).find($(".enlargeImg img")).animate({
            "width": "100%"
        });
    }).mouseleave(function () {
        $(this).find($(".showBtns")).slideUp();
        $(this).find($("h3 a")).css({
            "color": "#778492"
        });

        //图片宽度设置为默认值后，设置包裹图片的div的高度为100%
        $(this).find($(".enlargeImg img")).animate({
            "width": "95%"
        },function () {
            $(".enlargeImg").css({
                "height":"100%"
            });
        });
    });

    //begin上下跳动的按钮
    $(".upDownBtn").mouseenter(function () {
        $(this).find($("span")).css({
            "top":"-2em",
            "color":"#fff"
        }).animate({
            "top":"0"
        });
    }).mouseleave(function () {
        $(this).find($("span")).css({
            "top":"2em",
            "color":"rgba(255,255,255,0.8)"
        }).animate({
            "top":"0"
        });
    });
    //end上下跳动的按钮
    //end近期作品展示

    //begin联系我们板块
    $("[data-toggle='tooltip']").tooltip(); // BootStrap启动提示功能

    //提交按钮
    $("#contactMeForm button").click(function () {
        $("form *").blur();

        var flag=!($("#name").attr("data-original-title")) &&
            !($("#email").attr("data-original-title")) &&
            !($("#tel").attr("data-original-title")) &&
            !($("#content").attr("data-original-title"));
        // console.log(!$("#name").attr("data-original-title"));
        // console.log($("#email").attr("data-original-title"));
        // console.log(flag);
        if(flag){
            alert("提交成功！");
        }
    });

    // begin必填性测试
    function mustWrite(curElement){
        var pattern=/^\s*$/gi;
        if( pattern.test(curElement.val()) ){
            return "必填项";
        }
        return "";
    }
    // end必填性测试

    //begin 邮箱测试
    function emailTest(curElement){
        var emailPattern=/^.+@.+$/gi;
        var spacePatter=/^\s*$/gi;
        var testValue=curElement.val();

        //不为空的情况下再测试邮箱格式是否正确
        //验证格式的前提是被测试的字符串不为空
        if(!spacePatter.test(testValue)){
            if(!emailPattern.test(testValue)){
                return "邮箱格式不正确";
            }
        }
        return "";
    }
    //end 邮箱测试

    // begin字数测试
    function stringLengthTest(testString,length){
        //注意在用构造函数创建正则表达式时，元字符需要转义
        //var pattern=/^\s*(.|\n){0,10}\s*$/gi;
        var pattern=new RegExp("^\\s\*\(\.\|\\n\){0,"+length+"}\\s\*$","gi");
        var flag=pattern.test(testString);
        //console.log(testString);
        //console.log(testString.length);
        if( !flag ){
            return "不能超过"+length+"个字";
        }
        return "";
    }
    // end字数测试

    // begin数字测试
    function digitTest(testString){
        var pattern=/^\s*\d*\s*$/;
        var flag=pattern.test(testString);
        if(!flag){
            return "只能输入数字";
        }
        return "";
    }
    // end数字测试

    // begin总测试
    function testVal(curElement,must,email,stringLength,digit){
        curElement.blur(function () {
            //验证格式的前提是被测试的字符串不为空
            var result="";
            if(email){ //验证邮箱
                result+=emailTest(curElement);
            }
            //console.log(result);

            if(must){   //验证必填项
                result+=mustWrite(curElement);
            }

            if(digit){ //验证数字
                result+=digitTest(curElement.val());
            }

            if(stringLength){  //验证字数
                //验证字符串的长度要放在其他验证之后
                //在其它验证满足的情况下再验证
                //console.log(result);
                if(result===""){
                    result=stringLengthTest(curElement.val(),stringLength);
                }
            }

            //如果结果为空字符串，则表示要验证的项都符合要求
            //不需要提示信息
            if(result===""){
                return;
            }

            result="<i class='fa fa-exclamation-circle'></i> "+result;
            $(this).attr({
                "data-original-title": result
            }).tooltip("show");
        }).focus(function () {
            $(this).removeAttr("data-original-title").tooltip("hide");
        });
    }
    // end总测试


    testVal($("#name"),true,false);  //测试姓名的必填性
    testVal($("#email"),true,true);  //测试邮箱的必填性和格式
    testVal($("#tel"),true,false,false,true);  //测试电话的必填性，且只能是数字
    testVal($("#content"),true,false,100);  //测试内容的必填性，且字数不能超过100字

});