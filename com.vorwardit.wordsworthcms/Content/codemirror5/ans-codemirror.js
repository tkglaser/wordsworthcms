var
	cmSetHtml = {
		mode: "text/html",
		tabSize: 2,
		indentWithTabs: true,
		lineNumbers: true,
		lineWrapping: true,
		autoCloseTags: true,
		extraKeys: {
			"Ctrl-1": function (cm) { wrapB(cm, "h1"); },
			"Ctrl-2": function (cm) { wrapB(cm, "h2"); },
			"Ctrl-3": function (cm) { wrapB(cm, "h3"); },
			"Ctrl-4": function (cm) { wrapB(cm, "h4"); },
			"Ctrl-5": function (cm) { wrapB(cm, "h5"); },
			"Ctrl-6": function (cm) { wrapB(cm, "h6"); },
			"Ctrl-Enter": function (cm) {
				var s = cm.getSelection();
				//s = s.replace(/<\/?p>/gi, "\n")
				//	.replace(/[ \t\r]+/g, " ")
				//	.replace(/\s*\n\s*/g, "</p>\n\n<p>")
				//	.trim(" ");
				//s = s.replace(/[\t ]+/g, ' ')
				//	.replace(/<\/p>|<p>/g, '\n')
				//	.replace(/\s*\n\s*/g, '</p>\n\n<p>');
				s = s.replace(/<\/?p>/g, '\n')
					.replace(/^\s+|\s+$/g, '')
					.replace(/[\t ]+/g, ' ')
					.replace(/\s*\n\s*/g, '<\/p>\n\n<p>');
				cm.replaceSelection("<p>" + s + "</p>", "end");
			},
			"Shift-Enter": function (cm) { cm.replaceSelection("<br/>\n", "end"); },
			"F11": function (cm) {
				cm.setOption("fullScreen", !cm.getOption("fullScreen"));
			},
			"Esc": function (cm) {
				if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
			}
		}
	};

function wrap(cm, tag) {
	var s = cm.getSelection();
	cm.replaceSelection("<" + tag + ">" + s + "</" + tag + ">", "end");
}

function wrapB(cm, tag) {
	var s = $.trim(cm.getSelection()).replace(/\s+/g, ' ');
	cm.replaceSelection("<" + tag + ">" + s + "</" + tag + ">\n", "end");
}

!function ($) {
	$(function () {

		$.fn.codemirror = function (set) {
			var result = this;
			this.each(function () {
				result = CodeMirror.fromTextArea(this, set);
			});
			return result;
		};

		$('.form-codemirror').codemirror(cmSetHtml);

		$('.code-html').each(function () {
			var $this = $(this),
				$code = $this.html();
			$this.empty();
			var cm = CodeMirror(this, {
				value: $code,
				lineNumbers: !$this.is('.inline'),
				mode: "text/html",
				tabSize: 2,
				indentWithTabs: true,
				lineWrapping: true,
				viewportMargin: Infinity,
				readOnly: true,
			});
		});

	});
}(window.jQuery);

//var editor = new CodeMirror(CodeMirror.replace("inputfield"), {
//	parserfile: ["tokenizejavascript.js", "parsejavascript.js"],
//	path: "lib/codemirror/js/",
//	stylesheet: "lib/codemirror/css/jscolors.css",
//	content: document.getElementById("inputfield").value
//});

//function cmReplace(id) {
//	cmEditor = CodeMirror.fromTextArea(id, cmSetHtml);
//}
