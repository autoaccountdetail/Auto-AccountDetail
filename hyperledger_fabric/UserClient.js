class UserClient {
    constructor(channel, targets, client, eventHubs){
        this.channel = channel;
        this.targets = targets;
        this.client = client;
        this.eventHubs = eventHubs;
    }
}

module.exports.UserClient = UserClient;