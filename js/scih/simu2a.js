$(function() {
	$(document).ready(function() {
		$('.map').maphilight();

		$("#zoomLink").click(function(event) {
			event.preventDefault();
			linkLocation = this.href;
			$("body").fadeOut(1000, redirectPage);
		});
		
		function redirectPage() {
			window.location = linkLocation;
		}
	});
});
