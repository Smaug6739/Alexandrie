package utils

import (
	"github.com/microcosm-cc/bluemonday"
)

var policy *bluemonday.Policy

// InitBluemonday initializes the sanitization policy for user-generated content (UGC).
// The policy allows safe HTML elements, attributes, and MathML/KaTeX elements while preventing XSS.
func InitBluemonday() {
	policy = bluemonday.UGCPolicy()
	policy.AllowDataAttributes()

	// -------------------------------
	// ALLOW HTML ELEMENTS
	// -------------------------------
	// Text formatting
	policy.AllowElements("b", "i", "u", "strong", "em", "small", "mark")
	policy.AllowElements("br", "hr")

	// Lists
	policy.AllowElements("ul", "ol", "li", "dl", "dt", "dd")

	// Tables
	policy.AllowElements("table", "thead", "tbody", "tfoot", "tr", "th", "td")

	// Code / preformatted
	policy.AllowElements("code", "pre")

	// Blockquote
	policy.AllowElements("blockquote")

	// Forms (use with caution)
	policy.AllowElements("input", "textarea", "button", "label", "select", "option", "fieldset", "legend")

	// Multimedia
	policy.AllowElements("audio", "video")

	// Custom elements for frontend rendering
	policy.AllowElements("tag")

	// KaTeX / MathML
	policy.AllowElements(
		"math", "maction", "annotation", "annotation-xml",
		"menclose", "merror",
		"mfenced", "mfrac", "mi", "mmultiscripts",
		"mn", "mo", "mover", "mpadded", "mphantom",
		"mprescripts", "mroot", "mrow", "ms", "semantics",
		"mspace", "msqrt", "mstyle", "msub", "msup",
		"msubsup", "mtable", "mtd", "mtext", "mtr",
		"mtimes", "munder", "munderover",
	)

	// SVG elements for math/graphics
	policy.AllowElements("svg", "path", "line", "polygon", "polyline", "rect", "circle", "ellipse", "text", "g", "style")

	// -------------------------------
	// ALLOW ATTRIBUTES
	// -------------------------------
	// Global attributes
	policy.AllowAttrs(
		"class", "id", "style", "tabindex", "aria-hidden", "display",
		"xmlns", "encoding", "accent", "width", "height", "type", "title",
	).Globally()

	// Custom color attributes (safe, never interpreted as HTML/JS)
	policy.AllowAttrs(
		"grey", "blue", "red", "green", "yellow", "purple", "orange", "teal", "pink", "primary",
	).Globally()

	// SVG-specific attributes
	policy.AllowAttrs(
		"viewBox", "fill-rule", "d", "x", "y", "cx", "cy", "r", "rx", "ry", "points", "stroke", "stroke-width", "fill", "preserveAspectRatio", "xmlns",
	).OnElements("svg", "path", "line", "polygon", "polyline", "rect", "circle", "ellipse", "text")

	// Links
	policy.AllowAttrs("href", "rel").OnElements("a")

	// Form attributes
	policy.AllowAttrs("checked").OnElements("input")

	// Disable automatic rel="nofollow"
	policy.RequireNoFollowOnLinks(false)

	// -------------------------------
	// ELEMENTS THAT MUST HAVE NO ATTRIBUTES
	// -------------------------------
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

// EscapeHTML sanitizes user input to prevent XSS attacks
func EscapeHTML(input *string) string {
	if input == nil || *input == "" {
		return ""
	}
	return policy.Sanitize(*input)
}
