var pathname = window.location.pathname;
var hostname = window.location.hostname;
var repo = pathname.split("/")[1];
var user = hostname.split(".")[0];
var domain = hostname.split(".")[1];

var galleryContainer = $("#projectsContent > .gallery.container");
var oldid, slider;


$(document).ready(function () {
	if (domain == 'github') {
		firstGit();
	}
	else {
		firstAjax();
	}
});

function showProject(id) {
	if (oldid != id) {
		galleryContainer.empty(); 
		$('<ul></ul>').appendTo(galleryContainer).attr('id', 'projectGallery').ready(function() {
			if (domain == 'github') {
				startGit(id);
			}
			else {
				startAjax(id);
			}
		});
	}
}


function firstAjax() {
	var folder = "../../images/portfolio/";	
	$.ajax({
		url: folder,
		success: function (data) {
			$(data).find("a").attr("href", function (i, val) {
				if (val.match(/\.(jpe?g|png|gif|webp)$/)) {
					var id = val.split('.').slice(0, -1).join('.');
					var url = folder + val;
					var caption = id.replace('%20', "\n");
					var descTitle = "";
					var desc = "";
					$.ajax({
						url: folder + id + ".txt",
						async: false,
						cache: false,
						success: function (txt) {
							var lines = txt.split("\n");
							caption = lines[0].replace(' ', "\n");
							descTitle = lines[1];
							desc = lines[2];
						}
					});
					$("#portfolioGallery").append('<a href="#projects/' + id.substring(id.indexOf('%20') + 3) + '"><div class="project" id="' + id + '" title="' + caption + '" data-descTitle="' + descTitle + '" data-desc="' + desc + '" style="background-image: url(&apos;' + url + '&apos;)"></div></a>');

				}
			});
		}
	});
	$(".project").css("background-size", "cover");
}

function firstGit() {
	(async () => {
		const response = await fetch('https://api.github.com/repos/' + user + '/' + repo + '/contents/images/portfolio/');
		const data = await response.json();
		for (let file of data) {
			var val = file.name;
			var url = '/' + repo + '/' + file.path;
			if (val.match(/\.(jpe?g|png|gif|webp)$/)) {
				var id = val.split('.').slice(0, -1).join('.');
				var caption = id.replace('%20', "\n");
				var descTitle = "";
				var desc = "";
				$.ajax({
					url: url.split('.').slice(0, -1).join('.') + ".txt",
					async: false,
					cache: false,
					success: function (txt) {
						var lines = txt.split("\n");
						caption = lines[0].replace(' ', "\n");
						descTitle = lines[1];
						desc = lines[2];
					}
				});
				$("#portfolioGallery").append('<a href="#projects/' + id.substring(id.indexOf('%20') + 3) + '"><div class="project" id="' + id + '" title="' + caption + '" data-descTitle="' + descTitle + '" data-desc="' + desc + '" style="background-image: url(&apos;' + url + '&apos;)"></div></a>');
			}
		}
	})()
}

function startGit(id) {
	var project = $("#projectGallery");
	var folder = "../../projects/" + id + "/";
	(async () => {
			const response = await fetch('https://api.github.com/repos/' + user + '/' + repo + '/contents/projects/' + id + '/');
			const data = await response.json();
			for (let file of data) {
				var val = file.name;
				var folder = url.split('/').pop() + '/';
				if (val.match(/\.(jpe?g|png|gif|webp)$/)) {
					var id = val.split('.').slice(0, -1).join('.');
					var url = folder + val;
					var thumbUrl = folder + 'thumb/' + id + '.webp';
					var caption = id;
					var descTitle;
					var desc;

					$.ajax({
						url: folder + id + ".txt",
						async: false,
						cache: false,
						success: function (txt) {
							var lines = txt.split("\n");
							caption = lines[0].replace(' ', "\n");
							descTitle = lines[1];
							desc = lines[2];
						},
						complete: function (data) {
							$('<li title="' + caption + '" data-thumb="' + thumbUrl + '"> <img src="' + url + '" /> </li>').appendTo(project);
						}
					});
				}
				if (val.match(/\.(htm|html)$/)) {
					var id = val.split('.').slice(0, -1).join('.');
					var url = folder + val;
					var thumbUrl = folder + 'thumb/' + id + '.webp';
					var caption = id.replace('%20', "\n");
					var descTitle;
					var desc;
					var html;

					$.get(url, function (html_string) {
						html = html_string;
					}, 'html');
					$.ajax({
						url: folder + id + ".txt",
						async: false,
						cache: false,
						success: function (txt) {
							var lines = txt.split("\n");
							caption = lines[0].replace(' ', "\n");
							descTitle = lines[1];
							desc = lines[2];
						},
						complete: function (data) {
							$('<li title="' + caption + '" data-thumb="' + thumbUrl + '"></li>').appendTo(project).attr('id', id + '-HTML').ready(function () {
								$(function () {
									window.setTimeout(function () {
										$('#' + id + '-HTML').append(html);
									}, 100);
								});
							});
						}
					});
				}
				if (val.match(/\.(url)$/)) {
					var id = val.split('.').slice(0, -1).join('.');
					var url = folder + val;
					var thumbUrl = folder + 'thumb/' + id + '.webp';
					var caption = id.replace('%20', "\n");
					var descTitle;
					var desc;
					var html;

					$.get(url, function (html_string) {
						html = html_string;
					}, 'html');
					$.ajax({
						url: folder + id + ".txt",
						async: false,
						cache: false,
						success: function (txt) {
							var lines = txt.split("\n");
							caption = lines[0].replace(' ', "\n");
							descTitle = lines[1];
							desc = lines[2];
						},
						complete: function (data) {
							$('<li title="' + caption + '" data-thumb="' + thumbUrl + '"></li>').appendTo(project).attr('id', id + '-VID').ready(function () {
								$(function () {
									$('#' + id + '-VID').append('<iframe src="' + html.split('URL=')[1] + '?quality=720p&byline=0&portrait=0&title=0autoplay=1" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>');
								});
							});
						}
					});
				}
				if (val.match(/\.(pdf)$/)) {
					var id = val.split('.').slice(0, -1).join('.');
					var url = folder + val;
					var thumbUrl = folder + 'thumb/' + id + '.webp';
					var caption = id.replace('%20', "\n");
					var descTitle;
					var desc;

					$.ajax({
						url: folder + id + ".txt",
						async: false,
						cache: false,
						success: function (txt) {
							var lines = txt.split("\n");
							caption = lines[0].replace(' ', "\n");
							descTitle = lines[1];
							desc = lines[2];
						},
						complete: function (data) {
							$('<li title="' + caption + '" data-thumb="' + thumbUrl + '"><div id="' + id + '-PDF" style="height:100%;"></div></li>').appendTo(project).ready(function () {
								$(function () {
									$('#' + id + '-PDF').pdf({
										source: url,
										title: id + " Booklet"
									});
								});
							});
						}
					});
				}
			}
			await window.setTimeout(function () {
				project.lightSlider({
					gallery: true,
					item: 1,
					loop: false,
					auto: false,
					slideMargin: 0,
					galleryMargin: 10,
					thumbItem: 9,
					currentPagerPosition: 'middle',
					onSliderLoad: function () {
						$('ul.lSPager, ul.lSPager li').removeAttr('style');
					},
					onBeforeSlide: function () {
						var iframe = project.find('li.lslide.active iframe');
						if (iframe[0] !== undefined) {
							var src = iframe.attr('src');
							if (src.indexOf('vimeo') > -1) {
								var player = new Vimeo.Player(iframe[0]);
								player.pause();
							}
						}

					},
					onAfterSlide: function () {}
				});
				oldid = id;
			}, 100);
		}
	}
}

function startAjax(id) {
	var project = $("#projectGallery"); 
	var folder = "../../projects/" + id + "/";
	$.ajax({
		url: folder,
		success: function (data) {
			$(data).find("a").attr("href", function (i, val) {
				if (val.match(/\.(jpe?g|png|gif|webp)$/)) {
					var id = val.split('.').slice(0, -1).join('.');
					var url = folder + val;
					var thumbUrl = folder + 'thumb/' + id + '.webp';
					var caption = id;
					var descTitle;
					var desc;

					$.ajax({
						url: folder + id + ".txt",
						async: false,
						cache: false,
						success: function (txt) {
							var lines = txt.split("\n");
							caption = lines[0].replace(' ', "\n");
							descTitle = lines[1];
							desc = lines[2];
						},
						complete: function (data) {
							$('<li title="' + caption + '" data-thumb="' + thumbUrl + '"> <img src="' + url + '" /> </li>').appendTo(project);
						}
					});
				}
				if (val.match(/\.(htm|html)$/)) {
					var id = val.split('.').slice(0, -1).join('.');
					var url = folder + val;
					var thumbUrl = folder + 'thumb/' + id + '.webp';
					var caption = id.replace('%20', "\n");
					var descTitle;
					var desc;
					var html;
					
					$.get(url, function (html_string) {
						html = html_string;
					}, 'html');
					$.ajax({
						url: folder + id + ".txt",
						async: false,
						cache: false,
						success: function (txt) {
							var lines = txt.split("\n");
							caption = lines[0].replace(' ', "\n");
							descTitle = lines[1];
							desc = lines[2];
						},
						complete: function (data) {
							$('<li title="' + caption + '" data-thumb="' + thumbUrl + '"></li>').appendTo(project).attr('id', id + '-HTML').ready(function() {
								$(function() {
									window.setTimeout(function () {
										$('#' + id + '-HTML').append(html);
									}, 100);						
								});
							});
						}
					});
				}
				if (val.match(/\.(url)$/)) {
					var id = val.split('.').slice(0, -1).join('.');
					var url = folder + val;
					var thumbUrl = folder + 'thumb/' + id + '.webp';
					var caption = id.replace('%20', "\n");
					var descTitle;
					var desc;
					var html;
					
					$.get(url, function (html_string) {
						html = html_string;
					}, 'html');
					$.ajax({
						url: folder + id + ".txt",
						async: false,
						cache: false,
						success: function (txt) {
							var lines = txt.split("\n");
							caption = lines[0].replace(' ', "\n");
							descTitle = lines[1];
							desc = lines[2];
						},
						complete: function (data) {
							$('<li title="' + caption + '" data-thumb="' + thumbUrl + '"></li>').appendTo(project).attr('id', id + '-VID').ready(function() {
								$(function() {
									$('#' + id + '-VID').append('<iframe src="' + html.split('URL=')[1] + '?quality=720p&byline=0&portrait=0&title=0autoplay=1" width="100%" height="100%" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>');
								});
							});
						}
					});
				}
				if (val.match(/\.(pdf)$/)) {
					var id = val.split('.').slice(0, -1).join('.');
					var url = folder + val;
					var thumbUrl = folder + 'thumb/' + id + '.webp';
					var caption = id.replace('%20', "\n");
					var descTitle;
					var desc;
					
					$.ajax({
						url: folder + id + ".txt",
						async: false,
						cache: false,
						success: function (txt) {
							var lines = txt.split("\n");
							caption = lines[0].replace(' ', "\n");
							descTitle = lines[1];
							desc = lines[2];
						},
						complete: function (data) {
							$('<li title="' + caption + '" data-thumb="' + thumbUrl + '"><div id="' + id + '-PDF" style="height:100%;"></div></li>').appendTo(project).ready(function() {
								$(function() {
									$('#' + id + '-PDF').pdf( { source: url, title: id + " Booklet" } );
								});
							});
						}
					});
				}
			});
		},
		complete: function (data) {
			window.setTimeout(function () {
				project.lightSlider({
					gallery: true,
					item: 1,
					loop: false,
					auto: false,
					slideMargin: 0,
					galleryMargin: 10,
					thumbItem: 9,
					currentPagerPosition: 'middle',
					onSliderLoad: function() {
						$('ul.lSPager, ul.lSPager li').removeAttr('style');
					},
					onBeforeSlide: function () {
						var iframe = project.find('li.lslide.active iframe');
						if (iframe[0] !== undefined) {
							var src = iframe.attr('src');
							if (src.indexOf('vimeo') > -1) {
								var player = new Vimeo.Player(iframe[0]);
								player.pause();
							}
						}

					},
					onAfterSlide: function () {
					}
				});
				oldid = id;
			}, 100);
		}
	});

}