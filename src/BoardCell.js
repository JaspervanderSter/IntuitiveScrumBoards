import React from "react";
import { Droppable } from "react-beautiful-dnd";
import Item from "./Item.js"

class BoardCell extends React.Component {
    constructor(props) {
        super(props);
    }

    renderItem(value, index) {
        return (
            <Item
                title = {value.task.name}
                index = {index}
                id = {value.task.id}
                key = {value.task.id}
            />
        )
    }

    render() {
        var userStories = this.props.userStories || [];
        return (
            <Droppable key={this.props.status.label} droppableId={JSON.stringify({userStoryName: this.props.userStoryName, statusLabel: this.props.status.label})}>
                {(provided) => (
                    <div className="board-cell" key={this.props.status.label} {...provided.droppableProps} ref={provided.innerRef}>
                        {
                            userStories.map((value, index) => {
                                return this.renderItem(value, index);
                            })
                        }
                    {provided.placeholder}
                    </div>
                )}
            </Droppable>
        )
    }
}

export default BoardCell;