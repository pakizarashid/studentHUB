import React, { useState, useReducer } from "react";

const noteReducer = (state, action) => {
  switch (action.type){
      case 'add_notepost':
          return [...state, { title: `Note Post #${state.length + 1}` }];
      default:
          return state;    
  }
}

export const NoteProvider = ({ children }) => {
  // const [notePosts, setNotePosts] = useState([]);
    const [notePosts, dispatch] = useReducer(noteReducer,[]);

  // const addNotePost = () => {
  //   setNotePosts([
  //     ...notePosts,
  //     { title: `Note Post #${notePosts.length + 1}` },
  //   ]);
  // };
  const addNotePost = () => {
    dispatch({type: 'add_notepost'})
  };

  return (
    <NoteContext.Provider value={{ data: notePosts, addNotePost }}>
      {children}
    </NoteContext.Provider>
  );
};

const NoteContext = React.createContext(); //pipe to pass communication

export default NoteContext;
