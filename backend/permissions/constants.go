package permissions

// UserRole define global user roles (app level)
type UserRole int

const (
	RoleNone          UserRole = 0
	RoleAdministrator UserRole = 1 << 1
	RoleManager       UserRole = 1 << 2
	RoleModerator     UserRole = 1 << 3
)

// NodePermissionLevel define permission levels on nodes
type NodePermissionLevel int

const (
	PermNone NodePermissionLevel = iota
	PermRead
	PermWrite
	PermAdmin
	PermOwner
)

// NodeAction define actions that can be performed on nodes
type NodeAction int

const (
	ActionRead NodeAction = iota + 1
	ActionUpdate
	ActionDelete
	ActionShare
)

func (a NodeAction) RequiredLevel() NodePermissionLevel {
	switch a {
	case ActionRead:
		return PermRead
	case ActionUpdate:
		return PermWrite
	case ActionDelete, ActionShare:
		return PermAdmin
	default:
		return PermNone
	}
}
