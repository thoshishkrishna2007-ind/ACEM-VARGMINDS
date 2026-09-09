-- ============================================================
-- ACEM VARGMINDS - WEATHER ALERT SYSTEM
-- DATABASE SCHEMA
-- ============================================================

-- ------------------------------------------------------------
-- 1. USERS TABLE
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,

    password_hash VARCHAR(255) NOT NULL,

    role VARCHAR(20) NOT NULL DEFAULT 'user',

    user_type VARCHAR(50) DEFAULT 'general',

    latitude DECIMAL(10, 7),

    longitude DECIMAL(10, 7),

    location VARCHAR(150),

    is_active BOOLEAN DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CHECK (role IN ('user', 'admin'))
);


-- ------------------------------------------------------------
-- 2. USER PREFERENCES TABLE
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,

    user_id INTEGER NOT NULL,

    temperature_alert BOOLEAN DEFAULT 1,

    rain_alert BOOLEAN DEFAULT 1,

    wind_alert BOOLEAN DEFAULT 1,

    storm_alert BOOLEAN DEFAULT 1,

    flood_alert BOOLEAN DEFAULT 1,

    notification_enabled BOOLEAN DEFAULT 1,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


-- ------------------------------------------------------------
-- 3. WEATHER DATA TABLE
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS weather_data (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,

    latitude DECIMAL(10, 7) NOT NULL,

    longitude DECIMAL(10, 7) NOT NULL,

    location VARCHAR(150),

    temperature DECIMAL(5, 2),

    feels_like DECIMAL(5, 2),

    humidity DECIMAL(5, 2),

    rainfall DECIMAL(8, 2),

    precipitation DECIMAL(8, 2),

    wind_speed DECIMAL(8, 2),

    weather_code INTEGER,

    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ------------------------------------------------------------
-- 4. WEATHER FORECAST TABLE
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS weather_forecast (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,

    latitude DECIMAL(10, 7) NOT NULL,

    longitude DECIMAL(10, 7) NOT NULL,

    forecast_date DATE NOT NULL,

    temperature_max DECIMAL(5, 2),

    temperature_min DECIMAL(5, 2),

    precipitation_probability INTEGER,

    precipitation DECIMAL(8, 2),

    wind_speed DECIMAL(8, 2),

    weather_code INTEGER,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ------------------------------------------------------------
-- 5. ALERTS TABLE
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,

    alert_type VARCHAR(50) NOT NULL,

    severity VARCHAR(20) NOT NULL,

    title VARCHAR(200) NOT NULL,

    message TEXT,

    ai_message TEXT,

    latitude DECIMAL(10, 7),

    longitude DECIMAL(10, 7),

    location VARCHAR(150),

    is_active BOOLEAN DEFAULT 1,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    expires_at TIMESTAMP,

    CHECK (
        severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
    )
);


-- ------------------------------------------------------------
-- 6. USER ALERTS TABLE
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS user_alerts (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,

    user_id INTEGER NOT NULL,

    alert_id INTEGER NOT NULL,

    is_read BOOLEAN DEFAULT 0,

    delivered BOOLEAN DEFAULT 0,

    delivered_at TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (alert_id)
        REFERENCES alerts(id)
        ON DELETE CASCADE
);


-- ------------------------------------------------------------
-- 7. NOTIFICATIONS TABLE
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,

    user_id INTEGER NOT NULL,

    alert_id INTEGER,

    title VARCHAR(200) NOT NULL,

    message TEXT NOT NULL,

    notification_type VARCHAR(50) DEFAULT 'weather_alert',

    is_read BOOLEAN DEFAULT 0,

    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (alert_id)
        REFERENCES alerts(id)
        ON DELETE SET NULL
);


-- ------------------------------------------------------------
-- 8. AI ANALYSIS TABLE
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ai_analysis (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,

    alert_id INTEGER,

    user_type VARCHAR(50),

    prompt TEXT,

    response TEXT,

    model_name VARCHAR(100),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (alert_id)
        REFERENCES alerts(id)
        ON DELETE CASCADE
);


-- ------------------------------------------------------------
-- 9. SYSTEM LOGS TABLE
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS system_logs (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,

    level VARCHAR(20) DEFAULT 'INFO',

    service VARCHAR(100),

    message TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_users_email
ON users(email);

CREATE INDEX idx_weather_location
ON weather_data(latitude, longitude);

CREATE INDEX idx_weather_recorded
ON weather_data(recorded_at);

CREATE INDEX idx_alert_type
ON alerts(alert_type);

CREATE INDEX idx_alert_severity
ON alerts(severity);

CREATE INDEX idx_alert_created
ON alerts(created_at);

CREATE INDEX idx_notifications_user
ON notifications(user_id);

CREATE INDEX idx_notifications_read
ON notifications(is_read);

CREATE INDEX idx_ai_alert
ON ai_analysis(alert_id);
