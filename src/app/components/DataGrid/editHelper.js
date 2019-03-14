export const prepareEditRow = props => {
  const { editedRowsData, keyColumn } = props.api.gridOptionsWrapper.gridConfig;
  const { data } = props.node;
  const key = data[keyColumn];
  editedRowsData[key] = {};
};

export const identifyRowChanges = props => {
  const { editedRowsData, keyColumn } = props.api.gridOptionsWrapper.gridConfig;
  const { data } = props.node;
  const key = data[keyColumn];
  const { newValue, oldValue } = props;
  const { field } = props.colDef;
  let modifiedRow = {};
  if (newValue !== oldValue) {
    if (Object.keys(editedRowsData).length) {
      modifiedRow[field] = {
        newValue,
        oldValue
      };
    } else {
      modifiedRow = {
        [field]: {}
      };
    }
    editedRowsData[key] = Object.assign(editedRowsData[key], modifiedRow);
  }
};

export const revertUnModifiedRows = props => {
  const { editedRowsData, keyColumn } = props.api.gridOptionsWrapper.gridConfig;
  const { data } = props.api.getSelectedNodes()[0];
  const key = data[keyColumn];
  if (!(editedRowsData[key] && Object.keys(editedRowsData[key]).length)) {
    delete editedRowsData[key];
  }
};
export const GetPrivileges = () => {
  const RolePrev = localStorage.getItem("RolePriv");
  if(RolePrev) {
    const allRole = RolePrev.split("|")
    const selectedRole = localStorage.getItem("selectedrole");
    let userHasAccess = false;
    allRole.forEach( role=> {
      if(selectedRole == role.split(":")[0]) {
        let allpriv = role.split(":")[1].split(",")
        if(allpriv.indexOf(1)>-1 || allpriv.indexOf("1")>-1){
          userHasAccess = true;
        }
      }
      
    })
    return userHasAccess
  }
  return false;
}
export const rowEditableStatus = params => {
  const {
    keyColumn,
    entityName,
    lockedEntities
  } = params.api.gridOptionsWrapper.gridConfig;
  const keyColumnValue = params.node.data[keyColumn];
  if(entityName == "productkpiGrid" || entityName == "sitekpiGrid"){
    return GetPrivileges();
  }
  return !(lockedEntities[entityName].indexOf(keyColumnValue) > -1);
};

export const updateGridHeaderStatus = (oldConfig, pratialNewConfig) => {
  oldConfig.menu.forEach(element => {
    pratialNewConfig.forEach(newElement => {
      if (element.name === newElement.name) {
        element.isVisible = newElement.isVisible;
      }
    });
  });
  return oldConfig;
};
