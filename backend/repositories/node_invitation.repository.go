package repositories

import (
	"alexandrie/models"
	"alexandrie/types"
	"database/sql"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type NodeInvitationRepositoryImpl struct {
	db *sqlx.DB
}

type NodeInvitationRepository interface {
	GetByID(id types.Snowflake) (*models.NodeInvitation, error)
	GetByNode(nodeId types.Snowflake) ([]*models.NodeInvitation, error)
	GetByCode(code string) (*models.NodeInvitation, error)
	Create(invitation *models.NodeInvitation) (*models.NodeInvitation, error)
	Delete(id types.Snowflake) error
}

func NewNodeInvitationRepository(db *sqlx.DB) NodeInvitationRepository {
	return &NodeInvitationRepositoryImpl{db: db}
}

func (r *NodeInvitationRepositoryImpl) GetByID(id types.Snowflake) (*models.NodeInvitation, error) {
	var invitation models.NodeInvitation
	err := r.db.Get(&invitation, `
		SELECT id, invitation_code, permission_level, node_id, created_timestamp
		FROM permissions_invitations
		WHERE id = ?`, id)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get invitation: %w", err)
	}
	return &invitation, nil
}

func (r *NodeInvitationRepositoryImpl) GetByNode(nodeId types.Snowflake) ([]*models.NodeInvitation, error) {
	var invitations []*models.NodeInvitation
	err := r.db.Select(&invitations, `
		SELECT id, invitation_code, permission_level, node_id, created_timestamp
		FROM permissions_invitations
		WHERE node_id = ?
		ORDER BY created_timestamp DESC`, nodeId)
	if err != nil {
		return nil, fmt.Errorf("failed to query invitations: %w", err)
	}
	return invitations, nil
}

func (r *NodeInvitationRepositoryImpl) GetByCode(code string) (*models.NodeInvitation, error) {
	var invitation models.NodeInvitation
	err := r.db.Get(&invitation, `
		SELECT id, invitation_code, permission_level, node_id, created_timestamp
		FROM permissions_invitations
		WHERE invitation_code = ?`, code)
	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, fmt.Errorf("failed to get invitation by code: %w", err)
	}
	return &invitation, nil
}

func (r *NodeInvitationRepositoryImpl) Create(invitation *models.NodeInvitation) (*models.NodeInvitation, error) {
	_, err := r.db.NamedExec(`
		INSERT INTO permissions_invitations (id, invitation_code, permission_level, node_id, created_timestamp)
		VALUES (:id, :invitation_code, :permission_level, :node_id, :created_timestamp)`, invitation)
	if err != nil {
		return nil, fmt.Errorf("failed to create invitation: %w", err)
	}
	return invitation, nil
}

func (r *NodeInvitationRepositoryImpl) Delete(id types.Snowflake) error {
	_, err := r.db.Exec(`DELETE FROM permissions_invitations WHERE id = ?`, id)
	if err != nil {
		return fmt.Errorf("failed to delete invitation: %w", err)
	}
	return nil
}
