-- ACEM-VARGMINDS MVP schema
-- Runtime: SQLite by default
-- SQLAlchemy models are the runtime source of truth.

PRAGMA foreign_keys = ON;

-- ============================================================
-- 1. ROLES
-- ============================================================

CREATE TABLE IF NOT EXISTS roles (
    id INTEGER NOT NULL PRIMARY KEY,
    name VARCHAR(50) UNIQUE,
    description VARCHAR(255)
);

-- ============================================================
-- 2. USERS
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    id INTEGER NOT NULL PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    designation VARCHAR(50) DEFAULT 'General User',
    location VARCHAR(150),
    latitude VARCHAR(30),
    longitude VARCHAR(30),
    is_active BOOLEAN NOT NULL DEFAULT 1,
    created_at DATETIME,
    updated_at DATETIME,
    CHECK (role IN ('user', 'admin'))
);

-- ============================================================
-- 3. USER PREFERENCES
-- ============================================================

CREATE TABLE IF NOT EXISTS user_preferences (
    id INTEGER NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE,

    notification_enabled BOOLEAN NOT NULL DEFAULT 1,
    temperature_alert BOOLEAN NOT NULL DEFAULT 1,
    rain_alert BOOLEAN NOT NULL DEFAULT 1,
    wind_alert BOOLEAN NOT NULL DEFAULT 1,
    storm_alert BOOLEAN NOT NULL DEFAULT 1,
    flood_alert BOOLEAN NOT NULL DEFAULT 1,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

-- ============================================================
-- 4. WEATHER LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS weather_logs (
    id INTEGER NOT NULL PRIMARY KEY,
    location VARCHAR(100),
    latitude FLOAT,
    longitude FLOAT,
    temperature FLOAT,
    humidity FLOAT,
    precipitation FLOAT,
    rainfall FLOAT,
    wind_speed FLOAT,
    condition VARCHAR(100),
    weather_code INTEGER,
    recorded_at DATETIME
);

-- ============================================================
-- 5. WEATHER FORECAST
-- ============================================================

CREATE TABLE IF NOT EXISTS weather_forecast (
    id INTEGER NOT NULL PRIMARY KEY,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    forecast_date DATE NOT NULL,
    temperature_max FLOAT,
    temperature_min FLOAT,
    precipitation_probability INTEGER,
    precipitation FLOAT,
    wind_speed FLOAT,
    weather_code INTEGER,
    created_at DATETIME
);

-- ============================================================
-- 6. ALERTS
-- ============================================================

CREATE TABLE IF NOT EXISTS alerts (
    id INTEGER NOT NULL PRIMARY KEY,

    alert_type VARCHAR(50) NOT NULL DEFAULT 'weather',
    severity VARCHAR(20) NOT NULL DEFAULT 'LOW',
    title VARCHAR(200) NOT NULL,

    description VARCHAR(1000),
    message TEXT,
    ai_message VARCHAR(2000),

    location VARCHAR(150),
    latitude FLOAT,
    longitude FLOAT,

    is_active BOOLEAN NOT NULL DEFAULT 1,
    is_read BOOLEAN NOT NULL DEFAULT 0,

    created_at DATETIME,
    expires_at DATETIME,

    CHECK (
        severity IN ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')
    )
);

-- ============================================================
-- 7. USER ALERTS
-- ============================================================

CREATE TABLE IF NOT EXISTS user_alerts (
    id INTEGER NOT NULL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    alert_id INTEGER NOT NULL,

    is_read BOOLEAN NOT NULL DEFAULT 0,
    delivered BOOLEAN NOT NULL DEFAULT 0,
    delivered_at DATETIME,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (alert_id)
        REFERENCES alerts(id)
        ON DELETE CASCADE
);

-- ============================================================
-- 8. NOTIFICATIONS
-- ============================================================

CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER NOT NULL PRIMARY KEY,

    user_id INTEGER NOT NULL,
    alert_id INTEGER,

    title VARCHAR(200) NOT NULL DEFAULT 'Weather update',
    message VARCHAR(1000) NOT NULL,

    notification_type VARCHAR(50) DEFAULT 'weather_alert',
    is_read BOOLEAN NOT NULL DEFAULT 0,

    sent_at DATETIME,
    created_at DATETIME,

    FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    FOREIGN KEY (alert_id)
        REFERENCES alerts(id)
        ON DELETE SET NULL
);

-- ============================================================
-- 9. AI ANALYSIS
-- ============================================================

CREATE TABLE IF NOT EXISTS ai_analysis (
    id INTEGER NOT NULL PRIMARY KEY,

    alert_id INTEGER,
    user_type VARCHAR(50),

    prompt TEXT,
    response TEXT,
    model_name VARCHAR(100),

    created_at DATETIME,

    FOREIGN KEY (alert_id)
        REFERENCES alerts(id)
        ON DELETE CASCADE
);

-- ============================================================
-- 10. SYSTEM LOGS
-- ============================================================

CREATE TABLE IF NOT EXISTS system_logs (
    id INTEGER NOT NULL PRIMARY KEY,

    level VARCHAR(20) DEFAULT 'INFO',
    service VARCHAR(100),
    message TEXT,

    created_at DATETIME
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS ix_roles_name
ON roles(name);

CREATE INDEX IF NOT EXISTS ix_users_id
ON users(id);

CREATE INDEX IF NOT EXISTS ix_users_username
ON users(username);

CREATE INDEX IF NOT EXISTS ix_users_email
ON users(email);

CREATE INDEX IF NOT EXISTS ix_user_preferences_id
ON user_preferences(id);

CREATE INDEX IF NOT EXISTS ix_weather_logs_id
ON weather_logs(id);

CREATE INDEX IF NOT EXISTS ix_weather_logs_location
ON weather_logs(location);

CREATE INDEX IF NOT EXISTS ix_weather_logs_coordinates
ON weather_logs(latitude, longitude);

CREATE INDEX IF NOT EXISTS ix_weather_logs_recorded
ON weather_logs(recorded_at);

CREATE INDEX IF NOT EXISTS ix_weather_forecast_coordinates
ON weather_forecast(latitude, longitude);

CREATE INDEX IF NOT EXISTS ix_alerts_id
ON alerts(id);

CREATE INDEX IF NOT EXISTS ix_alerts_title
ON alerts(title);

CREATE INDEX IF NOT EXISTS ix_alerts_type
ON alerts(alert_type);

CREATE INDEX IF NOT EXISTS ix_alerts_severity
ON alerts(severity);

CREATE INDEX IF NOT EXISTS ix_alerts_location
ON alerts(location);

CREATE INDEX IF NOT EXISTS ix_alerts_created
ON alerts(created_at);

CREATE INDEX IF NOT EXISTS ix_notifications_id
ON notifications(id);

CREATE INDEX IF NOT EXISTS ix_notifications_user
ON notifications(user_id);

CREATE INDEX IF NOT EXISTS ix_notifications_read
ON notifications(is_read);

CREATE INDEX IF NOT EXISTS ix_ai_analysis_alert
ON ai_analysis(alert_id);