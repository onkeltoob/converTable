/*
* jQuery Toob converTable
* http://tobias-reinhardt.de
*
* Copyright 2012, Tobias Reinhardt
* Free to use and abuse under the MIT license.
* http://www.opensource.org/licenses/mit-license.php
* 
* March 2012
*
* This plugin provides functionality to convert tabular data into a list of definitions 
* where each table row holds one cell for the definition term while the other cells are 
* being converted to one definition item each. This may not be semantically perfect, but 
* since it doesn't seem totally off in a lot of cases it can come in handy when dealing  
* with lots of columns on smaller screens. Don't blame me for anything, I simply don't know 
* any better.
*/
(function($) {
  $.extend($.fn, {
		converTable: function(options) {
			var settings = $.extend({
				// class for <dt> elements, also used for identifying "title table cells"
				"termClass": "title",
				// class for <dd> elements
				"definitionClass": "",
				// class for the entire result list
				"listClass": "converted",
				// class for table cells to omit
				"omitClass": "omit",
				// if set to "true", only tables exceeding their parent's width will be converted
				"oversizedOnly": true,
				// number of pixels added to parent's width before "oversized" status is determined
				"oversizedOffset": 0,
				// if set to "true", values of title cells' title attribute will be shown at the beginning of each <dt> element
				"includeTermTitles": false,
				// if set to "true", values of content cells' title attribute will be shown at the beginning of each <dd> element
				"includeDefinitionTitles": false
			}, options);

			this.each(function() {
				var element = $(this);
				if (settings.oversizedOnly === false || $(this).width() > $(this).parent().width() + settings.oversizedOffset) {
					var list = $("<dl/>").addClass(settings.listClass).addClass($(this).attr("class"));

					// only convert rows containing <td> cells
					$(this).find("tr:has(td)").each(function () {
						// create selector for "title table cells", those will be used for <dt> elements
						var termSelector = "td." + settings.termClass + ":first";
						// create selector for table cells to omit
						var omitSelector = (settings.omitClass) ? ":not(." + settings.omitClass + ")" : "";
						// create selector for "content table cells", those will be used for <dd> elements
						var definitionSelector = "td:not(." + settings.termClass + ":first)" + omitSelector;
						// use first <td> of each row if no "title table cell" is found
						if ($(this).find(termSelector).length === 0) {
							termSelector = "td:first";
							definitionSelector = "td:not(:first)" + omitSelector;
						}
						// create <dt> element and append it to list
						var term = $(this).find(termSelector);
						var title = (term.attr("data-title") && settings.includeTermTitles) ? term.attr("data-title") + ": " : "";
						list.append($("<dt/>")
							.addClass(settings.termClass)
							.addClass(term.attr("class"))
							.html(title + term.html()));
							
						// create <dd> elements and append them to list
						$(this).find(definitionSelector).each(function () {
							title = ($(this).attr("data-title") && settings.includeDefinitionTitles) ? $(this).attr("data-title") + ": " : "";
							list.append($("<dd/>")
							.addClass(settings.definitionClass)
							.addClass($(this).attr("class"))
							.html(title + $(this).html()));
						});

					});

					// replace table by definition list
					$(this).replaceWith(list);
					

					//return definition list for chaining
					//return element;
				}
			});
			return this;
		}
	});
})(jQuery);
