var kafka = require('kafka-node');

function ConnectionProvider() {
    this.getConsumer = function(topic_name) {
        // if (!this.kafkaConsumerConnection) {
        this.client = new kafka.Client("localhost:2181");
        this.kafkaConsumerConnection = new kafka.Consumer(this.client,[ { topic: topic_name, partition: 0 }], {
            groupId: 'kafka-node-group',//consumer group id, default `kafka-node-group`
            // Auto commit config
            autoCommit: true,
            autoCommitIntervalMs: 5000,
            // The max wait time is the maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the request is issued, default 100ms
            fetchMaxWaitMs: 100,
            // This is the minimum number of bytes of messages that must be available to give a response, default 1 byte
            fetchMinBytes: 1,
            // The maximum bytes to include in the message set for this partition. This helps bound the size of the response.
            fetchMaxBytes: 1024 * 1024,
            // If set true, consumer will fetch message from the given offset in the payloads
            fromOffset: false,
            // If set to 'buffer', values will be returned as raw buffer objects.
            encoding: 'utf8',
            keyEncoding: 'utf8'
        });
        this.client.on('ready', function () { console.log('client ready kafka-back-end!') })
        // }
        return this.kafkaConsumerConnection;
    };

    //Code will be executed when we start Producer
    this.getProducer = function() {

        //if (!this.kafkaProducerConnection) {
        this.client = new kafka.Client("localhost:2181");
        var HighLevelProducer = kafka.HighLevelProducer;
        this.kafkaProducerConnection = new HighLevelProducer(this.client);
        //this.kafkaConnection = new kafka.Producer(this.client);
        console.log('producer ready kafka-back-end');
        // }
        return this.kafkaProducerConnection;
    };
}
exports = module.exports = new ConnectionProvider;