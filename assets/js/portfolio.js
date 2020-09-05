var folder = "../../images/portfolio/";
var galleryContainer = $("#projectsContent > .gallery.container");
var oldid, slider;

$.fn.exists = function(callback) {
  var args = [].slice.call(arguments, 1);

  if (this.length) {
    callback.call(this, args);
  }

  return this;
};

function ResizeSensor(element, callback)
{
    let zIndex = parseInt(getComputedStyle(element));
    if(isNaN(zIndex)) { zIndex = 0; };
    zIndex--;

    let expand = document.createElement('div');
    expand.style.position = "absolute";
    expand.style.left = "0px";
    expand.style.top = "0px";
    expand.style.right = "0px";
    expand.style.bottom = "0px";
    expand.style.overflow = "hidden";
    expand.style.zIndex = zIndex;
    expand.style.visibility = "hidden";

    let expandChild = document.createElement('div');
    expandChild.style.position = "absolute";
    expandChild.style.left = "0px";
    expandChild.style.top = "0px";
    expandChild.style.width = "10000000px";
    expandChild.style.height = "10000000px";
    expand.appendChild(expandChild);

    let shrink = document.createElement('div');
    shrink.style.position = "absolute";
    shrink.style.left = "0px";
    shrink.style.top = "0px";
    shrink.style.right = "0px";
    shrink.style.bottom = "0px";
    shrink.style.overflow = "hidden";
    shrink.style.zIndex = zIndex;
    shrink.style.visibility = "hidden";

    let shrinkChild = document.createElement('div');
    shrinkChild.style.position = "absolute";
    shrinkChild.style.left = "0px";
    shrinkChild.style.top = "0px";
    shrinkChild.style.width = "200%";
    shrinkChild.style.height = "200%";
    shrink.appendChild(shrinkChild);

    element.appendChild(expand);
    element.appendChild(shrink);

    function setScroll()
    {
        expand.scrollLeft = 10000000;
        expand.scrollTop = 10000000;

        shrink.scrollLeft = 10000000;
        shrink.scrollTop = 10000000;
    };
    setScroll();

    let size = element.getBoundingClientRect();

    let currentWidth = size.width;
    let currentHeight = size.height;

    let onScroll = function()
    {
        let size = element.getBoundingClientRect();

        let newWidth = size.width;
        let newHeight = size.height;

        if(newWidth != currentWidth || newHeight != currentHeight)
        {
            currentWidth = newWidth;
            currentHeight = newHeight;

            callback();
        }

        setScroll();
    };

    expand.addEventListener('scroll', onScroll);
    shrink.addEventListener('scroll', onScroll);
};





$(document).ready(function () {
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
});

function showProject(id) {
	if (oldid != id) {
		galleryContainer.empty(); 
		$('<ul></ul>').appendTo(galleryContainer).attr('id', 'projectGallery').ready(function() {
			startAjax(id);
		});
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
					var iframe = project.find('li.lslide.active iframe')[0];
					if (iframe !== undefined) {
						var player = new Vimeo.Player(iframe);
						player.pause();
					}
					
				},
				onAfterSlide: function () {
					var iframe = project.find('li.lslide.active iframe')[0];
/*					if (iframe !== undefined) {
						var player = new Vimeo.Player(iframe);
						player.play();
					}*/
				}
			});
			oldid = id;
		}
	});

}