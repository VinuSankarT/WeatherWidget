(function () {
    'use strict';

    var scriptAngElem = document.createElement('script');
    scriptAngElem.setAttribute('type', 'text/javascript');
    scriptAngElem.setAttribute('src', 'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.5/angular.min.js');

    /** Create div to register the app as angular app**/
    var widgetApp = document.createElement('div');
    widgetApp.setAttribute('ng-app', 'MyWidget');
    widgetApp.setAttribute('id', 'widgetApp');

    /** Append the angular app div to the client container div **/
    var outerContainer = document.getElementById('widgetContainer');
    outerContainer.appendChild(widgetApp);

    /** Add files**/
    var widget = document.createElement('div');
    widget.setAttribute('weather-widget', '');
    document.getElementById('widgetApp').appendChild(widget);

    document.getElementsByTagName('head')[0].appendChild(scriptAngElem);
    var styleSheet = document.createElement('link');
    styleSheet.setAttribute('type', 'text/css');
    styleSheet.setAttribute('rel', 'stylesheet');
    styleSheet.setAttribute('href', 'widget.css');
    document.getElementsByTagName('head')[0].appendChild(styleSheet);

    scriptAngElem.onreadystatechange = scriptAngElem.onload = function(){
        angular.module('MyWidget',[]);
        angular.module('MyWidget').directive('weatherWidget',weatherWidget);
        function weatherWidget(){
            var directive={
                restrict: 'EA',
                replace : true,
                scope : {},
                controller: widgetController,
                controllerAs: 'wg',
                template: 	'<div class="inner-container">' +
                '<div>' +
                '<span class="location-font">{{wg.weatherInfo.city}},</span>' +
                '<span class="location-font">{{wg.weatherInfo.region}}</span>' +
                '</div>' +
                '<div>' +
                '<div class="float-left">' +
                '<span class="current-temp">{{wg.weatherInfo.currentTemp}}&deg</span>' +
                '<span class="current-temp">{{wg.weatherInfo.tempInUnit}}</span>' +
                '</div>' +
                '<div class="current-status">' +
                '<img class="img-size" src="{{wg.weatherInfo.imageUrl}}" title="image">' +
                '<div>{{wg.weatherInfo.text}}</div>' +
                '</div>' +
                '<div class="cleaner"></div>' +
                '</div>' +
                '<div class="forecast" ng-repeat="fore in wg.weatherInfo.forecasts" ng-show="$index < 5">' +
                '<div>{{fore.day}}</div>' +
                '<img src="{{fore.imageUrl}}">' +
                '<div>{{fore.high}}&deg/{{fore.low}}&deg</div>' +
                '</div>' +
                '</div>',
            };
            return directive;
            function link(scope, element, attrs){
            }
        }
        angular.module('MyWidget').controller('widgetController',widgetController);
        widgetController.$inject =['widgetFactory'];
        function widgetController(widgetFactory){
            var vm = this;
            vm.weatherInfo = [];
            vm.respObj = [];
            vm.weatherInfo.forecasts = [];
            widgetFactory.getWeatherInfo().then(function (resp) {
                vm.respObj = resp.data.query.results.channel;
                vm.weatherInfo.city = vm.respObj.location.city;
                vm.weatherInfo.region = vm.respObj.location.region;
                vm.weatherInfo.currentTemp = vm.respObj.item.condition.temp;
                vm.weatherInfo.tempInUnit = vm.respObj.units.temperature;   //need to bind th value
                vm.weatherInfo.imageUrl = "http://l.yimg.com/a/i/us/we/52/"+vm.respObj.item.condition.code+".gif";
                vm.weatherInfo.text = vm.respObj.item.condition.text;
                angular.forEach(vm.respObj.item.forecast, function(value, key) {
                    if(key != 0 && key < 6 ) {
                        value.imageUrl = "http://l.yimg.com/a/i/us/we/52/"+value.code+".gif";
                        this.push(value);
                    }
                },vm.weatherInfo.forecasts);
            })
        }
        angular.module('MyWidget').factory('widgetFactory',widgetFactory);
        widgetFactory.$inject =['$http'];
        function widgetFactory($http) {
            var widgetData={};
            widgetData.weatherInfo=[];
            widgetData.city = '';
            widgetData.region = '';
            widgetData.getWeatherInfo = function(){
                widgetData.city =  document.getElementById('widgetContainer').dataset.city;
                widgetData.region =  document.getElementById('widgetContainer').dataset.region;
                return $http.get('https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22'+widgetData.city+'%2C%20'+widgetData.region+'%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithke').then(
                    function(response){
                        return response;
                    },
                    function (response) {
                        console.log('getWeatherInfo method :: error :: '+response)
                    }
                );
            };
            return widgetData;
        }
    }/**Initialize angular app ends**/


})();

