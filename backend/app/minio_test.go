package app

import (
	"context"
	"net/http"
	"net/http/httptest"
	"net/url"
	"sync"
	"testing"

	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
)

// newFakeS3 starts an S3-compatible server that accepts bucket creation but,
// like Garage, does not implement PutBucketPolicy.
func newFakeS3(t *testing.T) (*minio.Client, *[]string) {
	t.Helper()

	var mu sync.Mutex
	var requests []string

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		mu.Lock()
		requests = append(requests, r.Method+" "+r.URL.Path+"?"+r.URL.RawQuery)
		mu.Unlock()

		if r.Method == http.MethodPut && r.URL.Query().Has("policy") {
			w.Header().Set("Content-Type", "application/xml")
			w.WriteHeader(http.StatusNotImplemented)
			_, _ = w.Write([]byte(`<?xml version="1.0" encoding="UTF-8"?>
<Error><Code>NotImplemented</Code><Message>Unimplemented action: PutBucketPolicy</Message><Resource>` + r.URL.Path + `</Resource></Error>`))
			return
		}
		w.WriteHeader(http.StatusOK)
	}))
	t.Cleanup(server.Close)

	u, err := url.Parse(server.URL)
	if err != nil {
		t.Fatalf("failed to parse fake S3 URL: %v", err)
	}
	client, err := minio.New(u.Host, &minio.Options{
		Creds:  credentials.NewStaticV4("access", "secret", ""),
		Secure: false,
		Region: "us-east-1",
	})
	if err != nil {
		t.Fatalf("failed to create client: %v", err)
	}
	return client, &requests
}

func TestSetupPublicBucketWithoutPutBucketPolicySupport(t *testing.T) {
	client, requests := newFakeS3(t)

	// Before the fix this called os.Exit(1), killing the test binary.
	setupPublicBucket(context.Background(), client, "alexandrie")

	sawPolicy := false
	for _, r := range *requests {
		if r == "PUT /alexandrie/?policy=" {
			sawPolicy = true
		}
	}
	if !sawPolicy {
		t.Fatalf("expected a PutBucketPolicy request, got %v", *requests)
	}
}
