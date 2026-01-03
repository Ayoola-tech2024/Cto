import React, { useState, useEffect } from 'react';
import './IdeaEditor.css';

const IdeaEditor = ({ idea, onSave, readOnly }) => {
  const [title, setTitle] = useState(idea.title);
  const [content, setContent] = useState(idea.content || '');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setTitle(idea.title);
    setContent(idea.content || '');
  }, [idea]);

  useEffect(() => {
    const changed = title !== idea.title || content !== (idea.content || '');
    setHasChanges(changed);
  }, [title, content, idea]);

  const handleSave = async () => {
    if (!hasChanges) return;
    
    try {
      await onSave(title, content);
      setHasChanges(false);
    } catch (error) {
      alert('Failed to save changes');
    }
  };

  return (
    <div className="idea-editor">
      <div className="editor-header">
        {hasChanges && !readOnly && (
          <button className="save-button" onClick={handleSave}>
            💾 Save Changes
          </button>
        )}
        {readOnly && (
          <span className="readonly-badge">👁️ Read-only</span>
        )}
      </div>

      <input
        type="text"
        className="editor-title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Idea title..."
        disabled={readOnly}
      />

      <textarea
        className="editor-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your idea here..."
        disabled={readOnly}
      />
    </div>
  );
};

export default IdeaEditor;
