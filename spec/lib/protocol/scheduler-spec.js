// Copyright 2015, EMC, Inc.


'use strict';

describe("Schedular protocol functions", function () {
    helper.before();

    before(function () {
        this.scheduler = helper.injector.get('Protocol.Scheduler');
    });

    helper.after();

    describe("schedule", function () {

        var testSubscription;
        afterEach("schedule afterEach", function () {
            // unsubscribe to clean up after ourselves
            if (testSubscription) {
                return testSubscription.dispose();
            }
        });

        it("should publish and receive a schedule request", function () {
            //NOTE: no matching internal code to listen for these events
            var self = this,
                Promise = helper.injector.get('Promise'),
                uuid = helper.injector.get('uuid'),
                deferred = Promise.defer(),
                taskId = uuid.v4(),
                taskName = "testTaskName",
                overrides = {
                    timeout: -1
                };

            self.scheduler.subscribeSchedule(function (cbTaskId, cbTaskName, cbOverrides) {
                try {
                    expect(cbTaskId).to.equal(taskId);
                    expect(cbTaskName).to.equal(taskName);
                    expect(cbOverrides).to.deep.equal(overrides);
                    deferred.resolve();
                } catch (err) {
                    deferred.reject(err);
                }
            }).then(function (subscription) {
                expect(subscription).to.be.ok;
                testSubscription = subscription;

                return self.scheduler.schedule(taskId, taskName, overrides);
            }).catch(function (err) {
                deferred.reject(err);
            });

            return deferred.promise;
        });
    });
});
