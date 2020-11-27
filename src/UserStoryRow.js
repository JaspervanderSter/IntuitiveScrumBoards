import React from "react";
import BoardCell from "./BoardCell.js"


class UserStoryRow extends React.Component {

    renderBoardCell(value, index, rowIndex) {
        return (
            <BoardCell
                status = {value}
                items = {this.props.userStoryObj[value.label]}
                userStoryName = {this.props.name}
                key = {value.label}
                index = {index}
                rowIndex = {rowIndex}
            />
        )
    }

    render() {
        return (
            <div className="board-row" key={this.props.name}>
                <div className="board-index-cell">
                    {this.props.name}
                </div>
                {
                    this.props.orderedStatuses.map((value, index) => {
                        return this.renderBoardCell(value, index, this.props.rowIndex);
                    })
                }
            </div>
        )
    }
}

export default UserStoryRow;