import React from "react";

export const FilterConfig = () => {
  return {
    operatorType: "equals",
    returnPropName: "value",
    dataSource: () =>{return new Promise(function(resolve, reject) {  
           setTimeout(() => resolve({data: [{id:1, value:"i58"}, {id:2, value:"i49"}, {id:3, value:"i46"},{id:3, value:"Newman/Yandi Routine Maintenance"},{id:3, value:"18"}]}), 1000);
         })}
    }
}

