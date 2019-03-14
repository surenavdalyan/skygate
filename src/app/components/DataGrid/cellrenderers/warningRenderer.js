import React from "react";
const WarningRenderer = props => {
    return(
        <div>
            {props.data.warningMessage && <span className="warning" title={`${props.data.Severity}:${props.data.warningMessage}`}></span>}
        </div>
    )
};

export default WarningRenderer;