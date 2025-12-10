// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title EnergyForecast
 * @dev Decentralized energy forecasting storage on Ethereum
 */
contract EnergyForecast {
    struct Prediction {
        uint256 timestamp;
        uint256 value;
        address predictor;
        string modelVersion;
        uint256 confidence;
    }

    struct AggregatedData {
        uint256 totalPredictions;
        uint256 averageValue;
        uint256 lastUpdate;
    }

    mapping(uint256 => Prediction[]) public dailyPredictions;
    mapping(address => uint256) public predictorRewards;
    mapping(string => uint256) public modelAccuracy;

    AggregatedData public aggregatedData;

    address public owner;
    uint256 public totalRewardsDistributed;

    event PredictionStored(
        uint256 indexed timestamp,
        uint256 value,
        address indexed predictor,
        string modelVersion
    );

    event RewardDistributed(address indexed predictor, uint256 amount);
    event AccuracyUpdated(string modelVersion, uint256 accuracy);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Store a new energy prediction on-chain
     */
    function storePrediction(
        uint256 _value,
        string memory _modelVersion,
        uint256 _confidence
    ) public {
        uint256 today = block.timestamp / 1 days;

        Prediction memory newPrediction = Prediction({
            timestamp: block.timestamp,
            value: _value,
            predictor: msg.sender,
            modelVersion: _modelVersion,
            confidence: _confidence
        });

        dailyPredictions[today].push(newPrediction);

        // Update aggregated data
        aggregatedData.totalPredictions++;
        aggregatedData.averageValue = (aggregatedData.averageValue * (aggregatedData.totalPredictions - 1) + _value) / aggregatedData.totalPredictions;
        aggregatedData.lastUpdate = block.timestamp;

        emit PredictionStored(block.timestamp, _value, msg.sender, _modelVersion);
    }

    /**
     * @dev Get predictions for a specific day
     */
    function getDailyPredictions(uint256 _day) public view returns (Prediction[] memory) {
        return dailyPredictions[_day];
    }

    /**
     * @dev Get the latest prediction
     */
    function getLatestPrediction() public view returns (Prediction memory) {
        uint256 today = block.timestamp / 1 days;
        Prediction[] memory predictions = dailyPredictions[today];
        require(predictions.length > 0, "No predictions for today");
        return predictions[predictions.length - 1];
    }

    /**
     * @dev Reward accurate predictors
     */
    function distributeReward(address _predictor, uint256 _amount) public onlyOwner {
        predictorRewards[_predictor] += _amount;
        totalRewardsDistributed += _amount;
        emit RewardDistributed(_predictor, _amount);
    }

    /**
     * @dev Update model accuracy
     */
    function updateModelAccuracy(string memory _modelVersion, uint256 _accuracy) public onlyOwner {
        modelAccuracy[_modelVersion] = _accuracy;
        emit AccuracyUpdated(_modelVersion, _accuracy);
    }

    /**
     * @dev Get aggregated statistics
     */
    function getAggregatedData() public view returns (
        uint256 totalPredictions,
        uint256 averageValue,
        uint256 lastUpdate
    ) {
        return (
            aggregatedData.totalPredictions,
            aggregatedData.averageValue,
            aggregatedData.lastUpdate
        );
    }

    /**
     * @dev Get predictor rewards
     */
    function getPredictorReward(address _predictor) public view returns (uint256) {
        return predictorRewards[_predictor];
    }

    /**
     * @dev Transfer ownership
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be zero address");
        owner = newOwner;
    }
}
