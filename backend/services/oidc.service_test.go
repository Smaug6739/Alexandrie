package services

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestAvatarFromPicture(t *testing.T) {
	ptr := func(s string) *string { return &s }
	longURL := "https://example.com/" + strings.Repeat("a", maxAvatarURLLength)

	tests := []struct {
		name    string
		picture *string
		want    *string
	}{
		{"nil", nil, nil},
		{"empty", ptr(""), nil},
		{"https url", ptr("https://example.com/a.png"), ptr("https://example.com/a.png")},
		{"http url", ptr("http://example.com/a.png"), ptr("http://example.com/a.png")},
		{"svg data uri", ptr("data:image/svg+xml;base64," + strings.Repeat("A", 4000)), nil},
		{"url over limit", ptr(longURL), nil},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			assert.Equal(t, tt.want, avatarFromPicture(tt.picture))
		})
	}
}
