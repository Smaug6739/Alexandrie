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
	PermNone  NodePermissionLevel = iota // No access
	PermRead                             // Read access
	PermWrite                            // Write access
	PermAdmin                            // Admin access
	PermOwner                            // Full control, including managing permissions
)

// NodeAction define actions that can be performed on nodes
type NodeAction int

const (
	ActionRead NodeAction = iota + 1
	ActionUpdate
	ActionDelete
	ActionShare
	ActionManagePermissions
)

func (a NodeAction) RequiredLevel() NodePermissionLevel {
	switch a {
	case ActionRead:
		return PermRead
	case ActionUpdate:
		return PermWrite
	case ActionDelete, ActionShare:
		return PermAdmin
	case ActionManagePermissions:
		return PermOwner
	default:
		return PermOwner
	}
}
