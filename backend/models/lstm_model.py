import numpy as np
from datetime import datetime, timedelta
from typing import List, Dict
import tensorflow as tf
from tensorflow import keras
from sklearn.preprocessing import MinMaxScaler

class LSTMPredictor:
    def __init__(self):
        self.model = self._build_model()
        self.scaler = MinMaxScaler(feature_range=(0, 1))
        self.sequence_length = 24
        self.trained = False

    def _build_model(self):
        """Build LSTM neural network architecture"""
        model = keras.Sequential([
            keras.layers.LSTM(128, return_sequences=True, input_shape=(24, 1)),
            keras.layers.Dropout(0.2),
            keras.layers.LSTM(64, return_sequences=True),
            keras.layers.Dropout(0.2),
            keras.layers.LSTM(32),
            keras.layers.Dropout(0.2),
            keras.layers.Dense(16, activation='relu'),
            keras.layers.Dense(1)
        ])

        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss='mse',
            metrics=['mae', 'mape']
        )

        return model

    def train(self, historical_data: np.ndarray, epochs: int = 50):
        """Train the LSTM model on historical energy data"""
        # Normalize data
        scaled_data = self.scaler.fit_transform(historical_data.reshape(-1, 1))

        # Create sequences
        X_train, y_train = [], []
        for i in range(self.sequence_length, len(scaled_data)):
            X_train.append(scaled_data[i-self.sequence_length:i, 0])
            y_train.append(scaled_data[i, 0])

        X_train, y_train = np.array(X_train), np.array(y_train)
        X_train = np.reshape(X_train, (X_train.shape[0], X_train.shape[1], 1))

        # Train model
        history = self.model.fit(
            X_train, y_train,
            epochs=epochs,
            batch_size=32,
            validation_split=0.2,
            verbose=1
        )

        self.trained = True
        return history

    def predict(self, hours_ahead: int = 24) -> List[Dict]:
        """Generate energy consumption predictions"""
        # Generate synthetic predictions for demo
        # In production, this would use the trained model

        base_time = datetime.utcnow()
        predictions = []

        # Simulate daily pattern
        for i in range(hours_ahead):
            timestamp = base_time + timedelta(hours=i)
            hour = timestamp.hour

            # Create realistic daily pattern
            if 0 <= hour < 6:
                base_value = 200 + np.random.normal(0, 20)
            elif 6 <= hour < 12:
                base_value = 300 + np.random.normal(0, 30)
            elif 12 <= hour < 18:
                base_value = 400 + np.random.normal(0, 40)
            else:
                base_value = 320 + np.random.normal(0, 25)

            predictions.append({
                "time": timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "hour": hour,
                "predicted_value": round(max(0, base_value), 2),
                "confidence": round(np.random.uniform(0.85, 0.98), 3),
                "lower_bound": round(max(0, base_value - 50), 2),
                "upper_bound": round(base_value + 50, 2)
            })

        return predictions

    def evaluate(self, test_data: np.ndarray) -> Dict:
        """Evaluate model performance"""
        if not self.trained:
            return {"error": "Model not trained yet"}

        # Prepare test data
        scaled_data = self.scaler.transform(test_data.reshape(-1, 1))

        X_test, y_test = [], []
        for i in range(self.sequence_length, len(scaled_data)):
            X_test.append(scaled_data[i-self.sequence_length:i, 0])
            y_test.append(scaled_data[i, 0])

        X_test, y_test = np.array(X_test), np.array(y_test)
        X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))

        # Evaluate
        loss, mae, mape = self.model.evaluate(X_test, y_test, verbose=0)

        return {
            "loss": float(loss),
            "mae": float(mae),
            "mape": float(mape),
            "accuracy": float(100 - mape)
        }

    def save_model(self, path: str):
        """Save trained model to disk"""
        self.model.save(path)

    def load_model(self, path: str):
        """Load trained model from disk"""
        self.model = keras.models.load_model(path)
        self.trained = True
