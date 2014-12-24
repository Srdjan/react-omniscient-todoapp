// someFile.js
// var Immutable = require('immstruct/Immutable');
var immstruct = require('immstruct')
var todostore = immstruct({
              completed: 2,
              items: [
                      { checked: false, text: 'Buy milk' },
                      { checked: true,  text: 'Make example application with JSX' },
                      { checked: false, text: 'Compile using the --harmony flag' },
                      { checked: false, text: 'Check checkboxes' },
                      { checked: true,  text: 'Update example to use React 0.12' }
                    ]
    })

// Use event `swap` or `next-animation-frame`
todostore.on('swap', function (newStructure, oldStructure) {
  console.log('New todostore:', newStructure.toJSON())

  // e.g. with usage with React
  // React.render(App({ cursor: todostore.current() }), document.body);
})

// Remember: Cursor is immutable. Update cursor.
// var cursor = todostore.cursor(['completed']).update((x) => x + 1 );
// console.log(cursor.deref()); //=> 3

console.log('Old todostore:', todostore.current.toJSON())

var cursor = todostore.cursor('items').update(items => items.push(immstruct({checked: false, text: 'uhuuu!'}).current) )
// var cursor = todostore.cursor('items').update(items => items.push(Immutable({checked: false, text: 'uhuuu!'})) )

