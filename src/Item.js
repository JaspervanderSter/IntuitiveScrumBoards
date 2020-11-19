import React from "react";
import styled from "styled-components";
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
    border: 1px solid ${props => (props.isDragging ? "#00CA72" : "#E6E9EF")};
    background-color: ${props => (props.isDragging ? "#CCF4E3" : "#FFF")};
    padding: 8px;
    margin: 4px 0px;
    border-radius: 4px;
    opacity: ${props => (props.isDragging ? 0.7 : 1.0)};
    font-size: 10pt;
    &:hover {
        background-color: #DFF0FF;
        border-color: #0085FF;
    }
`;

class Item extends React.Component {

    render() {
        return (
            <Draggable key={this.props.id} draggableId={this.props.id} index={this.props.index}>
                {(provided, snapshot) => (
                    <Container className="board-item" ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        innerRef={provided.innerRef}
                        isDragging={snapshot.isDragging}
                    >
                        {this.props.title}
                    </Container>
                )}
            </Draggable>
        )
    }

}

export default Item;