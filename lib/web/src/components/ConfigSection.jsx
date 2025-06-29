import React from 'react'

function ConfigSection({ config }) {
  if (!config) {
    return (
      <div className="config-section">
        <h2>設定情報</h2>
        <div className="loading">設定を読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="config-section">
      <h2>設定情報</h2>
      <div className="config-item">
        <strong>対応拡張子:</strong> {config.extensions.join(', ')}
      </div>
      <div className="config-item">
        <strong>対象ディレクトリ:</strong> {config.targetDirectory}
      </div>
    </div>
  )
}

export default ConfigSection