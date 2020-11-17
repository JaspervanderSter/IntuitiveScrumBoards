import React from "react";
import "./App.css";
import "./StatusHeader.js";
import UserStoryRow from "./UserStoryRow.js"
import mondaySdk from "monday-sdk-js";
import { DragDropContext } from "react-beautiful-dnd";
import _ from "lodash"
const monday = mondaySdk();

class App extends React.Component {
  constructor(props) {
    super(props);

    // Default state
    this.state = {
      settings: {},
      name: "",
      statusColumn: null,
      statusObj: {},
      userStoryColumn: null,
      itemsList: [],
      orderedStatuses: [],
    };
  }

  getSettings(res) {
    this.setState({ settings: res.data });
    var statusColumn = this.state.settings.statusColumn;
    
    if (statusColumn === null || statusColumn === undefined) {
      statusColumn = null;
    } else {
      statusColumn = Object.keys(statusColumn)[0];
      this.setState({ statusColumn: statusColumn });
      this.getStatusList();
    }

    var userStoryColumn = this.state.settings.userStoryColumn;
    
    if (userStoryColumn === null || userStoryColumn === undefined) {
      userStoryColumn = null;
    } else {
      userStoryColumn = Object.keys(userStoryColumn)[0];
      this.setState({ userStoryColumn: userStoryColumn });
      if (this.state.boardData !== undefined) {
        this.getItemsObj();
      }
    }
  }

  getStatusList() {
    if (this.state.statusColumn !== null) {
      monday.api(`query ($boardIds: [Int], $columnIds: [String]) { boards (ids:$boardIds) { columns (ids:$columnIds) {settings_str} } }`,
        { variables: {boardIds: this.state.context.boardIds, columnIds: [this.state.statusColumn]} }
      )
      .then(res => {
        var statusColumns = res.data.boards[0].columns;
        if (statusColumns !== undefined) {
          var statusObj = getStatusListFromSettings(statusColumns[0].settings_str);
          this.setState({statusObj: statusObj});
          this.setState({orderedStatuses: getOrderedStatusList(this.state.statusObj.labels, this.state.statusObj.labels_colors, this.state.statusObj.labels_positions_v2)});
        }
      });
    }
  }

  getUserStoryList(items) {
    var UserStoryTitles = []
    if (this.state.userStoryColumn !== null) {
      for (var item in items) {
        UserStoryTitles.push(getColumnValue(items[item].column_values, this.state.userStoryColumn))
      }
    }
    return new Set(UserStoryTitles);
  }

  getItemsObj() {
    if (this.state.userStoryColumn === null) {
      return [];
    }
    var items = this.state.boardData.boards[0].items;
    var itemsList = [];

    for (var item in items) {
      var userStory = getColumnValue(items[item].column_values, this.state.userStoryColumn);
      var status = getColumnValue(items[item].column_values, this.state.statusColumn);

      var itemObj = {
        userStoryName: userStory,
        status: status,
        task: items[item]
      }
      itemsList.push(itemObj);
    }

    this.setState({itemsList: itemsList});
  }

  getItemsByUserStory(itemList) {
    var itemsByUserStory = {};
    for (var item in itemList) {
      var userStory = itemList[item].userStoryName;
      if (itemsByUserStory[userStory] === undefined) {
        itemsByUserStory[userStory] = {};
      }
      var status = itemList[item].status;
      if (itemsByUserStory[userStory][status] === undefined) {
        itemsByUserStory[userStory][status] = [];
      }
      itemsByUserStory[userStory][status].push(itemList[item]);
    }

    return itemsByUserStory
  }

  componentDidMount() {
    monday.listen("context", res => {
      this.setState({context: res.data});
      monday.api(`query ($boardIds: [Int]) { boards (ids:$boardIds) { name columns {id} items { id name column_values {id title text type value} } } }`,
        { variables: {boardIds: this.state.context.boardIds} }
      )
      .then(res => {
        this.setState({boardData: res.data});
        if (this.state.boardData !== undefined) {
          this.getStatusList();
          this.getItemsObj();
        }
      });
      
    })

    monday.listen("settings", res => {
      this.getSettings(res)
    });
    
  }

  handleOnDragEnd(result) {
    if (result.destination === null) {
      return
    }
    var itemId = parseInt(result.draggableId);
    var originObj = JSON.parse(result.source.droppableId);
    var destinationObj = JSON.parse(result.destination.droppableId);

    if (originObj.userStoryName === destinationObj.userStoryName) {
      var copyItemsList = _.cloneDeep(this.state.itemsList);
      console.log(itemId);
      for (var item in copyItemsList) {
        if (parseInt(copyItemsList[item].task.id) === itemId) {
          copyItemsList[item].status = destinationObj.statusLabel;
          var columnValues = copyItemsList[item].task.columns_values;
          for (var columnValue in columnValues) {
            if (columnValues[columnValue].id === this.state.statusColumn) {
              copyItemsList[item].task.columns_values[columnValue].text = destinationObj.statusLabel;
            }
          }
        }
      this.setState({itemsList: copyItemsList});
      }
      monday.api(`mutation ($boardId: Int!, $itemId: Int!, $columnId: String!, $newValue: String!) { change_simple_column_value (board_id: $boardId item_id: $itemId column_id: $columnId value: $newValue) { id } }`,
        { variables: 
          {
            boardId: this.state.context.boardIds[0],
            itemId: itemId,
            columnId: this.state.statusColumn,
            newValue: destinationObj.statusLabel,
          }
        }
      )

    }
  }

  renderUserStoryRow(userStoryObj, userStory) {
    return (
      <UserStoryRow
        userStoryObj = {userStoryObj}
        name = {userStory}
        orderedStatuses = {this.state.orderedStatuses}
        key = {userStory}
      />
    )
  }

  render() {

    var itemsByUserStory = this.getItemsByUserStory(this.state.itemsList);
    return (
      <div
        className="better-scrum-board padding-16"
      >
        <div className="board-header">
          <div className="board-header-item board-header-user-story"></div>
          {this.state.orderedStatuses.map((value, index) => {
            return <div key={value.label} className="board-header-item board-header-status">{value.label}</div>
          })}
        </div>
        <DragDropContext onDragEnd={(result) => this.handleOnDragEnd(result)}>
          <div className="board-content">
            {Object.keys(itemsByUserStory).map((value, index) => {
              return this.renderUserStoryRow(itemsByUserStory[value], value)
            })}
          </div>
        </DragDropContext>
      </div>
    );
  }
}

function getOrderedStatusList(labels, labelColors, labelPositions) {
  var labelObjList = [];
  for (var labelKey in labels) {
    var labelObj = {
      position: labelPositions[labelKey],
      color: labelColors[labelKey]["color"],
      borderColor: labelColors[labelKey]["border"],
      label: labels[labelKey],
    }
    labelObjList.push(labelObj);
  }

  return labelObjList.sort((a, b) => a.position - b.position);
}

function getStatusListFromSettings(settingsStr) {
  var settingsObject = JSON.parse(settingsStr);
  return settingsObject;
}

function getColumnValue(columnValues, columnId) {
  for (var index in columnValues) {
    var columnValue = columnValues[index];
    if (columnValue.id === columnId) {
      return columnValue.text;
    }
  }
  return null;
}

export default App;
