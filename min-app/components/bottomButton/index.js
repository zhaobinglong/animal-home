const util = require("../../utils/util.js");
const userModel = require("../../utils/userModel.js");

Component({
  properties: {
    icon: {
      type: String ,
      value: 'icon-custom-service'      
    },
    content: {
      type: String,
      value: 2020      
    } 
  },
  attached: function(){
  },

  methods: {
    onClick: function() {
      this.triggerEvent('bottombuttonevent')
    }
  }
})