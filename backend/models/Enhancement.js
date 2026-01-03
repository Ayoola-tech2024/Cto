const pool = require('../config/database');

class Enhancement {
  static async create(ideaId, originalContent, enhancedContent) {
    const result = await pool.query(
      'INSERT INTO enhancements (idea_id, original_content, enhanced_content) VALUES ($1, $2, $3) RETURNING *',
      [ideaId, originalContent, enhancedContent]
    );
    return result.rows[0];
  }

  static async findByIdeaId(ideaId) {
    const result = await pool.query(
      'SELECT * FROM enhancements WHERE idea_id = $1 ORDER BY created_at DESC',
      [ideaId]
    );
    return result.rows;
  }
}

module.exports = Enhancement;
