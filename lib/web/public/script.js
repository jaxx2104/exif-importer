class ExifImporterApp {
    constructor() {
        this.selectedFile = null;
        this.currentMetadata = null;
        this.currentXmlData = null;
        this.init();
    }

    async init() {
        await this.loadConfig();
        await this.loadFiles();
    }

    async loadConfig() {
        try {
            const response = await fetch('/api/config');
            const config = await response.json();
            
            const configContent = document.getElementById('config-content');
            configContent.innerHTML = `
                <div class="config-item">
                    <strong>拡張子:</strong> ${config.extension}
                </div>
                <div class="config-item">
                    <strong>対象ディレクトリ:</strong> ${config.targetDirectory}
                </div>
            `;
        } catch (error) {
            this.showError('config-content', '設定の読み込みに失敗しました: ' + error.message);
        }
    }

    async loadFiles() {
        try {
            const response = await fetch('/api/files');
            const files = await response.json();
            
            const filesContent = document.getElementById('files-content');
            
            if (files.length === 0) {
                filesContent.innerHTML = '<p>ファイルが見つかりませんでした。</p>';
                return;
            }
            
            const fileList = files.map(file => `
                <li class="file-item" data-filename="${file.name}">
                    <strong>${file.name}</strong><br>
                    <small>${file.path}</small>
                </li>
            `).join('');
            
            filesContent.innerHTML = `<ul class="file-list">${fileList}</ul>`;
            
            // Add click handlers to file items
            document.querySelectorAll('.file-item').forEach(item => {
                item.addEventListener('click', () => this.selectFile(item));
            });
            
        } catch (error) {
            this.showError('files-content', 'ファイル一覧の読み込みに失敗しました: ' + error.message);
        }
    }

    async selectFile(fileItem) {
        // Remove previous selection
        document.querySelectorAll('.file-item').forEach(item => {
            item.classList.remove('selected');
        });
        
        // Add selection to clicked item
        fileItem.classList.add('selected');
        
        this.selectedFile = fileItem.dataset.filename;
        await this.loadMetadata();
    }

    async loadMetadata() {
        if (!this.selectedFile) return;
        
        const metadataSection = document.getElementById('metadata-section');
        const metadataContent = document.getElementById('metadata-content');
        
        metadataSection.style.display = 'block';
        metadataContent.innerHTML = '<div class="loading">メタデータを読み込み中...</div>';
        
        try {
            // Load both metadata and XML data
            const [metadataResponse, xmlResponse] = await Promise.all([
                fetch(`/api/metadata/${this.selectedFile}`),
                fetch(`/api/xml/${this.selectedFile}`)
            ]);
            
            this.currentMetadata = await metadataResponse.json();
            this.currentXmlData = await xmlResponse.json();
            
            this.renderMetadata();
            
        } catch (error) {
            this.showError('metadata-content', 'メタデータの読み込みに失敗しました: ' + error.message);
        }
    }

    renderMetadata() {
        const metadataContent = document.getElementById('metadata-content');
        
        const metadataHtml = `
            <h3>EXIFメタデータ</h3>
            <div class="metadata-item">
                <label>作成日時:</label>
                <input type="text" id="createDate" value="${this.currentMetadata.createDate}" readonly>
            </div>
            <div class="metadata-item">
                <label>更新日時:</label>
                <input type="text" id="modifyDate" value="${this.currentMetadata.modifyDate}" readonly>
            </div>
            <div class="metadata-item">
                <label>GPS経度:</label>
                <input type="text" id="gpsLongitude" value="${this.currentMetadata.gpsLongitude}">
            </div>
            <div class="metadata-item">
                <label>GPS緯度:</label>
                <input type="text" id="gpsLatitude" value="${this.currentMetadata.gpsLatitude}">
            </div>
            <div class="metadata-item">
                <label>カメラモデル:</label>
                <input type="text" id="cameraModel" value="${this.currentMetadata.cameraModel}">
            </div>
            
            <h3>XMLデータ</h3>
            <div class="metadata-item">
                <label>XML内容 (JSON形式):</label>
                <textarea id="xmlData" rows="10" style="width: 100%; font-family: monospace; font-size: 12px;">
${JSON.stringify(this.currentXmlData, null, 2)}
                </textarea>
            </div>
            
            <button class="btn" onclick="app.saveMetadata()">メタデータを保存</button>
            <button class="btn btn-secondary" onclick="app.resetMetadata()">リセット</button>
        `;
        
        metadataContent.innerHTML = metadataHtml;
    }

    async saveMetadata() {
        if (!this.selectedFile) return;
        
        try {
            // Get updated XML data from textarea
            const xmlDataText = document.getElementById('xmlData').value;
            const updatedXmlData = JSON.parse(xmlDataText);
            
            const response = await fetch(`/api/xml/${this.selectedFile}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ xmlData: updatedXmlData })
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess('metadata-content', 'メタデータが正常に保存されました。');
                // Reload metadata to show updated values
                setTimeout(() => this.loadMetadata(), 1000);
            } else {
                throw new Error(result.error || '保存に失敗しました');
            }
            
        } catch (error) {
            this.showError('metadata-content', 'メタデータの保存に失敗しました: ' + error.message);
        }
    }

    resetMetadata() {
        if (this.currentMetadata && this.currentXmlData) {
            this.renderMetadata();
        }
    }

    showError(containerId, message) {
        const container = document.getElementById(containerId);
        container.innerHTML = `<div class="error">${message}</div>`;
    }

    showSuccess(containerId, message) {
        const container = document.getElementById(containerId);
        const existingContent = container.innerHTML;
        container.innerHTML = `<div class="success">${message}</div>` + existingContent;
    }
}

// Initialize the app when the page loads
const app = new ExifImporterApp();