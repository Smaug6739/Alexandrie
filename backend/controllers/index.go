package controllers

import (
	"alexandrie/app"
	"alexandrie/permissions"
)

type Controller struct {
	app        *app.App
	authorizer permissions.Authorizer
}
