import jquery from 'jquery';
import angular from 'angular';
import 'angular-mocks';
import d2Angular from 'd2.angular';

import 'src/app';

describe('Sample spec', function () {
    d2Angular();

    let models;
    let myService;
    let controller;

    beforeEach(module('MyApp'));
    beforeEach(inject((models, $injector) => {
        myService = models;
        models.dataElement = {
            list: sinon.stub().returns(new Promise(function (resolve) {resolve([{name: 'This seems to work'}])}))
        };

        let $controller = $injector.get('$controller');

        controller = $controller('AppController');
    }));

    describe('jQuery', function () {
        it('should be on the window object', () => {
            expect(window.jQuery).to.not.be.undefined;
        });

        it('should create new object for each get of a feature', function () {
            expect(fixtures.get('sampleFixture')).to.not.equal(fixtures.get('sampleFixture'));
        });

        it('should return an equal fixture for each get fixture', function () {
            expect(fixtures.get('sampleFixture')).to.deep.equal(fixtures.get('sampleFixture'));
        });

        it('should have some custom matchers', function () {
            expect(fixtures.get('sampleFixture')).to.be.instanceof(Array);
        });

        it('should have System as a loader', () => {
            expect(window.System).to.be.defined;
        });

        it('should load jQuery', (done) => {
            System.import('jquery')
                .then(() => {
                    done();
                });
        });

        it('should load my app', (done) => {
            System.import('src/app')
                .then((app) => {
                    console.log(app.default.name);
                    //expect(app.name).to.equal('MyApp');
                    done();
                });
        });

        it('should load angular and myapp', (done) => {
            System.import('angular')
                .then((angular) => {
                    System.import('src/app')
                    .then((myapp) => {
                            expect(angular.element).to.not.be.undefined;
                            expect(window.bootstrapped).to.be.defined;
                            done();
                        });
                });
        });

        it('should have the service injected correctly', () => {
            expect(myService).to.not.be.undefined;
        });

        it('should have sinon set onto the global object', () => {
            expect(window.sinon).to.not.equal(undefined);
        });

        it('should allow us to set some fake object onto models and then use it from a injected one', () => {
            expect(controller).to.not.be.undefined;
        });
    });
});
