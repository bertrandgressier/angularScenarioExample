'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */
/* global element:false, expect:false, select:false, using:false*/
describe('List netchandising', function() {

    beforeEach(function() {
        browser().navigateTo('/index.html');
    });


    function usingFirstExample() {
        return using('[ng-repeat^=e in examples"]:first-child');
    }

    describe('test example', function() {

        it ('should test my binding', function(){

            expect(binding('title')).toEqual('Angular scenario Example');

            //select a specific binding with a scope
            //a binding revert the first bind found
            expect(binding('e.name')).toEqual('example 1');
            expect(binding('e.value')).toEqual("123");

            expect(repeater('[ng-repeat^="e in examples"]').column('e.name')).toEqual(['example 1', 'example 2', 'example 3', 'example 4']);
            expect(repeater('[ng-repeat^="e in examples"]').column('e.value')).toEqual(['123', '456', '789', '980']);

            expect(repeater('[ng-repeat^="e in examples"]').row(0)).toEqual(['example 1','123']);

            expect(repeater('[ng-repeat^="e in examples"]').count()).toEqual(4);

            //check input element with the binding name in ng-model
            expect(input('examples[0].name').val()).toEqual('example 1');

            //test input in a repeat element
            expect(using('ng-form[name="example-form-repeat"] div:nth-child(2)').input('eInput.name').val()).toEqual('example 2');

            function usingSecondExampleForm() {
                return using('ng-form[name="example-form-repeat"] div:nth-child(2)');
            }

            //the same with DSL style
            expect(usingSecondExampleForm().input('eInput.name').val()).toEqual('example 2');

        });
    });
});
