module.exports = function ( RED ) {
  "use strict";
  var moment = require("moment-timezone");

  function dateformat (config) {
    RED.nodes.createNode(this, config);
    this.dayname = config.dayname;
    this.date = config.date;
    this.hour = config.hour;
    this.meridiem = config.meridiem;
    this.timezone = config.timezone;
    var node = this;
    this.on("input", function(msg) {
      var dayname = node.dayname;
      if(typeof(msg.dayname) != "undefined" && msg.dayname != ""){dayname = msg.dayname;}
      var date = node.date;
      if(typeof(msg.date) != "undefined" && msg.date != ""){date = msg.date;}
      var hour = node.hour;
      if(typeof(msg.hour) != "undefined" && msg.hour != ""){hour = msg.hour;}
      var meridiem = node.meridiem;
      if(typeof(msg.meridiem) != "undefined" && msg.meridiem != ""){meridiem = msg.meridiem;}
      var timezone = node.timezone;
      if(typeof(msg.timezone) != "undefined" && msg.timezone != ""){timezone = msg.timezone;}
      var timestamp  = msg.payload;
      if(typeof(msg.timestamp) != "undefined" && msg.timestamp != ""){timestamp = msg.timestamp;}
      msg.payload = timeConverter(node,timestamp,dayname,date,meridiem,hour,timezone);
      msg.date = date;
      node.send(msg);
    });
  }
  RED.nodes.registerType("dateformat", dateformat);

  function timeConverter(node,timestamp,param_day,param_date,param_meridiem,param_hour,timezone){
    if(param_day == true){
      var day_name = moment(timestamp).tz(timezone).format('dddd');
    }

    if(param_date != "no"){
      var date_format = moment(timestamp).tz(timezone).format(param_date);
    }
    else{
      var date_format = "";
    }

    if(param_hour != "no"){
      if(param_meridiem == true){
        var time_format = moment(timestamp).tz(timezone).format(param_hour.replace("HH","hh") + " a");
      }
      else{
        var time_format = moment(timestamp).tz(timezone).format(param_hour);
      }
    }
    else{
      var time_format = "";
    }

    if(date_format == "" || time_format == ""){
      var final_date = date_format + time_format;
    }
    else{
      var final_date = date_format + " " + time_format;
    }

    if(typeof day_name != "undefined" && date_format != ""){
      final_date = day_name + " " + final_date;
    }

    return final_date;
  }
}
