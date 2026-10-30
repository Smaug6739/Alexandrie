package snowflake

import (
	"alexandrie/types"
	"os"
	"sync"
	"time"
)

const (
	workerIDBits   = 5
	processIDBits  = 5
	incrementBits  = 12
	timestampShift = workerIDBits + processIDBits + incrementBits
	workerIDShift  = processIDBits + incrementBits
	processIDShift = incrementBits

	maxWorkerID  = (1 << workerIDBits) - 1
	maxProcessID = (1 << processIDBits) - 1
	maxIncrement = (1 << incrementBits) - 1
)

type Snowflake struct {
	epoch     int64
	workerID  int64
	processID int64
	increment int64
	mutex     sync.Mutex
}

func NewSnowflake(epoch int64) *Snowflake {
	workerID := int64(os.Getpid() & maxWorkerID)
	processID := int64(os.Getppid() & maxProcessID)

	return &Snowflake{
		epoch:     epoch,
		workerID:  workerID,
		processID: processID,
		increment: 0,
	}
}

func (s *Snowflake) Generate() types.Snowflake {
	s.mutex.Lock()
	defer s.mutex.Unlock()
	// Read the clock under the lock, so timestamps never go backwards in call order.
	timestamp := time.Now().UnixMilli()

	if timestamp < s.epoch {
		panic("timestamp is before epoch")
	}

	s.increment = (s.increment + 1) & maxIncrement
	if s.increment == 0 {
		// The increment wrapped, so it will repeat values handed out since the last
		// wrap: move to a later millisecond so none of those IDs can recur. (The old
		// loop here waited while the clock was *not* behind, which is always, and
		// hung every caller after 4,095 IDs.)
		for next := time.Now().UnixMilli(); ; next = time.Now().UnixMilli() {
			if next > timestamp {
				timestamp = next
				break
			}
		}
	}

	return types.Snowflake(((timestamp - s.epoch) << timestampShift) |
		(s.workerID << workerIDShift) |
		(s.processID << processIDShift) |
		s.increment)
}

func (s *Snowflake) Deconstruct(id int64) map[string]int64 {
	return map[string]int64{
		"id":        id,
		"timestamp": (id >> timestampShift) + s.epoch,
		"workerID":  (id >> workerIDShift) & maxWorkerID,
		"processID": (id >> processIDShift) & maxProcessID,
		"increment": id & maxIncrement,
		"epoch":     s.epoch,
	}
}
