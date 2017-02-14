$(function() {
	$('.tabs__link').on('click', function(e) {
		e.preventDefault();
		var $clickTab = $(this).attr('id');

		if ($clickTab != $('.selected').attr('id')) {
			$('.tabs__link').removeClass('selected');
			$(this).addClass('selected');

			$('.tabs__rightblock div').removeClass('selected');
			$('#par_' + $clickTab).addClass('selected');
    }
  });
});
