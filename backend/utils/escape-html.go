package utils

import (
	"github.com/microcosm-cc/bluemonday"
)

var policy *bluemonday.Policy

func InitBluemonday() {
	policy = bluemonday.UGCPolicy()

	// Autoriser les éléments KaTeX / MathML
	policy.AllowElements(
		"math", "maction", "annotation", "annotation-xml",
		"menclose", "merror",
		"mfenced", "mfrac", "mi", "mmultiscripts",
		"mn", "mo", "mover", "mpadded", "mphantom",
		"mprescripts", "mroot", "mrow", "ms", "semantics",
		"mspace", "msqrt", "mstyle", "msub", "msup",
		"msubsup", "mtable", "mtd", "mtext", "mtr",
		"mtimes", "munder", "munderover",

		"div", "span", "svg", "path", "g", "style", "line", "polygon", "polyline", "rect", "circle", "ellipse", "text",
		"input", "label", "form", "button", "select", "option", "textarea", "fieldset", "legend",
		"audio", "video",
	)

	// Autoriser les attributs nécessaires
	policy.AllowAttrs("class", "id", "style", "tabindex", "aria-hidden", "display", "xmlns", "encoding", "accent", "width", "height", "type").Globally()
	policy.AllowAttrs("viewBox", "xmlns", "fill-rule", "d", "x", "y", "cx", "cy", "r", "rx", "ry", "points").OnElements("svg", "path", "line", "polygon", "polyline", "rect", "circle", "ellipse", "text")
	policy.AllowAttrs("href").OnElements("a")
	policy.AllowAttrs("checked").OnElements("input")
	policy.AllowDataAttributes()
	policy.RequireNoFollowOnLinks(false)

	policy.AllowNoAttrs().OnElements(
		"math", "maction", "annotation", "annotation-xml",
		"menclose", "merror",
		"mfenced", "mfrac", "mi", "mmultiscripts",
		"mn", "mo", "mover", "mpadded", "mphantom",
		"mprescripts", "mroot", "mrow", "ms", "semantics",
		"mspace", "msqrt", "mstyle", "msub", "msup",
		"msubsup", "mtable", "mtd", "mtext", "mtr",
		"mtimes", "munder", "munderover",
	)
}

// Utilisation
func EscapeHTML(input string) string {
	return policy.Sanitize(input)
}
