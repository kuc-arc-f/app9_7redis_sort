// LibCommon
const {promisify} = require('util');
import moment from 'moment'

//
export default {
    string_to_obj:function(items){
        var ret = [];
        items.forEach(function(item){
            var row = JSON.parse(item || '[]')
    //        console.log( row );
            ret.push( row )
        });
        ret = this.string_to_date(ret)
        return ret;        
    },
    string_to_date:function(items){
        var ret = [];
        items.forEach(function(item){
            if(typeof item.created_at !== 'undefined' ){
//                console.log( item );
                item.created_at = new Date(item.created_at )
                var dt = moment(item.created_at )
                item.date_str = dt.format('YYYY-MM-DD HH:mm')
            }
            ret.push( item )
        });
        return ret;        
    },  
    convert_string_date:function(item){
        var ret = [];
        if(typeof item.created_at !== 'undefined' ){
            //                console.log( item );
            item.created_at = new Date(item.created_at )
            var dt = moment(item.created_at )
            item.date_str = dt.format('YYYY-MM-DD HH:mm')
        }
        return item;        
    },    
    /* sort ASC */
    sort_asc_items: function(items){
        items.sort(function(a,b){
            if(a.title < b.title) return -1;
            if(a.title > b.title) return 1;
            return 0;
        });
//        console.log(items) 
        return items       
    },
    /* sort DESC */
    sort_desc_items: function(items){
        items.sort(function(a,b){
            if(a.title > b.title) return -1;
            if(a.title < b.title) return 1;
            return 0;
        });
//        console.log(items)         
        return items       
    },
    add_item :async function(client, item, entity_name ){
        var key_idx = "idx-" + entity_name;
        var key_sorted = "sorted-" + entity_name;
        const incrAsync = promisify(client.incr).bind(client);
        const zaddAsync = promisify(client.zadd).bind(client);
        const setAsync = promisify(client.set).bind(client);
        try{
            client.on("error", function(error){ console.error(error); });
            var reply = await incrAsync(key_idx);
            var key = entity_name + ":" + String(reply)
            console.log( key );
            await zaddAsync(key_sorted, reply, key);
            item.id = key;
            var json = JSON.stringify( item );
            await setAsync(key , json) 
            return 1;  
        } catch (e) {
            console.log(e);
            return 0;
        }    
    }    

}