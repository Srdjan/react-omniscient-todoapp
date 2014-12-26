//- app:     Omniscient-ToDo-app
//- author:  @djidja8
//- version: v0.1
//
'use strict'
var React     = require('react'),
    immstruct = require('immstruct'),
    component = require('omniscient')

//-- todo data store
//
var todostore = immstruct({
                    items: [{checked: false, archived: false, text: 'Buy milk'}]
                })

//-- todo component
//
var todoMixins = {
  onToggled() {
    this.props.todo.update('checked', state => !state)
  },
  onDestroy() {
    this.props.todo.set('archived', true);
  }
}
var Todo = component(todoMixins, function() {
    return (
       <li id="todo-list" className={this.props.todo.get('checked') && 'completed'}>
        <div className="view">
          <input className="toggle"
                 type="checkbox"
                 onChange={this.onToggled}
                 checked={this.props.todo.get('checked')}/>
          <label> {this.props.todo.get('text')} </label>
          <button className="destroy" onClick={this.onDestroy}/>
        </div>
      </li>
    )}
)

//-- todolist component
//
var todoListMixins = {
  onToggled() {
    this.refs.toggleAll.checked = !this.refs.toggleAll.checked
    this.props.todolist.forEach(i => i.update('checked', () => this.refs.toggleAll.checked))
  }
}
var TodoList = component(todoListMixins, function() {
    return (
        <section id="main">
          <input id="toggle-all" type="checkbox"
                                 checked={false}
                                 onChange={this.onToggled}
                                 ref="toggleAll"/>
          <ul id="todo-list">
            {
              this.props.todolist.map((i, indx) =>
                i.get('archived') ? '' : <Todo key={indx} todo={i}/>).toArray()
            }
          </ul>
        </section>
    )}
)

//-- main component
//
var mainMixins = {
  onAdded(event) {
    if (event.key === 'Enter') {
      var val = this.refs.text.getDOMNode().value.trim()
      if (val) {
        this.props.todolist.update(items => items.push(
                                   immstruct({checked: false, archived: false, text: val})
                                   .current))
        this.refs.text.getDOMNode().value = ''
      }
    }
  },
  clearCompleted() {
    this.props.todolist.update(items => items.filter(i => !i.get('checked')))
  },
  itemsLeft() {
    return this.props.todolist.count(i => !i.get('checked') && !i.get('archived'))
  }
}
var Main = component(mainMixins, function() {
    return (
      <div id="todoapp">
        <header id="header">
          <h1> Todos </h1>
          <input id="new-todo" type='text' placeholder='What needs to be done?'
                                           autoFocus={true}
                                           onKeyDown={this.onAdded}
                                           ref="text"/>
        </header>

        { <TodoList todolist={this.props.todolist}/> }

        <footer id="footer">
          <span id="todo-count">
            <strong> {this.itemsLeft()} items left </strong>
          </span>
          <ul id="filters">
            <li className="selected"><a href="#/"> All </a></li>
            <li><a href="#/active"> Active </a></li>
            <li><a href="#/completed"> Completed </a></li>
            <li><a href="#/archived"> Archived </a></li>
          </ul>
          <button id="clear-completed" onClick={this.clearCompleted}> Clear Completed </button>
          <div id="info">
            <p>Created by <a href="http://twitter.com/djidja8/" target="_blank">djidja8</a></p>
          </div>
        </footer>
      </div>
    )
})

//-- start
//
function render() {
  React.render(<Main todolist={todostore.cursor('items')}/>, document.body);
}
todostore.on('swap', render)
render()
