/*
 * jquery.crimsonhexagon.menu.js
 * 
 * Last Updated: 2013-01-15		eklingman
 * 
 * The chMenu plugin provides functionality for the export menus used on all
 * pages of the monitor results section, providing event handlers and styling 
 * rules for the various export options.
 * 
 * Included functionality:
 *     $.fn.chMenu
 *     changeExportIcon()
 * 
 */





/* Global Variables */
var MENU_SETTABLE = (typeof setThisMenu !== "undefined") ? true : false,
	ANCHOR_SETTABLE = (typeof setThisAnchor !== "undefined") ? true : false,
	TEMP_MENU,
	TEMP_ANCHOR;





/*
 * $.fn.chMenu
 * 
 * Event handlers and styling for the various Export menus sprinkled throughout
 * the system.
 * 
 */
(function($) {
	$.fn.chMenu = function (options) {
		options = $.extend({
			dataTable: $("table"),
			offset: 0,
			topOffset: 0
		}, options);
	
		$(this).each(function() {
			var _menu = $(this).children("ul");
			
			$('body').on('click', function(e) {
				if ( ($(e.target).closest('.menuPopup').length === 0) ) {
					$('.menuPopup').fadeOut('slow');
					$('.dropdown-link').removeClass('selected');
				}
			});
		
			_menu.children("li").each(function() {
				var _menuItem = $(this);
				if (_menuItem.children("ul").length > 0) { // submenu
					
					var _subMenuHeader = _menuItem.children("ul").attr("title");
					
					if (_subMenuHeader) {
						$("<li />").addClass("submenuHeader").html(_subMenuHeader).insertBefore(_menuItem.children("ul").children("li:first-child"));
					}
					_menuItem.children("ul").addClass("menuPopup").css({
						"display": "none"
					});
					//_menuItem.children("ul").children("li:first-child").addClass("first").prepend(_div);
					_menuItem.children("ul").children("li:last-child").addClass("last");
					
					// if you're looking for the code that closes on click off, try forsight.js line 686
					_menuItem.children("a").addClass("dropdown-link").on("click", function() {
						var _anchor = $(this);
						var selected = _anchor.hasClass("selected");
						
						// it's possible things have shifted
						var _popup = _anchor.next(),
								_menuItem = _anchor.closest("li");
						if (_menuItem.position().left != _popup.css("left"))
							_popup.css("left", (_menuItem.position().left + ((_menuItem.outerWidth() - _menuItem.children("ul").width())/2) - options.offset) + "px");
						var _subMenuTop = _menuItem.position().top + _menuItem.outerHeight() + options.topOffset;
						_popup.css("top", _subMenuTop + "px");
						if ( ((_menuItem.position().left + _menuItem.width()/2) + _popup.outerWidth()/2) > $('#content').outerWidth() ) {
							_popup.css("left", $('#content').outerWidth() - _popup.outerWidth() - 20);
						}
						if ( (_menuItem.position().left - _popup.width()/2) < 0 ) {
							_popup.css("left", 20);
						}
						
						// close all other ones
						$('.menuPopup').fadeOut("fast", function() {
							if ((MENU_SETTABLE) && (ANCHOR_SETTABLE)) {
								setThisMenu(null);
								setThisAnchor(null);
							}
							else {
								TEMP_MENU = null;
								TEMP_ANCHOR = null;
							}
						});
						$('.dropdown-link').removeClass("selected").each(function() {
							changeExportIcon($(this));
						});
 
						if (selected) {
							_anchor = $(this);
							_anchor.removeClass("selected");
							changeExportIcon(_anchor);
							_menuItem.children("ul").fadeOut("slow", function() {
								if ((MENU_SETTABLE) && (ANCHOR_SETTABLE)) {
									setThisMenu(null);
									setThisAnchor(null);
								}
								else {
									TEMP_MENU = null;
									TEMP_ANCHOR = null;
								}
							});
						} else {
							_anchor.addClass("selected");
							changeExportIcon(_anchor);
							_menuItem.children("ul").fadeIn("slow", function() {
								if ((MENU_SETTABLE) && (ANCHOR_SETTABLE)) {
									setThisMenu($(this));
									if (_anchor) {
										setThisAnchor(_anchor);
									}
								} else {
									TEMP_MENU = $(this);
									TEMP_ANCHOR = _anchor;
								}
							});
						}
						return false;
					});
					
				}
			});
			
			// Added CSS to hide by default for prettier loading, need to show again //
			$(this).show();
		});
	};	
})(jQuery);





/*
 * changeExportIcon()
 * 
 * Helper function to, you guessed it, change the export menu icon when it
 * is clicked.
 * 
 */
function changeExportIcon(anchor) {
	if ((anchor.hasClass("selected")) && (anchor.children("span.icon-export-inactive").length)) {
		anchor.children("span.icon").addClass("icon-export-active").removeClass("icon-export-inactive");
	} else if ((!anchor.hasClass("selected")) && (anchor.children("span.icon-export-active").length)) {
		anchor.children("span.icon").addClass("icon-export-inactive").removeClass("icon-export-active");
	}
}




