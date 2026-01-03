const pool = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class PublicShare {
  static async create(ideaId) {
    const shareToken = uuidv4();
    const result = await pool.query(
      'INSERT INTO public_shares (idea_id, share_token) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
      [ideaId, shareToken]
    );
    if (result.rows.length === 0) {
      const existing = await pool.query(
        'SELECT * FROM public_shares WHERE idea_id = $1',
        [ideaId]
      );
      return existing.rows[0];
    }
    return result.rows[0];
  }

  static async findByToken(token) {
    const result = await pool.query(
      'SELECT ps.*, i.*, u.username as owner_username FROM public_shares ps JOIN ideas i ON ps.idea_id = i.id JOIN users u ON i.user_id = u.id WHERE ps.share_token = $1',
      [token]
    );
    return result.rows[0];
  }

  static async findByIdeaId(ideaId) {
    const result = await pool.query(
      'SELECT * FROM public_shares WHERE idea_id = $1',
      [ideaId]
    );
    return result.rows[0];
  }

  static async delete(ideaId) {
    await pool.query('DELETE FROM public_shares WHERE idea_id = $1', [ideaId]);
  }
}

module.exports = PublicShare;
