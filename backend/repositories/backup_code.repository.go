package repositories

import (
	"alexandrie/models"
	"alexandrie/types"
	"fmt"

	"github.com/jmoiron/sqlx"
)

type BackupCodesRepositoryImpl struct {
	db *sqlx.DB
}

type BackupCodesRepository interface {
	Create(codes []models.UserTOTPRecoveryCode) error
	GetActiveCodesByUserId(userId types.Snowflake) ([]models.UserTOTPRecoveryCode, error)
	MarkAsUsed(id types.Snowflake) error
	DeleteByUserId(userId types.Snowflake) error
}

func NewBackupCodesRepository(db *sqlx.DB) BackupCodesRepository {
	return &BackupCodesRepositoryImpl{db: db}
}

func (r *BackupCodesRepositoryImpl) Create(codes []models.UserTOTPRecoveryCode) error {
	if len(codes) == 0 {
		return nil
	}

	tx, err := r.db.Beginx()
	if err != nil {
		return fmt.Errorf("failed to start transaction for backup codes: %w", err)
	}
	defer tx.Rollback()

	for _, code := range codes {
		_, err := tx.NamedExec(`INSERT INTO user_totp_recovery_codes (id, user_id, code, used, created_timestamp) VALUES (:id, :user_id, :code, :used, :created_timestamp)`, &code)
		if err != nil {
			return fmt.Errorf("failed to insert backup code %d: %w", code.Id, err)
		}
	}

	if err := tx.Commit(); err != nil {
		return fmt.Errorf("failed to commit backup codes transaction: %w", err)
	}

	return nil
}

func (r *BackupCodesRepositoryImpl) GetActiveCodesByUserId(userId types.Snowflake) ([]models.UserTOTPRecoveryCode, error) {
	var codes []models.UserTOTPRecoveryCode

	err := r.db.Select(&codes, `
		SELECT id, user_id, code, used, created_timestamp 
		FROM user_totp_recovery_codes 
		WHERE user_id = ? AND used = FALSE
	`, userId)
	if err != nil {
		return nil, fmt.Errorf("failed to select active backup codes: %w", err)
	}

	return codes, nil
}

func (r *BackupCodesRepositoryImpl) MarkAsUsed(id types.Snowflake) error {
	query := `UPDATE user_totp_recovery_codes SET used = TRUE WHERE id = ?`

	_, err := r.db.Exec(query, id)
	if err != nil {
		return fmt.Errorf("failed to mark backup code as used: %w", err)
	}

	return nil
}

func (r *BackupCodesRepositoryImpl) DeleteByUserId(userId types.Snowflake) error {
	query := `DELETE FROM user_totp_recovery_codes WHERE user_id = ?`

	_, err := r.db.Exec(query, userId)
	if err != nil {
		return fmt.Errorf("failed to delete backup codes for user: %w", err)
	}

	return nil
}
