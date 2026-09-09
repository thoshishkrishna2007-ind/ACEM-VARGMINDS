-- ============================================================
-- ACEM VARGMINDS
-- DATABASE SEED DATA
-- ============================================================


-- ------------------------------------------------------------
-- SAMPLE USERS
-- ------------------------------------------------------------

INSERT INTO users
(
    name,
    email,
    password_hash,
    role,
    user_type,
    latitude,
    longitude,
    location
)
VALUES
(
    'Admin User',
    'admin@vargminds.com',
    'CHANGE_THIS_PASSWORD_HASH',
    'admin',
    'general',
    16.3067,
    80.4365,
    'Andhra Pradesh'
);


INSERT INTO users
(
    name,
    email,
    password_hash,
    role,
    user_type,
    latitude,
    longitude,
    location
)
VALUES
(
    'Demo Farmer',
    'farmer@example.com',
    'CHANGE_THIS_PASSWORD_HASH',
    'user',
    'farmer',
    16.3067,
    80.4365,
    'Andhra Pradesh'
);


INSERT INTo users
(
    name,
    email,
    password_hash,
    role,
    user_type,
    latitude,
    longitude,
    location
)
VALUES
(
    'Demo Student',
    'student@example.com',
    'CHANGE_THIS_PASSWORD_HASH',
    'user',
    'student',
    16.3067,
    80.4365,
    'Andhra Pradesh'
);


-- ------------------------------------------------------------
-- USER PREFERENCES
-- ------------------------------------------------------------

INSERT INTO user_preferences
(
    user_id,
    temperature_alert,
    rain_alert,
    wind_alert,
    storm_alert,
    flood_alert,
    notification_enabled
)
VALUES
(
    1,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE
);


INSERT INTO user_preferences
(
    user_id,
    temperature_alert,
    rain_alert,
    wind_alert,
    storm_alert,
    flood_alert,
    notification_enabled
)
VALUES
(
    1,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE
);


INSERT INTO user_preferences
(
    user_id,
    temperature_alert,
    rain_alert,
    wind_alert,
    storm_alert,
    flood_alert,
    notification_enabled
)
VALUES
(
    1,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE,
    TRUE
);


-- ------------------------------------------------------------
-- SAMPLE WEATHER DATA
-- ------------------------------------------------------------

INSERT INTO weather_data
(
    latitude,
    longitude,
    location,
    temperature,
    feels_like,
    humidity,
    rainfall,
    precipitation,
    wind_speed,
    weather_code
)
VALUES
(
    16.3067,
    80.4365,
    'Andhra Pradesh',
    32.5,
    35.2,
    78,
    2.5,
    3,
    18.4,
    61
);


-- ------------------------------------------------------------
-- SAMPLE FORECAST
-- ------------------------------------------------------------

INSERT INTO weather_forecast
(
    latitude,
    longitude,
    forecast_date,
    temperature_max,
    temperature_min,
    precipitation_probability,
    precipitation,
    wind_speed,
    weather_code
)
VALUES
(
    16.3067,
    80.4365,
    CURRENT_DATE,
    35,
    26.0,
    60,
    5.2,
    20,
    61
);


-- ------------------------------------------------------------
-- SAMPLE ALERT
-- ------------------------------------------------------------

INSERT INTO alerts
(
    alert_type,
    severity,
    title,
    message,
    ai_message,
    latitude,
    longitude,
    location
)
VALUES
(
    'RAIN',
    'HIGH',
    'Heavy Rain Alert',
    'Heavy rainfall is expected in your area.',
    'Heavy rainfall may affect outdoor activities and travel. Take suitable precautions and avoid flooded areas.',
    16.3067,
    80.4365,
    'Andhra Pradesh'
);


-- ------------------------------------------------------------
-- ASSIGN ALERT TO USERS
-- ------------------------------------------------------------

INSERT INTO user_alerts
(
    user_id,
    alert_id,
    is_read,
    delivered
)
VALUES
(
    2,
    1,
    FALSE,
    FALSE
);


INSERT INTO user_alerts
(
    user_id,
    alert_id,
    is_read,
    delivered
)
VALUES
(
    3,
    1,
    FALSE,
    FALSE
);


-- ------------------------------------------------------------
-- SAMPLE NOTIFICATION
-- ------------------------------------------------------------

INSERT INTO notifications
(
    user_id,
    alert_id,
    title,
    message,
    notification_type
)
VALUES
(
    2,
    1,
    'Heavy Rain Alert',
    'Heavy rainfall is expected in your area. Please take precautions.',
    'weather_alert'
);


-- ------------------------------------------------------------
-- SAMPLE AI ANALYSIS
-- ------------------------------------------------------------

INSERT INTO ai_analysis
(
    alert_id,
    user_type,
    prompt,
    response,
    model_name
)
VALUES
(
    1,
    'farmer',
    'Generate a weather safety recommendation for heavy rainfall.',
    'Heavy rainfall is expected. Protect vulnerable crops and avoid unnecessary outdoor activities during peak rainfall.',
    'llama3.2'
);


-- ------------------------------------------------------------
-- SYSTEM LOG
-- ------------------------------------------------------------

INSERT INTO system_logs
(
    level,
    service,
    message
)
VALUES
(
    'INFO',
    'database',
    'Initial database seed data inserted successfully.'
);
