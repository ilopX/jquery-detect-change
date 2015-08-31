/**
 * Created by XTreme.ws on 31.08.2015.
 */
(function ( $ ) {
    $.event.special.destroyed = {
        remove: function(o) {
            if (o.handler) {
                o.handler()
            }
        }
    };

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
                select.on('destroyed', function(){
                    for(var i = DC.list.length-1; i >= 0; --i){
                        if (DC.list[i] === select){
                            DC.list.splice(i, 1);
                        }
                    }
                })
            }

            DC.runChecker(select, param, true);
            select.data(DC.dataName).push(param);
            //select.prop('data', select.data(DC.dataName)); // debug info
        },

        remove: function remove(select, name){
            if (!select.data(DC.dataName)) {
                select.data(DC.dataName, []);
            }
            var arr = select.data(DC.dataName);
            for(var i = arr.length-1; i >= 0; --i){
                if (arr[i].name = name){
                    arr.splice(i, 1);
                }
            }
        }
    };

    DC.timerID = setInterval(DC.timer, 100);


    $.fn.detectChange = function(name, func, condition) {
        return this.each(function() {
            var select = $(this);
            var param = {
                name: name,
                func: func,
                condition: condition
            };

            // remove hook
            if (func === 'remove'){
                DC.remove(select, name);
            }
            // add hook, selector properties or user condition
            else{
                param.type = (typeof condition === 'function') ? DC.CONDITION : DC.PROP;
                DC.add(select, param);
            }
        });
    };
}( jQuery ));

// TODO: add global setting(speed, dataName, debug)

