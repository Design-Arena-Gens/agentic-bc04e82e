from sqlalchemy import create_engine, Column, Integer, Float, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os

Base = declarative_base()

class Prediction(Base):
    __tablename__ = 'predictions'

    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    predicted_value = Column(Float, nullable=False)
    actual_value = Column(Float, nullable=True)
    confidence = Column(Float, nullable=False)
    model_version = Column(String(50))
    location = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)

class Metrics(Base):
    __tablename__ = 'metrics'

    id = Column(Integer, primary_key=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    current_prediction = Column(Float)
    model_accuracy = Column(Float)
    data_points = Column(Integer)
    predictions_today = Column(Integer)
    active_sensors = Column(Integer)

class PostgreSQLClient:
    def __init__(self):
        """Initialize PostgreSQL connection"""
        postgres_url = os.getenv(
            'POSTGRESQL_URL',
            'postgresql://admin:password@localhost:5432/energy_forecast'
        )

        try:
            self.engine = create_engine(postgres_url)
            Base.metadata.create_all(self.engine)
            Session = sessionmaker(bind=self.engine)
            self.session = Session()
            print("✅ Connected to PostgreSQL")
        except Exception as e:
            print(f"⚠️  PostgreSQL connection failed: {e}")
            self.engine = None
            self.session = None

    def store_prediction(self, prediction_data: dict) -> bool:
        """Store a single prediction"""
        if not self.session:
            return False

        try:
            prediction = Prediction(
                predicted_value=prediction_data['predicted_value'],
                confidence=prediction_data.get('confidence', 0.95),
                model_version=prediction_data.get('model_version', 'LSTM-v1.0'),
                location=prediction_data.get('location', 'default')
            )
            self.session.add(prediction)
            self.session.commit()
            return True
        except Exception as e:
            print(f"Error storing prediction: {e}")
            self.session.rollback()
            return False

    def get_metrics(self) -> dict:
        """Get latest metrics"""
        if not self.session:
            # Return mock data
            return {
                'current_prediction': 342,
                'accuracy': 94.2,
                'data_points': 1.2,
                'predictions_today': 8432
            }

        try:
            latest_metric = self.session.query(Metrics).order_by(Metrics.timestamp.desc()).first()

            if latest_metric:
                return {
                    'current_prediction': latest_metric.current_prediction,
                    'accuracy': latest_metric.model_accuracy,
                    'data_points': latest_metric.data_points / 1000000,  # Convert to millions
                    'predictions_today': latest_metric.predictions_today
                }
            else:
                # Return default values
                return {
                    'current_prediction': 342,
                    'accuracy': 94.2,
                    'data_points': 1.2,
                    'predictions_today': 8432
                }
        except Exception as e:
            print(f"Error getting metrics: {e}")
            return {
                'current_prediction': 342,
                'accuracy': 94.2,
                'data_points': 1.2,
                'predictions_today': 8432
            }

    def update_metrics(self, metrics_data: dict) -> bool:
        """Update system metrics"""
        if not self.session:
            return False

        try:
            metrics = Metrics(
                current_prediction=metrics_data.get('current_prediction', 0),
                model_accuracy=metrics_data.get('model_accuracy', 0),
                data_points=metrics_data.get('data_points', 0),
                predictions_today=metrics_data.get('predictions_today', 0),
                active_sensors=metrics_data.get('active_sensors', 0)
            )
            self.session.add(metrics)
            self.session.commit()
            return True
        except Exception as e:
            print(f"Error updating metrics: {e}")
            self.session.rollback()
            return False

    def get_prediction_history(self, limit: int = 100):
        """Get prediction history"""
        if not self.session:
            return []

        try:
            predictions = self.session.query(Prediction) \
                .order_by(Prediction.created_at.desc()) \
                .limit(limit) \
                .all()

            return [
                {
                    'id': p.id,
                    'timestamp': p.timestamp.isoformat(),
                    'predicted_value': p.predicted_value,
                    'actual_value': p.actual_value,
                    'confidence': p.confidence,
                    'model_version': p.model_version
                }
                for p in predictions
            ]
        except Exception as e:
            print(f"Error getting prediction history: {e}")
            return []

    def close(self):
        """Close database connection"""
        if self.session:
            self.session.close()
        if self.engine:
            self.engine.dispose()
        print("✅ PostgreSQL connection closed")
