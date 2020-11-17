import React from "react";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import Item from "./Item.js"

const Container = styled.div`
    background-color: ${props => (props.color)};
    flex: 1 1 0;
    padding: 8px 8px;
    border-size: 2px;
    border-radius: 4px;
    margin: 0px 0px;
    &:hover {
        background-color: ${props => (props.isDraggingOver ? props.hoverColor : props.color)};
    }
`;

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
                {(provided, snapshot) => (
                    <Container
                        className="board-cell"
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
        )
    }
}

export default BoardCell;