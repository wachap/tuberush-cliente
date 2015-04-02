$(function () {
	// GLOBAL
	var PATH = "http://localhost:3000";

	// variables Formulario
	var $result = $('#result');
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
		var v360p = jsonData.video.links.mp4.v360p || null;
		var v480p = jsonData.video.links.mp4.v480p || null;
		var v720p = jsonData.video.links.mp4.v720p || null;
		
		var html = '';		
		html += '<div class="video"><iframe width="854" height="510" src="https://www.youtube.com/embed/'+jsonData.video.id+'" frameborder="0" allowfullscreen></iframe></div>';
		html += '<ul class="Links">';
		if (v360p !=null)
			html += '<li class="Link-option"><a href="'+v360p+'" target="_blanc" class="link btn-succes btn-lg">360p</a></li>'
		if (v480p !=null)
			html += '<li class="Link-option"><a href="'+v480p+'" target="_blanc" class="link btn-succes btn-lg">480p</a></li>'
		if (v720p !=null)
			html += '<li class="Link-option"><a href="'+v720p+'" target="_blanc" class="link btn-succes btn-lg">720p</a></li>'
		html += '</ul>';
		
			 
		
		

		$result.html(null);
		$result.append(html);

		$videoTitle.html(videoTitle);
		NProgress.done();
	};

	$button.on('click', onSubmit);
});

