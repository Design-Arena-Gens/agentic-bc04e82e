from pyspark.sql import SparkSession
from pyspark.sql.functions import col, window, avg, sum as spark_sum, count
from pyspark.sql.types import StructType, StructField, StringType, DoubleType, TimestampType
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class SparkStreamProcessor:
    def __init__(self, app_name: str = "EnergyForecastStreaming"):
        """Initialize Spark Streaming session"""
        self.spark = SparkSession.builder \
            .appName(app_name) \
            .config("spark.streaming.stopGracefullyOnShutdown", "true") \
            .config("spark.sql.shuffle.partitions", "4") \
            .getOrCreate()

        self.spark.sparkContext.setLogLevel("WARN")
        logger.info("✅ Spark Streaming initialized")

    def create_schema(self):
        """Define schema for incoming energy data"""
        return StructType([
            StructField("timestamp", TimestampType(), True),
            StructField("sensor_id", StringType(), True),
            StructField("location", StringType(), True),
            StructField("energy_consumption", DoubleType(), True),
            StructField("temperature", DoubleType(), True),
            StructField("humidity", DoubleType(), True),
        ])

    def process_kafka_stream(self, kafka_servers: str, topic: str):
        """Process real-time data from Kafka"""
        schema = self.create_schema()

        # Read from Kafka
        df = self.spark \
            .readStream \
            .format("kafka") \
            .option("kafka.bootstrap.servers", kafka_servers) \
            .option("subscribe", topic) \
            .option("startingOffsets", "latest") \
            .load()

        # Parse JSON and apply schema
        parsed_df = df.selectExpr("CAST(value AS STRING)") \
            .select(from_json(col("value"), schema).alias("data")) \
            .select("data.*")

        # Aggregate data in 5-minute windows
        aggregated_df = parsed_df \
            .withWatermark("timestamp", "10 minutes") \
            .groupBy(
                window("timestamp", "5 minutes"),
                "location"
            ) \
            .agg(
                avg("energy_consumption").alias("avg_consumption"),
                spark_sum("energy_consumption").alias("total_consumption"),
                count("*").alias("data_points"),
                avg("temperature").alias("avg_temperature")
            )

        return aggregated_df

    def process_socket_stream(self, host: str = "localhost", port: int = 9999):
        """Process real-time data from socket"""
        lines = self.spark \
            .readStream \
            .format("socket") \
            .option("host", host) \
            .option("port", port) \
            .load()

        return lines

    def write_to_console(self, streaming_df, output_mode: str = "append"):
        """Write streaming results to console"""
        query = streaming_df \
            .writeStream \
            .outputMode(output_mode) \
            .format("console") \
            .option("truncate", "false") \
            .start()

        return query

    def write_to_memory(self, streaming_df, table_name: str):
        """Write streaming results to in-memory table"""
        query = streaming_df \
            .writeStream \
            .outputMode("complete") \
            .format("memory") \
            .queryName(table_name) \
            .start()

        return query

    def write_to_database(self, streaming_df, connection_url: str, table_name: str):
        """Write streaming results to database"""
        def write_batch(batch_df, batch_id):
            batch_df.write \
                .format("jdbc") \
                .option("url", connection_url) \
                .option("dbtable", table_name) \
                .option("user", "admin") \
                .option("password", "password") \
                .mode("append") \
                .save()

        query = streaming_df \
            .writeStream \
            .foreachBatch(write_batch) \
            .start()

        return query

    def apply_ml_model(self, streaming_df, model_path: str):
        """Apply pre-trained ML model to streaming data"""
        from pyspark.ml import PipelineModel

        # Load pre-trained model
        model = PipelineModel.load(model_path)

        # Apply model to streaming data
        predictions = model.transform(streaming_df)

        return predictions

    def calculate_anomalies(self, streaming_df, threshold: float = 2.0):
        """Detect anomalies in real-time data"""
        from pyspark.sql.functions import stddev, mean

        # Calculate statistics
        stats_df = streaming_df \
            .withWatermark("timestamp", "10 minutes") \
            .groupBy(window("timestamp", "5 minutes")) \
            .agg(
                mean("energy_consumption").alias("mean_consumption"),
                stddev("energy_consumption").alias("stddev_consumption")
            )

        # Detect anomalies
        anomalies_df = streaming_df \
            .join(stats_df, "window") \
            .filter(
                (col("energy_consumption") > col("mean_consumption") + threshold * col("stddev_consumption")) |
                (col("energy_consumption") < col("mean_consumption") - threshold * col("stddev_consumption"))
            )

        return anomalies_df

    def stop(self):
        """Stop Spark session"""
        self.spark.stop()
        logger.info("✅ Spark Streaming stopped")

# Example usage
if __name__ == "__main__":
    processor = SparkStreamProcessor()

    # Process socket stream
    stream_df = processor.process_socket_stream()
    query = processor.write_to_console(stream_df)

    query.awaitTermination()
