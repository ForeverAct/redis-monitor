$(function(){
	$("#search").click(searchListener) ;
	$("#searchValue").keypress(function(e){
		if(e.keyCode==13){
			searchListener() ;
		}
	}) ;
	function searchListener(e){
		var pattern = $.trim($("#searchValue").val()) ;
		var showNum = $.trim($("#showNum").val()) ;
		if($.isNumeric(showNum)){
			showNum = parseInt(showNum) ;
		} else {
			showNum = 100 ;
		}
		var url = '/keys/getByPattern.htm';
		$.getJSON(url ,{patternKey:pattern , uuid:uuid , showNum:showNum } , function(data){
			$("#keysBody").empty() ;
			if(data == null || data.length < 1){
				$("#keysBody").append("<tr><td>无匹配结果</td></tr>") ; 
				return false ;
			}
			$.each(data , function(index , value){
				var show = value ;
				if(value.length > 30){
					show = value.substring(0 , 30) + "..." ;
					$("#keysBody").append('<tr><td><a title="'+value+'" href="#" onclick=\'getValue("'+value+'")\'>' + show + '</a></td></tr>') ;
				} else {
					$("#keysBody").append('<tr><td><a href="#" onclick=\'getValue("'+value+'")\'>' + value + '</a></td></tr>') ;
				}
				
			}) ;
		}) ;
		return false ;
	}
}) ;

function getValue(key){
	$("#Canvas").parent().hide() ; 
	window.key = key ;
	
	console.log('get value:' + key) ;
	var url = '/keys/value.htm?key=' + key +'&uuid=' + uuid ;
	$.getJSON(url , function(data){
		$("#stringView").hide().find("textarea").val("") ;
		$("#mapView").hide().find("tbody").empty() ;
		$("#listView").hide().find("tbody").empty();
		
		if(data.type == 'string'){
			$("#stringView").show().find("textarea").val(data.value) ;
		} else if(data.type == "map"){
			$.each(data.value , function(key , value){
				$("#mapView").show().find("tbody").append("<tr><td><p style=\"width:200px;\">"+ key +"</p></td><td><p style=\"width:600px;word-wrap: break-word;word-break: normal;\">"+ value +"</p></td></tr>") ;
			}) ;
		} else if(data.type == "list") {
			$.each(data.value , function(index , value){
				$("#listView").show().find("tbody").append("<tr><td><p style=\"width:200px;\">"+ index +"</p></td><td><p style=\"width:600px;word-wrap: break-word;word-break: normal;\">"+ value +"</p></td></tr>") ;
			}) ;
		}
		console.log(data) ;
	}) ;
}

function formatXML(){
	var xml = $("#stringView").find("textarea").val();
	xml_formatted = formatXml(xml);
	xml_escaped = xml_formatted.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/ /g, '&nbsp;').replace(/\n/g,'<br />');
	$("#Canvas").empty().html("<PRE class='CodeContainer'>"+xml_escaped+"</PRE>").parent().show();
}

function updateString(){
	var val = $("#stringView").find("textarea").val() ;
	$.post('/keys/updateString.htm' , {key:key , value:val} , function(data){
		console.log(data) ;
	} , "json") ;
}