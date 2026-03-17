/* Add these styles to your existing style.css */

/* Stop Button */
.btn-stop {
    background: #dc3545;
    color: white;
    border: none;
    padding: 15px 40px;
    border-radius: 50px;
    font-size: 1.2em;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    display: none;
    align-items: center;
    gap: 10px;
    box-shadow: 0 10px 20px rgba(220, 53, 69, 0.3);
}

.btn-stop:hover {
    background: #c82333;
    transform: translateY(-2px);
    box-shadow: 0 15px 30px rgba(220, 53, 69, 0.4);
}

/* Progress Details */
.progress-details {
    text-align: center;
    color: #666;
    font-size: 0.9em;
    margin-top: 5px;
    font-family: monospace;
}

/* Error Numbers Section */
.result-card.error-card .result-header {
    background: #ffc107;
    color: #333;
    border-bottom-color: #e0a800;
}

.error-card .number-item {
    border-left-color: #ffc107;
    background: #fff3cd;
}

/* Number Items */
.number-item.dnc-item {
    border-left-color: #dc3545;
}

.number-item.clean-item {
    border-left-color: #28a745;
}

.number-item.error-item {
    border-left-color: #ffc107;
}

/* Download Buttons */
.btn-download {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    transition: all 0.3s;
    margin-left: 5px;
}

.btn-download:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
}

.btn-download-all {
    background: #6c757d;
    color: white;
    border: none;
    padding: 12px 25px;
    border-radius: 25px;
    font-size: 1em;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    margin: 20px auto 0;
    display: flex;
    align-items: center;
    gap: 10px;
    width: fit-content;
}

.btn-download-all:hover {
    background: #5a6268;
    transform: translateY(-2px);
}

/* Action Buttons Container */
.action-section {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
    justify-content: center;
    flex-wrap: wrap;
}
