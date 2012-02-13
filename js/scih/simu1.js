(function($, $S) {
	//heat pump coefficient
	copN = 3.5;
	step = 1000;
	
	$("#inc").click(function() {
		if(Number($(":text[name='incText']").val()) < 20000) {
			$(":text[name='incText']").val(Number($(":text[name='incText']").val()) + step);
			updateResultFields(copN);
		}
	});
	
	$("#dec").click(function() {
		if(Number($(":text[name='incText']").val()) >= step) {
			$(":text[name='incText']").val(Number($(":text[name='incText']").val()) - step);
			updateResultFields(copN);
		}
	});
})(jQuery, window.localStorage);

function updateResultFields(coeff) {
	$('#enerInVal').text(Number($(":text[name='incText']").val()) * (coeff - 1));
	$('#houseWatt').text((Number($(":text[name='incText']").val()) + Number($('#enerInVal').text())).toFixed(2));
	$('#expEner').text((Number($(":text[name='incText']").val()) * 0.7).toFixed(2));
	$('#freeEner').text((Number($('#enerInVal').text()) * 0.7).toFixed(2));
}

function isNumberKey(evt) {
	var charCode = (evt.which) ? evt.which : event.keyCode
	if(charCode > 31 && (charCode < 48 || charCode > 57)) {
		return false;
	}
	else {
		return true;
	}
}