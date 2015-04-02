$(function () {
	// GLOBAL
	var PATH = "http://localhost:3000";

	// variables Formulario
	var $videoInput = $('#youtube-url');
	var $button = $('#youtube-button');

	// variables DOM
	var $videoTitle = $('.MainSection-title');

	// AJAX Functions
	function getVideo (url, callback) {
		$.ajax({
			data: {
				url: url
			},
			url: PATH+"/urls/"
		})
		.done( callback );
	};


	function onSubmit () {
		getVideo($videoInput.val(), fillVideoInfo);
		NProgress.start();
		$videoTitle.html('Cargando...');
	};

	function fillVideoInfo (jsonData) {
		var videoTitle = jsonData.video.title;

		$videoTitle.html(videoTitle);
		NProgress.done();
	};

	$button.on('click', onSubmit);
});

// Access-Control-Allow-Origin: *
// CORS