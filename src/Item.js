import React from "react";
import { Draggable } from 'react-beautiful-dnd';

class Item extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Draggable key={this.props.id} draggableId={this.props.id} index={this.props.index}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        {this.props.title}
                    </div>
                )}
            </Draggable>
        )
    }

}

export default Item;