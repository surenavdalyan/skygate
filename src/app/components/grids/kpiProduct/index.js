import React, { Component } from "react";
import ProductKpiGrid from "./productkpiGrid/index";
import SiteKpiGrid from "./sitekpiGrid/index";

export default class ProductKpi extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
                <div className="workspace container-fluid">
                    <div className="pane">
                        <div className="titlebar">KPI</div>
                        <div className="panebody body_101">
                            <div className="body_50">
                            <SiteKpiGrid />
                        
                            </div>
                            <div className="body_50">
                            <ProductKpiGrid />
                            </div>
                        </div>
                    </div>
                </div>
        );
  }
}
