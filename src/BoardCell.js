import React from "react";
import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import Item from "./Item.js"

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
                taskInfo = {value.task}
                index = {index}
                people = {value.people}
                id = {value.task.id}
                key = {value.task.id}
            />
        )
    }

    render() {
        var items = this.props.items || [];
        return (
            <div className="board-cell">
                <Droppable
                    className="board-cell-droppable"
                    key={this.props.status.label}
                    droppableId={JSON.stringify({userStoryName: this.props.userStoryName, statusLabel: this.props.status.label})}
                    type={this.props.userStoryName}
                >
                    {(provided, snapshot) => (
                        <Container
                            {...provided.droppableProps}
                            key={this.props.status.label}
                            ref={provided.innerRef}
                            isDraggingOver={snapshot.isDraggingOver}
                            color={this.props.rowIndex % 2 ? "#C5C7D0" : "#C5C7D0"}
                            hoverColor={this.props.rowIndex % 2 ? "#CCF4E3" : "#CCF4E3"}
                        >
                            {
                                items.map((value, index) => {
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