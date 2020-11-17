import React from "react";
import BoardCell from "./BoardCell.js"


class UserStoryRow extends React.Component {
    constructor(props) {
        super(props);
    }

    renderBoardCell(value) {
        return (
            <BoardCell
                status = {value}
                userStories = {this.props.userStoryObj[value.label]}
                userStoryName = {this.props.name}
                key = {value.label}
            />
        )
    }

    render() {
        return (
            <div className="board-row" key={this.props.name}>
                <div className="board-index-cell board-cell">
                    {this.props.name}
                </div>
                {
                    this.props.orderedStatuses.map((value, index) => {
                        return this.renderBoardCell(value);
                    })
                }
                
                
            </div>
        )
    }
}

export default UserStoryRow;