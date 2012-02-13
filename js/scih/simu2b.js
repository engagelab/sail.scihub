$(function() {
	$(document).ready(function() {
		$("body").css("display", "none");
		$("body").fadeIn(2000);

		$("a.transition").click(function(event) {
			event.preventDefault();
			linkLocation = this.href;
			$("body").fadeOut(1000, redirectPage);
		});

		$('#cardPile div').each(function(i) {
			var $this = $(this);
			$this.draggable({
				//containment : '#content',
				stack : '#cardPile div',
				cursor : 'move',
				revert : true,
				start : handleStartDrag
			});
		});

		$('#cardSlots div').each(function(i) {
			var $this = $(this);
			$this.droppable({
				accept : '#cardPile div',
				hoverClass : 'hovered',
				drop : handleCardDrop
			});
		});
	});
});

function redirectPage() {
	window.location = linkLocation;
}

function handleStartDrag(event, ui) {
	$(this).removeClass('correct');
}

function handleCardDrop(event, ui) {
	ui.draggable.addClass('correct');
	ui.draggable.position({
		of : $(this),
		my : 'left top',
		at : 'left top'
	});
	ui.draggable.draggable('option', 'revert', false);
	
	numAnswers = 0;
	$('#cardPile div').each(function(i) {
		if($(this).hasClass('correct')) {
			numAnswers++;
		}
	});
	
	if(numAnswers == 3) {
		//activate a button or something like that
	}
}