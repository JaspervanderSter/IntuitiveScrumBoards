import React from "react";
import styled from "styled-components";
import { Draggable } from 'react-beautiful-dnd';

const Container = styled.div`
    border: 1px solid lightgrey;
    background-color: ${props => (props.isDragging ? "#ddd" : "#fff")};
    padding: 8px;
    border-radius: 2px;
    &:hover {
        background-color: #eee;
    }
`;

class Item extends React.Component {
    constructor(props) {
        super(props);
    }

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