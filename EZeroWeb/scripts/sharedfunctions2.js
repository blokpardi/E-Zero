var sState = null;
var currPg = null, prevPg = null, backScript = [], listAlpha = [], winpos = 0, mapURL = '';
var scrollBottom = $(window).scrollTop() + $(window).height(); 
function initSetup() {
    if (navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/MSIE/i)) {
        mapURL = 'http://bing.com/maps/default.aspx';
    }
    else {
        mapURL = 'http://maps.google.com/maps';
    }
    $.support.cors = true;
    $.ajaxSetup({
        timeout: 20000,
        crossDomain: true,
        error: function (xhr, ajaxOptions, thrownError) {
            stopActivity();
            //taalert(thrownError);
            $("#nonetPage").show();
        }
    });
    //$('#nonetPage').show();
    createStateChooser();
    checkState();
}

String.prototype.replaceAll = function (stringToFind, stringToReplace) {
    var temp = this;
    var index = temp.indexOf(stringToFind);
    while (index != -1) {
        temp = temp.replace(stringToFind, stringToReplace);
        index = temp.indexOf(stringToFind);
    }
    return temp;
}

function tryAgain() {
    $('#nonetPage').hide();
    checkState();
}

function checkState() {
   if (getCookie('mystate') == null) {
        initChooseState();
    }
    else {
        setState(getCookie('mystate'));
        pageNav('#listPage');
        setupListPage();
    }
}

function setState(sName) {
    sState = sName;
    setCookie('mystate', sState);
    $('#stateText').text(sState);
}

function gotStateFromLoc(ret) {
    if (ret != false) {
        pageNav("#listPage");
        setupListPage();
    }
    else {
        pageNav('#chooseState');
    }
}

function initChooseState() {
    pageNav('#chooseState');
}

function setupListPage() {
    $('#headerText').hide();
    $('#listText').show();    
    getData();
}

function getAjaxData() {
    //var sURL = 'http://techalio.com/hproxy/ProxyService.svc/getHTML/12345?uri=http://pure-gas.org/index.jsp?stateprov=' + sState;
    var sURL = 'http://techalio.com/hproxy/ProxyService.svc/getHTML/12345?uri=http://pure-gas.org/extensions/rss.jsp?stateprov=' + sState;
    $.ajax({
        type: "GET",
        url: sURL,
        contentType: "application/json",
        dataType: "jsonp",
        success: function (R) {
            saveData(R);
            setupList(R);
        }
    });
}

function setupList(data) {
    $(data).find('item').each(function () {
        var sTitle = $(this).find('title').text();
        sTitle = sTitle.replaceAll(' - ', '*');
        var titleData = sTitle.split('*');
        var sName = titleData[0];
        var sBrand = titleData[1];
        var sCity = titleData[2].split(',')[0];
        taalert(sCity);


        //        var sData = $(this).find('description').text();
        //        sData = escape(sData);
        //        sData = sData.replaceAll('%0A', '');
        //        sData = unescape(sData);
        //        sData = sData.replaceAll('          ', '');
        //        sData = sData.replaceAll(' - ', '*');
        //        taalert(unescape(sData));
    });
}

//function setupList(data) {
//   var ctyName = '', currCity = '', octane = '', addr='', currAlpha='';
//   var listHTML = "<div style='float:left; width:auto; font-size:10pt; background-color:#FFF'>";
//   $(".adBox").hide();
//    $("#dataStore").html(data);
//    var alpha = false;
//    if ($('#dataStore .stationlist tr').length >= 35) {
//        alpha = true;
//        listAlpha=[];
//    }
//    $.each($('#dataStore .stationlist tr'), function (index, val) {
//        if (index != 0) {
//            $("#mSpan").text("Loading " + index + " records");
//            for (x in val.children) {
//                if (isNaN(parseInt(x)) == false) {
//                    switch (parseInt(x)) {
//                        case 0:
//                            currCity = val.children[x].innerText;
//                            if (currCity != ctyName) {
//                                if (alpha) {
//                                    var newAlpha = currCity.substr(0, 1);
//                                    if (currAlpha != newAlpha) {
//                                        currAlpha = newAlpha;
//                                        listAlpha.push(currAlpha);
//                                        var alphaDiv = "<div class='listAlpha sixteen columns' style='float:left; margin-top:10px ; height:20px;background-color:#ffffff;'><div class='mainColor' style='float:left;color:#fff;font-size:12pt;width:20px;height:23px;text-align:center; cursor:pointer'>" + currAlpha + "</div></div>"
//                                        listHTML += alphaDiv;
//                                    }
//                                }
//                                listHTML += "<div class='sixteen columns mainColor' style='float:left; margin-top:10px; height:25px;color:#fff;font-size:12pt;'><div style='margin-left:5px'>" + currCity + "</div></div>";
//                            }
//                            else {
//                                listHTML += "<div class='sixteen columns sepBorder' style='height:1px; margin-top:3px'>&nbsp;</div>"
//                            }
//                            break;
//                        case 1:
//                            sBrand = val.children[x].innerText;
//                            if (sBrand == '')
//                            { sBrand = 'n/a'; }
//                            break;
//                        case 2:
//                            octane = val.children[x].innerText;
//                            if (octane == '')
//                            { octane = 'n/a'; }
//                            break;
//                        case 3:
//                            var stName = val.children[x].innerText;
//                            var strArr = stName.split(" ");
//                            if (strArr.length >= 6) {
//                                strArr.splice(5, strArr.length - 1).toString();
//                                stName = strArr.join(" ") + "...";

//                            }
//                            stName = escape(stName);
//                            var upperDiv = "<div class='one-third column' style='color:#000;font-size:11pt;float:left; height:25px; '><div style='float:left;overflow:hidden; width:auto;height:20px;margin:4px 0px 0px 0px;font-weight:bold;'>" + unescape(stName) + "</div></div>"
//                            listHTML += upperDiv;
//                            break;
//                        case 4:
//                            var addr = val.children[x].innerText;
//                            if (addr == '')
//                            { addr = 'n/a'; }
//                            else {
//                                var strArr = addr.split(" ");
//                                if (strArr.length >= 7) {
//                                    strArr.splice(6, strArr.length - 1).toString();
//                                    addr = strArr.join(" ") + " ...";
//                                }
//                            }
//                            addr = escape(addr);
//                            break;
//                        case 5:
//                            var loc = val.children[x].innerText;
//                            if (loc == "not available ")
//                            { loc = (addr + ',' + sState); }
//                            else {
//                                loc = loc.replaceAll(' ', '');
//                                loc = loc.replace('N', '');
//                                loc = loc.replace('W', ',-');
//                            }
//                            var mapContent = '';
//                            mapContent = stName + '#' + currCity + '#' + addr + '#' + octane + '#' + loc;
//                            mapContent = "\"" + escape(mapContent) + "\"";

//                            //                            if (stName == 'Cap Sante Boat Haven')
//                            //                                taalert(escape(addr));

//                            var middleDiv = "<div class='one-third column' style='color:#000;font-size:11pt;float:left; height:25px;'><div style='float:left;max-width:200px;overflow:hidden;height:20px; margin:4px 0px 0px 0px;'>" + unescape(addr) + "</div><div style='float:right;margin:4px 10px 0px 0px;'><div style='text-decoration:underline; cursor:pointer;' onclick='initMap(" + mapContent + ")'>Map it</div></div></div>"
//                            listHTML += middleDiv;

//                            var lowerDiv = "<div class='one-third column' style='color:#000;font-size:11pt;float:left; height:25px; '><div style='float:left;margin:4px 0px 0px 0px;'><span class='brandTag'>Brand: </span>" + sBrand + "</div><div style='float:right;margin:4px 5px 0px 0px;'>Octane: " + octane + "</div></div>"
//                            listHTML += lowerDiv;
//                            break;
//                        default: var none = null;
//                    }
//                    //taalert(x + ":" + val.children[x].innerText);
//                    //listHTML += "<div style='float:left; width:auto'>" + val.innerText + "</div>";
//                }
//                ctyName = currCity;
//            }
//        }

//    });

//    listHTML += "</div>";
//   $('#pageContent').html(listHTML);
//   //$('#listPage').show();
//   $("#dataStore").html('');
//   createAlphaChooser();
//    $(".listAlpha").click(function () {
//        alphaChooser();
//    });
//    //$(".adBox").show();
//    stopActivity()
//}

function initMap(mapContent) {
    winpos = $(window).scrollTop();
    $(currPg).hide();
    $("#mapPage").show(function () {
        $(window).scrollTop(0);

        mapContent = unescape(mapContent);
        var mcSpl = mapContent.split('#');
        $('#mName').text(unescape(mcSpl[0]));
        $('#mAddress').text(unescape(mcSpl[2]) + ', ' + mcSpl[1] + ' ' + sState);
        //$('#mOctane').text(mcSpl[3]);
        $('#mMapLink').html("<a rel='external' target='_blank' href='" + mapURL + "?q=" + mcSpl[4] + "'>Open full map</a>");

        pushBack('closeMapPage()');

        var locSpl = mcSpl[4].split(',');
        var map = null;
        map = new Microsoft.Maps.Map(document.getElementById("zeroMap"), { credentials: "AnuhfIBvShX9nD_OR6s2oomIor3x2NexZimxQw8eCKnjy96boqq21XTuVMxBKWR4", mapTypeId: Microsoft.Maps.MapTypeId.road });
        var loc = new Microsoft.Maps.Location(locSpl[0], locSpl[1]);
        // Add a pin to the map
        var pin = new Microsoft.Maps.Pushpin(loc);
        map.entities.push(pin);
        // Center the map on the location
        map.setView({ center: loc, zoom: 15 });
    });
    
    $("#btnState").hide(function () {
        $("#btnMap").show();
    });
    
}

function closeMapPage() {
    backScript.pop();
    $("#mapPage").hide();
    $(currPg).show();
    $(window).scrollTop(winpos);
    $("#btnMap").hide();
    $("#btnState").show();   
}

function closeAlphaChooser() {
    $("#alphaChooser").hide(function () {
        $(currPg).show();
    });
    
    $(window).scrollTop(winpos);
    
}

function stateChooser() {
    if ($('#alphaChooser').is(':visible')) {
        $("#alphaChooser").hide();
    }
    clearListCache();
    //$(".adBox").hide();
    pushBack('closeStateChooser()');
    $(currPg).hide();
    $("#stateChooser").show();
    
}

function createStateChooser()
{
    states = ['AB', 'AK', 'AL', 'AR', 'AZ', 'BC', 'CA', 'CO', 'FL', 'GA', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MB', 'MD', 'ME', 'MI', 'MN', 'MO', 'MS', 'MT', 'NB', 'NC', 'ND', 'NE', 'NH', 'NM', 'NS', 'NT', 'NV', 'NY', 'OH', 'OK', 'ON', 'OR', 'PA', 'QC', 'SC', 'SD', 'SK', 'TN', 'TX', 'UT', 'VA', 'WA', 'WI', 'WV', 'WY', 'YT']
    $("#stateChooser").html('');
    var elems = [];
    for (x in states) {
        var id=states[x] + x
        var stBlock = "<div id='" + id + "' class='stateBlock'>" + states[x] + "</div>";
        id = '#' + id;
        elems.push(id);
        //$("#stateChooser").append(stBlock);
        $(stBlock).appendTo('#stateChooser')
    }
    $(".stateBlock").click(function () {
        startActivity();
        setState($(this).text());
        backScript.pop();
        $('#pageContent').html('&nbsp;');
        $('#listPage').show();
        $("#stateChooser").hide();
        pushNav('#listPage');
        $(window).scrollTop(0);
        setupListPage();

    });
}

function closeStateChooser() {
    $("#stateChooser").hide(function () {
        $(currPg).show();
    });
   
}
function animateElems(elems) 
{ 
    if (elems.length > 0) { 
        var elem = elems.shift();
        $(elem).animate({ height: 67 }, 10, function () {
            animateElems(elems);
        }); 
    }
}

function alphaChooser() {
    winpos = $(window).scrollTop();
    $("#alphaChooser").show(function () {
        $(window).scrollTop(0);
        $(currPg).hide();
    });
    pushBack('closeAlphaChooser()');
}

function createAlphaChooser() {
    fullAlpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    $("#alphaChooser").html('');
    var elems = [];
    for (x in fullAlpha) {
        var id = fullAlpha[x] + x
        if (listAlpha.indexOf(fullAlpha[x]) != -1) {
            var aBlock = "<div id='" + id + "' class='ABlock Aactive'>" + fullAlpha[x] + "</div>";
        }
        else {
            var aBlock = "<div id='" + id + "' class='ABlock Ainactive'>" + fullAlpha[x] + "</div>";
        }
        id = '#' + id;
        elems.push(id);
        $(aBlock).appendTo('#alphaChooser')
    }

    $(".Aactive").click(function (e) {
        e.preventDefault();
        startActivity();
        var choseAlpha = $(this).text();
        $('#alphaChooser').hide(function () {
            $('#listPage').show();
            backScript.pop();
            offSetTop = $('.listAlpha:contains(' + choseAlpha + ')').offset().top;
            $(window).scrollTop(offSetTop);
            //$('html,body').animate({ scrollTop: offSetTop }, 10);
            winpos = offSetTop;
            //$('.ABlock').css({ height: 0, 'margin-bottom': 62 });
        });
        stopActivity();
    });
}


//*******************************
//           Navigation
//*******************************

function pushBack(dat) {
    backScript.push(dat)
    if (backScript != '') {
        document.addEventListener("backbutton", onBackKeyDown, false);
    }
}

function pushNav(page) {
    pushBack('pageNav("' + currPg + '")')
    pageNav(page);
}

function onBackKeyDown() {
   if (backScript != '') {
        var fn = backScript.pop();
        if (backScript == '') {
            document.removeEventListener("backbutton", onBackKeyDown, false);
        }
        eval(fn);
    }
    else {
        navigator.app.backHistory()
    }
}

function pageNav(page) {
    if (currPg != page) {
//        $(currPg).animate({ 'margin-left': '-480' }, 300, function () {
//            $(this).hide();
        //        });
//        $(page).show().animate({ 'margin-left': '0' }, 300);
        $(currPg).fadeOut('slow');
        $(page).fadeIn('slow');
        if (currPg != null)
            prevPg = currPg;
        currPg = page;
        if (currPg != '#listPage') {
            $('#headerText').fadeIn('fast');
            $('#listText').fadeOut('fast');
        }
    }
}