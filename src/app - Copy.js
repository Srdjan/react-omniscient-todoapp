'use strict'
// omniscient API
// var Component = component([name],[mixins],renderFunction);
// Component([key: String],cursor: Cursor | Object<String, Cursor|Object|Statics>);

// https://github.com/omniscientjs/omniscient/wiki/Basic-Tutorial:-Creating-TodoList-with-Live-Filtering
// http://open.bekk.no/easier-reasoning-with-unidirectional-dataflow-and-immutable-data
//
//  mitrhil example:
//  https://gist.github.com/insin/9639918
//
var React     = require('react'),
    immstruct = require('immstruct'),
    component = require('omniscient');

var todostore = immstruct([
                            { checked: false, text: 'Buy milk' },
                            { checked: true,  text: 'Make example application with JSX' },
                            { checked: false, text: 'Compile using the --harmony flag' },
                            { checked: false, text: 'Check checkboxes' },
                            { checked: true,  text: 'Update example to use React 0.12' }
                          ]
    );

var checkedMixin = {
    onChecked() {
        this.props.todo.update('checked', state => !state);
    }
};

// component need to use function when it takes mixins, as => binds
var Todo = component(checkedMixin, function() {
      return (
            <label>
              <input type="checkbox" onChange={this.onChecked} checked={ this.props.todo.get('checked') } />
              { this.props.todo.get('text')}
            </label>
          )}
);

var TodoList = component(function() {
      return (
            <form>
              <ul>
                { this.props.todos.map((val, i) => <li key={i}><Todo todo={val}/></li>).toArray() }
              </ul>
            </form>
          )}
);

function render() {
  React.render(<TodoList todos={todostore.cursor()}/>, document.body);
};
todostore.on('swap', render);
render();
