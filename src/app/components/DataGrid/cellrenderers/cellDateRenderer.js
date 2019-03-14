class CellDateRenderer extends React.Component {
  constructor(props) {
    super();
  }
  render() {
    if (this.props.value) {
        return (
        <span>{moment(this.props.value).format("DD-MM-YYYY")}</span>
      ) 
    } else {
        return (
          <span>{this.props.value}</span>
        )
      }

  }
}
export default CellDateRenderer;
