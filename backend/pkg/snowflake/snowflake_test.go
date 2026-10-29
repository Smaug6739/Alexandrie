package snowflake

import (
	"sync"
	"testing"
	"time"

	"alexandrie/types"
)

// generateWithin runs fn and fails the test if it has not returned within limit.
func generateWithin(t *testing.T, limit time.Duration, fn func()) {
	t.Helper()
	done := make(chan struct{})
	go func() { fn(); close(done) }()
	select {
	case <-done:
	case <-time.After(limit):
		t.Fatalf("ID generation still running after %s: the sequence wrap hangs", limit)
	}
}

// The increment wraps every 4,096 IDs; before the fix the wrap spun forever
// holding the mutex, so the 4,096th ID and every later one never came back.
func TestGenerateKeepsGoingPastTheSequenceWrap(t *testing.T) {
	ids := NewSnowflake(1609459200000)
	seen := make(map[types.Snowflake]struct{}, 3*4096)
	generateWithin(t, 10*time.Second, func() {
		for range 3*4096 + 7 {
			seen[ids.Generate()] = struct{}{}
		}
	})
	if len(seen) != 3*4096+7 {
		t.Fatalf("%d unique IDs out of %d", len(seen), 3*4096+7)
	}
}

func TestGenerateIsUniqueAcrossGoroutines(t *testing.T) {
	ids := NewSnowflake(1609459200000)
	const workers, each = 8, 2500 // 20,000 IDs: several wraps under contention
	results := make([][]types.Snowflake, workers)
	generateWithin(t, 20*time.Second, func() {
		var wg sync.WaitGroup
		for w := range workers {
			wg.Add(1)
			go func() {
				defer wg.Done()
				for range each {
					results[w] = append(results[w], ids.Generate())
				}
			}()
		}
		wg.Wait()
	})
	seen := make(map[types.Snowflake]struct{}, workers*each)
	for _, batch := range results {
		for _, id := range batch {
			if _, dup := seen[id]; dup {
				t.Fatalf("duplicate ID %d", id)
			}
			seen[id] = struct{}{}
		}
	}
}
