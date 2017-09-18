/**
 * Created by hasee on 2017/9/11.
 */
(function(global,factory){
    //给各种环境暴露句柄
    if(typeof module === "object" && typeof module.exports === "object"){
        module.exports = global.document ?
            global(global,true):
            function(w){
                if(!w.document){
                    throw new Error();
                }
                return factory(w);
            }
    }else{
        factory(global);
    }

})(typeof window != "undefined" ? window : this, function(window,noGlobal){
    "use strict";
    //搞一个实例数组，使用它的方法，也就是说Array.prototype.fn.call 不需要写这么长
    var arr = [];
    //todo 上面用了那么多代码判断当前环境，这里直接认定是window，有歧义？
    var document = window.document;
    //返回一个对象的原型 https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/GetPrototypeOf
    var getProto = Object.getPrototypeOf;

    var slice = arr.slice;

    var concat = arr.concat;

    var push = arr.push;

    var indexOf = arr.indexOf;
    //搞一个实例数组，使用它的方法，和上面的arr一样
    var class2type = {};

    var toString = class2type.toString;

    var hasOwn = class2type.hasOwnProperty;

    var fnToString = hasOwn.toString;
/**
* t.toString()
*->   "function t(){console.log()}"
* t.toString.call(Object)
* ->  "function Object() { [native code] }"
 */
    var ObjectFunctionString = fnToString.call(Object);//不管什么函数，上下文换成Object执行返回的都是 function Object() { [native code] }

    var support = {};


    //这个函数的作用是执行全局执行一段脚本，执行完后删除，代替浏览器提供的eval，更有效率
    function DOMEval(code,doc){
        doc = doc || document;
        var script = doc.createElement("script");
        script.text = code;
        doc.head.appendChild(script)//这里返回的script
            .parentNode.removeChild(script);
    }

    var
        version = "3.2.1",
        //定义一个本地的jquery对象copy
        jQuery = function(selector,context){
            return new jQuery.fn.init(selector,context);
        },

        // 去除空格
        rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

        // Matches dashed string for camelizing
        rmsPrefix = /^-ms-/,
        rdashAlpha = /-([a-z])/g,

        // Used by jQuery.camelCase as callback to replace()
        fcamelCase = function( all, letter ) {
            return letter.toUpperCase();
        };
    //jquery的实例方法
    jQuery.fn = jQuery.prototype = {
        jquery:version,

        constructor:jQuery,

        length:0,
        //todo 不确定是干什么的，只是把自己变成数组，看下面就知道了
        toArray:function(){
            return slice.call(this);
        },
        //把获取到的jquery包装的element 当成数组返回，或者拿到第几个元素
        get:function(num){
            //变量定义未赋值与null，undefined相等，但是只是与undefined全等
            if(num == null){
                return slice.call(this);
            }

            return num<0 ? this[num+this.length] : this[num]
        },
        //把需要的元素集和旧的元素集合并，然后返回合并后的元素集，旧的挂载在prevObject上
        //新的元素都都是新jquery对象的元素
        pushStack:function(elems){
            var ret = jQuery.merge(this.constructor(),elems);

            ret.prevObject = this;
            return ret;
        },

        each:function(callback){
            return jQuery.each(this,callback);
        },

        map:function(callback){
            return this.pushStack(jQuery.map(this,function(elem,i){
                //todo 不理解为什么后面重复回调一个elem的参数
                return callback.call(elem,i,elem);
            }));
        },

        slice:function(){
            return this.pushStack(slice.apply(this,arguments))
        },

        first:function(){
            return this.eq(0);
        },

        last:function(){
            return this.eq(-1);
        },

        eq:function(i){
            var len = this.length;
            j = +i + (i < 0 ? len:0);
            return this.pushStack(j>=0 && len ? [this[j]]:[]);
        },

        end:function(){
            return this.prevObject || this.constructor();
        },

        push:push,
        sort:arr.sort,
        splice:arr.splice
    };
    //2017  9.11 : line 195
    /**
     * 功能为对象合并，所谓深拷贝就是把另一个对象上的属性值拷贝下来，当属性是引用类型时，通过复制其基础类型的值达到传值的目的
     * @param {boolean | object | array }   第一个参数既可以传入需要合并的对象也可以传入是否深拷贝
     * @param {object | array}  需要拷贝的对象
    */
    jQuery.extend = jQuery.fn.extend = function(){
        var options, name, src, copy, copyIsArray, clone,
            target = arguments[ 0 ] || {},
            i=1,
            length = arguments.length,
            deep = false;
            //当第一个参数是表示是否需要深拷贝的boolean值时，后面的是要合并的对象，所意指针i 向后一位
            if(typeof target === "boolean"){
                deep  = target;
                target = arguments[i] || {}
                i++
            }
            //防止第一个参数传入即不是对象也不是布尔值
            if(typeof target !== "object" && !jQuery.isFunction(target)){
                target = {}
            }
            //当传入的就一个对象时，让这个对象继承jQuery
            if(i === length){
                target = this
                i--
            }

            for( ; i < length;i++){
                //这里是先做不等运算，然后赋值，最后if判断options的值
                if((options = arguments[i]) != null){
                    
                    for(name in options){
                        src = target[ name ];
                        copy = options[ name ];
                        // todo 当这两个值指向一样时会导致死循环，这个还没想通
                        if(src === copy){
                            continue
                        }

                        if(deep && copy && (jQuery.isPlainObject( copy ) || (copyIsArray = Array.isArray(copy)))){
                            //当资源上相应的属性是数组或者对象时，目标对象上相应也要初始化这个属性为对象或者数组
                            if(copyIsArray){
                                copyIsArray = false;
                                clone = src && Array.isArray(src) ? src: []
                            }else{
                                clone = src && jQuery.isPlainObject(src) ? src:{}
                            }

                            target[ name ] = jQuery.extend(deep,clone,copy);

                        }else if(copy !== undefined){
                            target[name] = copy;
                        }
                    }
                }
            }
            return target;
    }

//2017  9.12 : line 264
//jQuery的静态方法
jQuery.extend({

    expando:"jQuery"+(version + Math.random()).replace(/\D/g,""),
    isReady:true,
    error:function(msg){
        throw new Error(msg);
    },

    noop:function(){},

    isFunction:function(obj){
        return jQuery.type( obj ) === "function";
    },

    isWindow:function(obj){
        return obj != null && obj === obj.window;//console.log(window.window === window); => true
    },

    isNumeric:function(obj){
        var type = jQuery.type(obj);
        /**
         * isNaN(1) => false
         * isNaN(obj-parseFloat(obj))是为了不把NaN排除在外，因为typeof NaN === number，但是isNaN(NaN) => true
         * 所以为了不把NaN排除数字之外，用isNaN(obj - parseFloat(obj)) => false
         * */
        return (type === "number" || type === "string" ) && !isNaN(obj - parseFloat(obj));
    },

    isPlainObject:function(obj){
        var proto,ctor;

        if(!obj || toString.call(obj) !== "[object object]"){
            return false;
        }

        proto = getProto(obj);

        if(!proto){
            return true;
        }

        ctor = hasOwn.call(proto,"constructor") && proto.constructor;

        return typeof ctor == "function" && fnToString.call(ctor) === ObjectFunctionString;
    },
    //2017 9.14  line:321
    isEmptyObject:function(obj){
        for(var name in obj){
            return false;
        }
        return true;
    },

    type:function(obj){
        if(obj == null){
            return obj+""
        }

        return typeof obj === "obj" || typeof obj === "function" ?
        class2type[toString.call(obj)] || "object":
        typeof obj;

    },

    globalEval:function(code){
        DOMEval(code);
    },

    camelCase:function(string){
        return string,replace(rmsPrefix,"ms-").replace(rdashAlpha,fcamelCase);
    },

    each:function(obj,callback){
        var length,i=0;

        if(isArrayLike(obj)){
            length = obj.length;
            for(;i<length;i++){
                if(callback.call(obj[i],i,obj[i]) === false){
                    break
                }
            }
        }else{
            for(var i in obj){
                if(callback.call(obj[i],i,obj[i]) === false ){
                    break;
                }
            }
        }

        return obj;
    },

    trim : function(text){
        return text == null ?
        "":
        (text+"").replace(rtrim,"");
    },

    makeArray: function(arr,results){
        var ret = results || [];

        if( arr != null ){
            if(isArrayLike( Object(arr) )){
                jQuery.merge(ret,
                    typeof arr === "string" ?
                    [arr] : arr
                )
            }else{
                push.call(ret,arr);
            }
        }
        return ret
    },
//2017 9.15   : line 402
isArray:function(elem,arr,i){
    return arr == null ?
    -1:indexOf.call(arr,elem,i)
},

merge:function(first,second){
    var len = +second.length,
        j=0;
        i = first.length;

    for(;j<len;j++){
        first[i++] = second[j];
    }
    first.length = i;
    return first;
},

grep:function(elems,callback,invert){
    var callbackinverse,
        matches = [],
        i=0,
        length = elems.length,
        callbacExpect = !invert;

    for(;i<Length;i++){
        callbackinverse = !callback(elems[i],i);
        if(callbackinverse !== callbacExpect){
            matches.push(elems[i]);
        }
    }

    return matches;
},
//2017.9.16   line:442
map:function(elems,callback,arg){
    var len = elems.length,
        i=0,
        val,
        ret = [];
        if(isArrayLike(elems)){
            for(;i<length;i++){
                val = callback(elems[i],i,arg);
                if(val) ret.push(val);
            }
        }else{
            for(i in elems){
                if(elems.hasOwnProperty(i)){
                    val = callback(elems[i],i,arg);
                    if(val) ret.push(val);
                }
            }
        }
        return concat.apply([],ret);
},
guid:1,
//http://blog.csdn.net/liangklfang/article/details/48780731
/**
 * proxy作用是替换fn内部的上下文为context
 * 所意return的就是fn这个函数本身，只是上下文切换了，用的是柯里化思想
 * var to = $.proxy(function(){   console.log(arguments.length);   },o,1,2)
 * to(3,4,5)
 * 1，2因为闭包也被保存了，所意打印5；
 */
proxy:function(fn,context){
    var tmp,args,proxy;

    if(typeof context === "string"){
        tmp = fn[context];
        context  = fn;
        fn = tmp;
    }

    if(!jQuery.isFunction(fn)){
        return undefined;
    }

    args = slice.call(arguments,2);
    proxy = function(){
        return fn.apply(context || this,arg.concat(slice.call(arguments)));
    }

    proxy,guid = fn.guid = fn.guid || jQuery.guid++;

    return proxy;
},

now:Date.now,

support:support
});

//2017  9.16  line 512

//todo 
if(typeof Symbol === "function"){
    jQuery.fn[Symbol.iterator] = arr[Symbol.iterator];
}

jQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "),
function(i,name){
    class2type["[object" + name +"]"] = name.toLowerCase();
})
//2017 9 18  line522






});