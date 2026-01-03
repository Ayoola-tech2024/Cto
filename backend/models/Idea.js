const pool = require('../config/database');

class Idea {
  static async create(userId, title, content) {
    const result = await pool.query(
      'INSERT INTO ideas (user_id, title, content) VALUES ($1, $2, $3) RETURNING *',
      [userId, title, content]
    );
    return result.rows[0];
  }

  static async findById(id) {
    const result = await pool.query(
      'SELECT i.*, u.username as owner_username, u.email as owner_email FROM ideas i JOIN users u ON i.user_id = u.id WHERE i.id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByUserId(userId) {
    const result = await pool.query(
      'SELECT * FROM ideas WHERE user_id = $1 ORDER BY updated_at DESC',
      [userId]
    );
    return result.rows;
  }

  static async findSharedWithUser(userId) {
    const result = await pool.query(
      `SELECT i.*, u.username as owner_username, u.email as owner_email, ic.permission_level 
       FROM ideas i 
       JOIN idea_collaborators ic ON i.id = ic.idea_id 
       JOIN users u ON i.user_id = u.id
       WHERE ic.user_id = $1 
       ORDER BY i.updated_at DESC`,
      [userId]
    );
    return result.rows;
  }

  static async update(id, title, content) {
    const result = await pool.query(
      'UPDATE ideas SET title = $1, content = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [title, content, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await pool.query('DELETE FROM ideas WHERE id = $1', [id]);
  }

  static async addCollaborator(ideaId, userId, permissionLevel = 'edit') {
    const result = await pool.query(
      'INSERT INTO idea_collaborators (idea_id, user_id, permission_level) VALUES ($1, $2, $3) ON CONFLICT (idea_id, user_id) DO UPDATE SET permission_level = $3 RETURNING *',
      [ideaId, userId, permissionLevel]
    );
    return result.rows[0];
  }

  static async removeCollaborator(ideaId, userId) {
    await pool.query(
      'DELETE FROM idea_collaborators WHERE idea_id = $1 AND user_id = $2',
      [ideaId, userId]
    );
  }

  static async getCollaborators(ideaId) {
    const result = await pool.query(
      `SELECT u.id, u.username, u.email, ic.permission_level, ic.added_at 
       FROM users u 
       JOIN idea_collaborators ic ON u.id = ic.user_id 
       WHERE ic.idea_id = $1`,
      [ideaId]
    );
    return result.rows;
  }

  static async hasAccess(ideaId, userId) {
    const result = await pool.query(
      `SELECT 1 FROM ideas WHERE id = $1 AND user_id = $2
       UNION
       SELECT 1 FROM idea_collaborators WHERE idea_id = $1 AND user_id = $2`,
      [ideaId, userId]
    );
    return result.rows.length > 0;
  }

  static async isOwner(ideaId, userId) {
    const result = await pool.query(
      'SELECT 1 FROM ideas WHERE id = $1 AND user_id = $2',
      [ideaId, userId]
    );
    return result.rows.length > 0;
  }
}

module.exports = Idea;
