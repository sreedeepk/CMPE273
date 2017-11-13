# Project

Demonstrates dropbox application using kafka to send messages

## Client

Client can be started by running the following commands

```
cd client
npm install 
npm start
```


## Server

Server can be started by running the following commands

```
cd server
npm install 
npm start
```

## Kafka Server

Server can be started by running the following commands

```
cd kafka-server
npm install 
npm start
```

### Topic creation commands

```
kafka-console-producer --broker-list localhost:9092 --topic login_topic
kafka-console-producer --broker-list localhost:9092 --topic signup_topic
kafka-console-producer --broker-list localhost:9092 --topic getfiles_topic
kafka-console-producer --broker-list localhost:9092 --topic getusersinfo_topic
kafka-console-producer --broker-list localhost:9092 --topic uploadfile_topic
kafka-console-producer --broker-list localhost:9092 --topic getfile_topic
kafka-console-producer --broker-list localhost:9092 --topic creategroups_topic
kafka-console-producer --broker-list localhost:9092 --topic addmembers_topic
kafka-console-producer --broker-list localhost:9092 --topic showmembers_topic
kafka-console-producer --broker-list localhost:9092 --topic deletemembers_topic
kafka-console-producer --broker-list localhost:9092 --topic deletegroups_topic
```