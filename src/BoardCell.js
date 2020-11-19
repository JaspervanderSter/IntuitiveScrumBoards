import React from "react";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import Item from "./Item.js"
import PlusIcon from "./img/plus_icon.png"

const Container = styled.div`
    background-color: ${props => (props.color)};
    padding: 4px 8px;
    border-size: 2px;
    margin: 0px 4px;
    &:hover {
        background-color: ${props => (props.isDraggingOver ? props.hoverColor : props.color)};
    }
`;

class BoardCell extends React.Component {

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
            <div className="board-cell">
                <Droppable className="board-cell-droppable" key={this.props.status.label} droppableId={JSON.stringify({userStoryName: this.props.userStoryName, statusLabel: this.props.status.label})}>
                    {(provided, snapshot) => (
                        <Container
                            {...provided.droppableProps}
                            key={this.props.status.label}
                            ref={provided.innerRef}
                            isDraggingOver={snapshot.isDraggingOver}
                            color={this.props.rowIndex % 2 ? "#F5E0E4" : "#EDF6F9"}
                            hoverColor={this.props.rowIndex % 2 ? "#EBC2CA" : "#D0E7Ef"}
                        >
                            {
                                userStories.map((value, index) => {
                                    return this.renderItem(value, index);
                                })
                            }
                        {provided.placeholder}
                        </Container>
                    )}
                </Droppable>
            </div>
            
        )
    }
}

export default BoardCell;