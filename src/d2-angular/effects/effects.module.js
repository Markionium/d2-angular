import angular from 'angular';
import Animation from 'd2-angular/effects/animation/animation-service';

import 'd2-angular/config/config.module';

//Build the angular module
angular.module('d2-angular.effects', [])
    .service('animation', Animation);
