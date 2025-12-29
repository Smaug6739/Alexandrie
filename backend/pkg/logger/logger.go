package logger

import (
	"fmt"
	"log"
	"os"
)

const (
	reset  = "\033[0m"
	green  = "\033[32m"
	red    = "\033[31m"
	yellow = "\033[33m"
	blue   = "\033[36m"
)

var useColor = true

var baseLogger = log.New(os.Stdout, "", 0)

func format(level string, color string, msg string) string {

	if useColor {
		return fmt.Sprintf("%s%s%s %s", color, level, reset, msg)
	}

	return fmt.Sprintf("%s %s", level, msg)
}

func Info(msg string) {
	baseLogger.Println(format("info |", blue, msg))
}

func Warn(msg string) {
	baseLogger.Println(format("warn |", yellow, msg))
}

func Error(msg string) {
	baseLogger.Println(format("error|", red, msg))
}

func Success(msg string) {
	baseLogger.Println(format("success|", green, msg))
}

// Optionnel : activer/désactiver les couleurs globalement
func UseColor(b bool) {
	useColor = b
}
