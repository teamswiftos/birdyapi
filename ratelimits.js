const limits = 100;
const time_before_reset = 1000; // 1 seconds
const banned_time = 1000 * 60 * 10; // 10 minutes
let requestCounts = {};
let banned = {};

module.exports = function(ip) {
    if (banned[ip]) {
        if (Date.now() - banned[ip].timestamp <= banned_time) {
            return true;
        }
        delete banned[ip];
        requestCounts[ip] = {timestamp: Date.now(), count: 1};
        return false;
    }
    if (requestCounts[ip]) {
        if (Date.now() - requestCounts[ip].timestamp <= time_before_reset) {
            requestCounts[ip] = {timestamp: Date.now(), count: 1};
            return false;
        }
        requestCounts[ip].count++;
        if (requestCounts[ip].count > limits) {
            banned[ip] = {timestamp: Date.now()};
            return true;
        }
        return false;
    }
    requestCounts[ip] = {timestamp: Date.now(), count: 1};
    return false;
};