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

func Info(title, msg string) {
	baseLogger.Println(format(title+" |", blue, msg))
}

func Warn(title, msg string) {
	baseLogger.Println(format(title+" |", yellow, msg))
}

func Error(title, msg string) {
	baseLogger.Println(format(title+" |", red, msg))
}

func Success(title, msg string) {
	baseLogger.Println(format(title+" |", green, msg))
}

// Optionnel : activer/désactiver les couleurs globalement
func UseColor(b bool) {
	useColor = b
}
