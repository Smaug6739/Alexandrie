package utils

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

// NewSnowflake creates a new Snowflake generator with automatically determined worker and process IDs
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

// Generate creates a new unique snowflake ID
func (s *Snowflake) Generate() types.Snowflake {
	timestamp := time.Now().UnixMilli()
	s.mutex.Lock()
	defer s.mutex.Unlock()

	if timestamp < s.epoch {
		panic("timestamp is before epoch")
	}

	s.increment = (s.increment + 1) & maxIncrement
	if s.increment == 0 {
		// Wait for next millisecond to avoid ID collisions
		for timestamp <= time.Now().UnixMilli() {
			timestamp = time.Now().UnixMilli()
		}
	}

	return types.Snowflake(((timestamp - s.epoch) << timestampShift) |
		(s.workerID << workerIDShift) |
		(s.processID << processIDShift) |
		s.increment)
}

// Deconstruct splits a snowflake ID into its components
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
