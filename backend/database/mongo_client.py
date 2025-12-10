from pymongo import MongoClient
from typing import List, Dict, Optional
from datetime import datetime
import os

class MongoDBClient:
    def __init__(self):
        """Initialize MongoDB connection"""
        mongo_url = os.getenv('MONGODB_URL', 'mongodb://localhost:27017/')
        self.client = None
        self.db = None
        self.predictions_collection = None

        try:
            self.client = MongoClient(mongo_url, serverSelectionTimeoutMS=5000)
            # Test connection
            self.client.server_info()
            self.db = self.client['energy_forecast']
            self.predictions_collection = self.db['predictions']
            self.metrics_collection = self.db['metrics']
            print("✅ Connected to MongoDB")
        except Exception as e:
            print(f"⚠️  MongoDB connection failed: {e}. Using in-memory storage.")
            self.client = None

    def store_predictions(self, predictions: List[Dict]) -> bool:
        """Store predictions in MongoDB"""
        if not self.client:
            return False

        try:
            documents = []
            for pred in predictions:
                doc = {
                    **pred,
                    'created_at': datetime.utcnow(),
                    'model_version': 'LSTM-v1.0'
                }
                documents.append(doc)

            self.predictions_collection.insert_many(documents)
            return True
        except Exception as e:
            print(f"Error storing predictions: {e}")
            return False

    def get_predictions(self, limit: int = 100, location: Optional[str] = None) -> List[Dict]:
        """Retrieve predictions from MongoDB"""
        if not self.client:
            return []

        try:
            query = {}
            if location:
                query['location'] = location

            cursor = self.predictions_collection.find(query).sort('created_at', -1).limit(limit)
            return list(cursor)
        except Exception as e:
            print(f"Error retrieving predictions: {e}")
            return []

    def store_metrics(self, metrics: Dict) -> bool:
        """Store system metrics"""
        if not self.client:
            return False

        try:
            doc = {
                **metrics,
                'timestamp': datetime.utcnow()
            }
            self.metrics_collection.insert_one(doc)
            return True
        except Exception as e:
            print(f"Error storing metrics: {e}")
            return False

    def get_latest_metrics(self) -> Optional[Dict]:
        """Get latest metrics"""
        if not self.client:
            return None

        try:
            return self.metrics_collection.find_one(sort=[('timestamp', -1)])
        except Exception as e:
            print(f"Error retrieving metrics: {e}")
            return None

    def aggregate_daily_stats(self, date: datetime) -> Dict:
        """Aggregate statistics for a specific day"""
        if not self.client:
            return {}

        try:
            pipeline = [
                {
                    '$match': {
                        'created_at': {
                            '$gte': date,
                            '$lt': date.replace(hour=23, minute=59, second=59)
                        }
                    }
                },
                {
                    '$group': {
                        '_id': None,
                        'avg_prediction': {'$avg': '$predicted_value'},
                        'max_prediction': {'$max': '$predicted_value'},
                        'min_prediction': {'$min': '$predicted_value'},
                        'total_predictions': {'$sum': 1}
                    }
                }
            ]

            result = list(self.predictions_collection.aggregate(pipeline))
            return result[0] if result else {}
        except Exception as e:
            print(f"Error aggregating stats: {e}")
            return {}

    def close(self):
        """Close MongoDB connection"""
        if self.client:
            self.client.close()
            print("✅ MongoDB connection closed")
