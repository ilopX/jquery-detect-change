/**
 * Created by XTreme.ws on 31.08.2015.
 */
(function ( $ ) {
    var DC = {
        CONDITION: 0,
        PROP: 1,
        dataName: 'detect-change',
        list: [],
        allHook: function(func){
            DC.list.forEach(function(select, i, arr){
                select.data(DC.dataName).forEach(function(param, i, arr){
                    func(select, param);
                });
            });
        },
        runChecker: function(select, param, init){
            switch (param.type){
                case DC.PROP:
                    var currVal = select.prop(param.name);

                    if (param.val != currVal){
                        param.val = (param.val === undefined) ? null : param.val;
                        param.func.call(select, param.val, currVal, init);
                        param.val = currVal;
                    }
                    break;
                case DC.CONDITION:
                    var state = param.condition.call(select, init);
                    if (init){
                        param.val = state;
                    }
                    if (param.val != state){
                        param.func.call(select);
                        param.val = state;
                    }

                    break;
            }
        },
        timer: function(){
            DC.allHook(function(select, param){
                DC.runChecker(select, param, false);
            });
        },

        add: function(select, param){
            // id selector add first time
            if (!select.data(DC.dataName)){
                select.data(DC.dataName, []);
                DC.list.push(select);
            }

            DC.runChecker(select, param, true);

            select.data(DC.dataName).push(param);
            //select.prop('data', select.data(DC.dataName)); // debug info
            DC.timer();
        },

        remove: function remove(select, name){

        }
    };

    DC.timerID = setInterval(DC.timer, 100);


    $.fn.detectChange = function(name, func, condition) {
        var param = {
            name: name,
            func: func,
            condition: condition
        };

        // remove hook
        if (func === 'remove'){
            DC.remove(this, name);
        }
        // add hook, selector properties or user condition
        else{
            param.type = (typeof condition === 'function') ? DC.CONDITION : DC.PROP;
            DC.add(this, param);
        }

        return this;
    };
}( jQuery ));
// TODO: add function remove
// TODO: add self destroy if selector remove
// TODO: add global setting(speed, name data)
/*
$('body')
    // selector properties
    .detectChange('clientWidth', function(oldVal, newVal, init){
        console.log(this[0].clientWidth == newVal);
    })
    // user condition
    .detectChange('your-name',
        function(change){
            if (!change)
                return;
           console.log('больше 600')
        },
        function(init){
            return this.width() > 600;
        });*/


