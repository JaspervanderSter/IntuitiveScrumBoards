import React from "react";
import styled from "styled-components";
import { Draggable } from 'react-beautiful-dnd';
import { Tooltip } from "monday-ui-react-core";
import './Tooltip.scss';
import mondaySdk from "monday-sdk-js";
const monday = mondaySdk();

const Container = styled.div`
    background-color: #FFFFFF;
    padding: 8px;
    margin: 8px 0px;
    border-radius: 8px;
    opacity: ${props => (props.isDragging ? 0.7 : 1.0)};
    font-size: 14px;
    cursor: pointer;
    min-height: 100px;
    box-shadow: ${props => (props.isDragging ? "0px 15px 50px -10px rgba(0, 0, 0, 0.3)" : "0 4px 8px -1px rgba(0, 0, 0, 0.2)")};
    display: flex;
    flex-flow: column;
`;


class Item extends React.Component {

    renderPerson(value, index) {
        return (
            <div className="item-people-photo" key={value.name}>
                <Tooltip 
                    theme="surface"
                    content={value.name}
                >
                    <img src={value.photo} alt={value.name}></img>
                </Tooltip>
            </div>
            
            
        )
    }


    render() {
        return (
            <Draggable
                key={this.props.id}
                draggableId={this.props.id}
                index={this.props.index}
            >
                {(provided, snapshot) => (
                    <Container
                        className="board-item"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        innerRef={provided.innerRef}
                        isDragging={snapshot.isDragging}
                        onClick={() => monday.execute('openItemCard', { itemId: parseInt(this.props.id), kind: "columns" })}
                    >
                        <div className="item-header">
                            <div className="item-title">
                                {this.props.title}
                            </div>
                        </div>
                        
                        <div className="item-info">

                        </div>

                        <div className="item-people">
                            {
                                this.props.people.map((value, index) => {
                                    return this.renderPerson(value, index);
                                })
                            }
                        </div>
                        
                    </Container>
                )}
            </Draggable>
        )
    }

}

export default Item;